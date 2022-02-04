const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const tmdb = require('./tmdb-api.jsx');  
const app = express();

// activate dotenv
dotenv.config();

// disable cors policy for all request
app.use(cors());

// set listen port
const port = process.env.PORT;
const apiKey = process.env.WATCHMODE_API_KEY;

// initialize tmdb api config data
tmdb.initializeTmdbConfig();

// setup get callback for '/' endpoint
app.get(path = '/', (req, res) => {
    let returnMessage = `GET Request at path "${path}" successful.\n`;
    returnMessage += `Queries Received: ${JSON.stringify(req.query)}`;
    console.log(returnMessage);
    res.send(returnMessage);
})

// setup movie request endpoint
app.get('/v1/movie', (req,res) => {
    console.log('Movie Search Requested.');
    tmdb.fetchMovieData(req,res);
})

// setup movie request endpoint
app.get('/v1/tv', (req,res) => {
    console.log('TV Search Requested.');
    tmdb.fetchTvData(req,res);
})

// setup movie request endpoint
app.get('/v1/streams/:type/:id', (req,res) => {
    console.log('Streaming Services Requested.');
    tmdb.fetchStreamData(req,res);
})

// spin up express server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
  