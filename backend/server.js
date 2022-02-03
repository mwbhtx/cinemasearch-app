const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

// activate dotenv
dotenv.config();

// disable cors policy for all request
app.use(cors());

// set listen port
const port = process.env.PORT || 3002;
const apiKey = process.env.WATCHMODE_API_KEY;

console.log(apiKey);

// setup get callback for '/' endpoint
app.get(path = '/', (req, res) => {
    const returnMessage = `GET Request at path "${path}" successful.`;
    console.log(returnMessage);
    res.send(returnMessage);
})

// setup movie request endpoint
app.get('/search?token', (req,res) => {
    console.log('Hello?');
    req.send('What else?');
})

// spin up express server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
  