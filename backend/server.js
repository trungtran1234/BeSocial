const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const app = express()
const bcrypt = require('bcryptjs');

app.use(express.static(path.join(__dirname, 'build')))
app.use(cors())
app.use(express.json())

const port = 5000

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

//middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).send('Invalid token.');
        }

        req.userId = decoded.userId;
        next();
    });
};

//register
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        (err, result) => {
            if (err) {
                res.status(500).send('Error registering user');
            } else {
                const userId = result.insertId; //new user id (cuz new user)
                const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
                res.status(201).send({ token });
            }
        }
    );
});

//login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            res.status(500).send('Database error');
        } else if (results.length === 0) {
            res.status(401).send('User not found');
        } else {
            const user = results[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });//generate token
                return res.status(200).send({ token }); //send token to frontend
            } else {
                return res.status(401).send('Incorrect password');
            }
        }
    });
});

//home page
app.get('/', authenticateToken, (req, res) => {
    res.send('This the home page');
});

//post events
app.post('/events', authenticateToken, (req, res) => {
    const { title, description, location, capacity, category, startTime, endTime } = req.body;

    if (!title || !description || !location || !capacity || !category || !startTime || !endTime) {
        return res.status(400).send('All fields are required.');
    }
    //check start time is before end time
    if (new Date(startTime) >= new Date(endTime)) {
        return res.status(400).send('Start time must be before end time.');
    }

    const eventData = {
        title,
        description,
        location,
        capacity,
        category,
        start_time: startTime,
        end_time: endTime,
        host_user_id: req.userId,
    };

    db.query(
        'INSERT INTO events SET ?',
        eventData,
        (err, result) => {
            if (err) {
                console.error('Error creating event:', err);
                return res.status(500).send('Error creating event');
            }
            return res.status(201).send({ eventId: result.insertId, message: 'Event created successfully' });
        }
    );
});

//get eventrs
app.get('/events', authenticateToken, (req, res) => {
    const { category, location, startTime, endTime } = req.query;

    let query = 'SELECT * FROM events WHERE 1=1';
    const queryParams = [];

    if (category) {
        query += ' AND category = ?';
        queryParams.push(category);
    }

    if (location) {
        query += ' AND location = ?';
        queryParams.push(location);
    }

    if (startTime) {
        query += ' AND start_time >= ?';
        queryParams.push(startTime);
    }

    if (endTime) {
        query += ' AND end_time <= ?';
        queryParams.push(endTime);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error retrieving events:', err);
            return res.status(500).send('Error retrieving events');
        }

        return res.status(200).send(results);
    });
});

//update event
app.put('/events/:id', authenticateToken, (req, res) => {
    const eventId = req.params.id;
    const { title, description, location, capacity, category, startTime, endTime } = req.body;

    db.query(
        'SELECT * FROM events WHERE id = ? AND host_user_id = ?',
        [eventId, req.userId],
        (err, results) => {
            if (err) {
                console.error('Error finding event:', err);
                return res.status(500).send('Error finding event');
            }

            if (results.length === 0) {
                return res.status(404).send('Event not found or you are not the host');
            }

            if (new Date(startTime) >= new Date(endTime)) {
                return res.status(400).send('Start time must be before end time.');
            }

            const updatedData = {
                title,
                description,
                location,
                capacity,
                category,
                start_time: startTime,
                end_time: endTime,
            };

            db.query(
                'UPDATE events SET ? WHERE id = ?',
                [updatedData, eventId],
                (updateErr) => {
                    if (updateErr) {
                        console.error('Error updating event:', updateErr);
                        return res.status(500).send('Error updating event');
                    }

                    return res.status(200).send({ message: 'Event updated successfully' });
                }
            );
        }
    );
});

//delete event
app.delete('/events/:id', authenticateToken, (req, res) => {
    const eventId = req.params.id;

    db.query(
        'SELECT * FROM events WHERE id = ? AND host_user_id = ?',
        [eventId, req.userId],
        (err, results) => {
            if (err) {
                console.error('Error finding event:', err);
                return res.status(500).send('Error finding event');
            }

            if (results.length === 0) {
                return res.status(404).send('Event not found or you are not the host');
            }

            db.query(
                'DELETE FROM events WHERE id = ?',
                [eventId],
                (deleteErr) => {
                    if (deleteErr) {
                        console.error('Error deleting event:', deleteErr);
                        return res.status(500).send('Error deleting event');
                    }

                    return res.status(200).send({ message: 'Event deleted successfully' });
                }
            );
        }
    );
});

app.get('/profile', authenticateToken, (req, res) => {
    const userId = req.userId;
    db.query('SELECT username FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving user');
        }
        if (results.length > 0) {
            res.status(200).send(results[0].username);
        }
    });
});

app.post('follow/:id', authenticateToken, (req, res) => {
    const userId = req.userId;
    const followingId = req.params.id;
    db.query('INSERT INTO following (id, following_id) VALUES (?, ?)', [userId, followingId], (err, results) => {
        if (err) {
            return res.status(500).send('Error following user');
        }
        else {
            return res.status(200).send('User followed');
        }
    })
    db.query('INSERT INTO followers (id, follower_id) VALUES (?, ?)', [followingId, userId], (err, results) => {
        if (err) {
            return res.status(500).send('Error following user');
        }
        else {
            return res.status(200).send('New follower');
        }
    })
});