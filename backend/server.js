const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const app = express()

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

console.log('host:', process.env.DB_HOST);
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