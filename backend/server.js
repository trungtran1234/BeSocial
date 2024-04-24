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

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Access denied');
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        req.userId = decoded.userId;
        next();
    });
};

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
                res.status(201).send('User registered successfully');
            }
        }
    );
});

const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

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
                const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
                res.status(200).send({ token });
            } else {
                res.status(401).send('Incorrect password');
            }
        }
    });
});

app.get('/', authenticateToken, (req, res) => {
    res.send('This is a protected endpoint');
});

