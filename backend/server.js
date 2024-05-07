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
app.post('/event_walls', authenticateToken, (req, res) => {
    const { title, description, location, capacity, category, startTime, endTime } = req.body;

    if (!title || !description || !location || !capacity || !category || !startTime || !endTime) {
        return res.status(400).send('All fields are required.');
    }
    //check start time is before end time
    if (new Date(startTime) >= new Date(endTime)) {
        return res.status(400).send('Start time must be before end time.');
    }
    db.query('SELECT username FROM users WHERE id = ?', [req.userId], (err, results) => {
        if (err) {
            console.error('Error finding user:', err);
            return res.status(500).send('Error finding user');
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
            host_username: results[0].username,
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
        )
    });
});

// get event by id
app.get('/events/:id', authenticateToken, (req, res) => {
    const eventId = req.params.id;
    db.query('SELECT * FROM events WHERE id = ?', [eventId], (err, results) => {
        if (err) {
            console.error('Error retrieving event:', err);
            return res.status(500).send('Error retrieving event');
        }
        if (results.length > 0) {
            res.status(200).send(results[0]);
        } else {
            res.status(404).send('Event not found');
        }
    });
});

app.get('/events', authenticateToken, (req, res) => {
    const userId = req.userId;
    db.query(`
    SELECT e.*,
    (eb.user_id IS NOT NULL) AS isBookmarked,
    (ef.user_id IS NOT NULL) AS isAttending
    FROM events e
    LEFT JOIN bookmark eb ON e.id = eb.event_id AND eb.user_id = ?
    LEFT JOIN event_following ef ON e.id = ef.event_id AND ef.user_id = ?
    WHERE ef.user_id IS NULL
    `, [userId, userId], (err, results) => {
        if (err) {
            console.error('Error retrieving events:', err);
            return res.status(500).send('Error retrieving events');
        }
        res.status(200).send(results);
    });
});



//get user's events
app.get('/user_events', authenticateToken, (req, res) => {
    const { category, location, startTime, endTime } = req.query;

    let query = 'SELECT * FROM events WHERE host_user_id = ?';
    const queryParams = [req.userId]; // Use req.userId to filter events by user's ID

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
            console.error('Error retrieving user events:', err);
            return res.status(500).send('Error retrieving user events');
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
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }
        const username = results[0].username;
        const userData = { username };
        db.query(`
            SELECT users.username, users.id
            FROM users 
            JOIN following ON users.id = following.following_id 
            WHERE following.id = ?`, [userId], (err, followingResults) => {
            if (err) {
                return res.status(500).send('Error retrieving following list');
            }
            userData.following = followingResults.map(f => f.username);
            db.query(`
                SELECT users.username, users.id
                FROM users 
                JOIN followers ON users.id = followers.follower_id 
                WHERE followers.id = ?`, [userId], (err, followersResults) => {
                if (err) {
                    return res.status(500).send('Error retrieving followers list');
                }
                userData.followers = followersResults.map(f => f.username);
                res.status(200).send(userData);
            });
        });
    });
});


app.get('/profile/:id', authenticateToken, (req, res) => {
    const userId = req.params.id;

    if (String(userId) === String(req.userId)) {
        res.json({ redirectTo: '/profile' });
    } else {
        db.query('SELECT username FROM users WHERE id = ?', [userId], (err, results) => {
            if (err) {
                return res.status(500).send('Error retrieving user');
            }
            if (results.length === 0) {
                return res.status(404).send('User not found');
            }

            const username = results[0].username;
            const userData = { username, following: [], followers: [] };
            db.query(`
                SELECT users.id, users.username 
                FROM users 
                JOIN following ON users.id = following.following_id 
                WHERE following.id = ?`, [userId], (err, followingResults) => {
                if (err) {
                    return res.status(500).send('Error retrieving following list');
                }
                userData.following = followingResults.map(f => ({ id: f.id, username: f.username }));
                db.query(`
                    SELECT users.id, users.username 
                    FROM users 
                    JOIN followers ON users.id = followers.follower_id 
                    WHERE followers.id = ?`, [userId], (err, followersResults) => {
                    if (err) {
                        return res.status(500).send('Error retrieving followers list');
                    }
                    userData.followers = followersResults.map(f => ({ id: f.id, username: f.username }));
                    res.status(200).json(userData);
                });
            });
        });
    }
});


app.post('/follow/:id', authenticateToken, (req, res) => {
    const userId = req.userId;
    const followingId = req.params.id;

    db.query('INSERT INTO following (id, following_id) VALUES (?, ?)', [userId, followingId], (err, results) => {
        if (err) {
            console.error('Error following user:', err);
            return res.status(500).send('Error following user');
        }
        db.query('INSERT INTO followers (id, follower_id) VALUES (?, ?)', [followingId, userId], (err, results) => {
            if (err) {
                console.error('Error adding follower:', err);
                return res.status(500).send('Error adding follower');
            }
            return res.status(200).send('Follow successful');
        });
    });
});

