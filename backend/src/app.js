const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Career Bridge API is running');
});

module.exports = app;