//get following user
app.get('/following/:id', authenticateToken, (req, res) => {
    const userId = req.userId;
    const followingId = req.params.id;

    db.query('SELECT 1 FROM following WHERE id = ? AND following_id = ?', [userId, followingId], (err, results) => {
        if (err) {
            console.error('Error retrieving following:', err);
            return res.status(500).send('Error retrieving following');
        }
        return res.status(200).send({ isFollowing: results.length > 0 });
    });
});

//Unfollow user
app.post('/unfollow/:id', authenticateToken, (req, res) => {
    const userId = req.userId;
    const followingId = req.params.id;

    db.query('DELETE FROM following WHERE id = ? AND following_id = ?', [userId, followingId], (err, results) => {
        if (err) {
            console.error('Error unfollowing user:', err);
            return res.status(500).send('Error unfollowing user');
        }
        db.query('DELETE FROM followers WHERE id = ? AND follower_id = ?', [followingId, userId], (err, results) => {
            if (err) {
                console.error('Error removing follower:', err);
                return res.status(500).send('Error removing follower');
            }
            return res.status(200).send('Unfollow successful');
        });
    });
});

//Event followers
app.post('/post_event_following/:id', authenticateToken, (req, res) => {
    const userId = req.userId;
    const eventId = req.params.id;

    db.query('INSERT INTO event_following (user_id, event_id) VALUES (?, ?)', [userId, eventId], (err, results) => {
        if (err) {
            console.error('Error following event:', err);
            return res.status(500).send('Error following event');
        }
        db.query('INSERT INTO event_followers (event_id, user_id) VALUES (?, ?)', [eventId, userId], (err, results) => {
            if (err) {
                console.error('Error adding event follower:', err);
                return res.status(500).send('Error adding follower');
            }
            return res.status(200).send(userId + ' Sucessfully follow ' + eventId);
        });
    });
});

//get attending event
app.get('/get_event_following', authenticateToken, (req, res) => {
    const userId = req.userId;

    db.query('SELECT event_id FROM event_following WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error retrieving following:', err);
            return res.status(500).send('Error retrieving event_following');
        }
        const eventIds = results.map(row => row.event_id);

        if (eventIds.length === 0) {
            return res.status(200).send([]);
        }

        // Extend the query to check bookmark status
        db.query(`
            SELECT e.*, 
            (SELECT COUNT(*) FROM bookmark WHERE event_id = e.id AND user_id = ?) > 0 AS isBookmarked
            FROM events e
            WHERE e.id IN (?)
        `, [userId, eventIds], (err, eventResults) => {
            if (err) {
                console.error('Error retrieving events:', err);
                return res.status(500).send('Error retrieving events');
            }
            res.status(200).send(eventResults);
        });
    });
});

//get event's guest
app.get('/get_event_follower/:id', authenticateToken, (req, res) => {
    const eventId = req.params.id;

    db.query('SELECT user_id FROM event_followers WHERE event_id = ?', [eventId], (err, results) => {
        if (err) {
            console.error('Error retrieving following:', err);
            return res.status(500).send('Error retrieveing event_following');
        }
        const guestId = results.map(row => row.user_id);

        if (guestId.length === 0) {
            return res.status(200).send([]);
        }
        db.query('SELECT * FROM users WHERE id IN (?)', [guestId], (err, eventResults) => {
            if (err) {
                console.error('Error retrieving events:', err);
                return res.status(500).send('Error retrieving events');
            }
            res.status(200).send(eventResults);
        });
    })
});


app.post('/post_event_unfollowing/:id', authenticateToken, (req, res) => {
    const userId = req.userId;
    const eventId = req.params.id;

    db.query('DELETE FROM event_following WHERE user_id = ? AND event_id = ?', [userId, eventId], (err, results) => {
        if (err) {
            console.error('Error unfollowing user:', err);
            return res.status(500).send('Error unfollowing user');
        }
        db.query('DELETE FROM event_followers WHERE event_id = ? AND user_id = ?', [eventId, userId], (err, results) => {
            if (err) {
                console.error('Error removing follower:', err);
                return res.status(500).send('Error removing follower');
            }
            return res.status(200).send('Unfollow successful');
        });
    });
});

app.get('/events/:id/comments', authenticateToken, (req, res) => {
    const eventId = req.params.id;
    db.query('SELECT comments.*, users.username AS username FROM comments JOIN users ON comments.user_id = users.id WHERE event_id = ?', [eventId], (err, results) => {
        if (err) {
            console.error('Error retrieving comments:', err);
            return res.status(500).send('Error retrieving comments');
        }
        res.status(200).send(results);
    });
});

app.post('/events/:id/comments', authenticateToken, (req, res) => {
    const eventId = req.params.id;
    const { content } = req.body;
    const userId = req.userId

    if (!content) {
        return res.status(400).send('Comment content cannot be empty.');
    }

    const insertQuery = 'INSERT INTO comments (event_id, user_id, content) VALUES (?, ?, ?)';
    db.query(insertQuery, [eventId, userId, content], (err, result) => {
        if (err) {
            console.error('Error posting comment:', err);
            return res.status(500).send('Error posting comment');
        }

        const userQuery = 'SELECT username FROM users WHERE id = ?';
        db.query(userQuery, [userId], (err, userResults) => {
            if (err) {
                console.error('Error retrieving username:', err);
                return res.status(500).send('Error retrieving username');
            }
            const newComment = {
                id: result.insertId,
                event_id: eventId,
                user_id: userId,
                username: userResults[0].username,
                content: content,
                created_at: new Date()
            };
            res.status(201).send(newComment);
        });
    });
});

app.post('/post_event_following/:id', authenticateToken, (req, res) => {
    const userId = req.userId;
    const eventId = req.params.id;

    db.query('INSERT INTO event_following (user_id, event_id) VALUES (?, ?)', [userId, eventId], (err, results) => {
        if (err) {
            console.error('Error following event:', err);
            return res.status(500).send('Error following event');
        }
        db.query('INSERT INTO event_followers (event_id, user_id) VALUES (?, ?)', [eventId, userId], (err, results) => {
            if (err) {
                console.error('Error adding event follower:', err);
                return res.status(500).send('Error adding follower');
            }
            return res.status(200).send('Follow successful');
        });
    });
});

app.post('/bookmark/:id', authenticateToken, (req, res) => {
    const userId = req.userId;
    const eventId = req.params.id;

    // Check if the event exists
    db.query('SELECT id FROM events WHERE id = ?', [eventId], (err, results) => {
        if (err) {
            return res.status(500).send('Database error while checking event');
        }
        if (results.length === 0) {
            return res.status(404).send('Event not found');
        }

        // Insert bookmark
        db.query('INSERT INTO bookmark (user_id, event_id) VALUES (?, ?)', [userId, eventId], (err, results) => {
            if (err) {
                console.error('Error bookmarking event:', err);
                return res.status(500).send('Error bookmarking event');
            }
            return res.status(200).send({ message: 'Event bookmarked successfully' });
        });
    });
});

app.post('/unbookmark/:id', authenticateToken, (req, res) => {
    const userId = req.userId;
    const eventId = req.params.id;

    db.query('DELETE FROM bookmark WHERE user_id = ? AND event_id = ?', [userId, eventId], (err, results) => {
        if (err) {
            console.error('Error unbookmarking event:', err);
            return res.status(500).send('Error unbookmarking event');
        }
        return res.status(200).send({ message: 'Event unbookmarked successfully' });
    });
});

app.get('/bookmarked_events', authenticateToken, (req, res) => {
    const userId = req.userId;

    db.query('SELECT e.* FROM events e JOIN bookmark eb ON e.id = eb.event_id WHERE eb.user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error retrieving bookmarked events:', err);
            return res.status(500).send('Error retrieving bookmarked events');
        }
        res.status(200).send(results);
    });
});

app.get('/user/:id/following', authenticateToken, (req, res) => {
    const userId = req.params.id;

    db.query('SELECT u.id, u.username FROM users u JOIN following f ON u.id = f.following_id WHERE f.id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error retrieving following list:', err);
            return res.status(500).send('Error retrieving following list');
        }
        res.send(results);
    });
});

app.get('/user/:id/followers', authenticateToken, (req, res) => {
    const userId = req.params.id;

    db.query('SELECT u.id, u.username FROM users u JOIN followers f ON u.id = f.follower_id WHERE f.id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error retrieving followers list:', err);
            return res.status(500).send('Error retrieving followers list');
        }
        res.send(results);
    });
});

app.get('/event_wall', authenticateToken, (req, res) => {
    const userId = req.userId;
    db.query(`
        SELECT events.id AS event_id, events.*, 
        (eb.user_id IS NOT NULL) AS isBookmarked,
        (ef.user_id IS NOT NULL) AS isAttending
        FROM events 
        JOIN following ON events.host_user_id = following.following_id
        LEFT JOIN bookmark eb ON events.id = eb.event_id AND eb.user_id = ?
        LEFT JOIN event_following ef ON events.id = ef.event_id AND ef.user_id = ?
        WHERE following.id = ? AND ef.user_id IS NULL
    `, [userId, userId, userId], (err, results) => {
        if (err) {
            console.error('Error retrieving events:', err);
            return res.status(500).send('Error retrieving events');
        }
        return res.status(200).send(results);
    });
});
