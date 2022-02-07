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
const port = process.env.PORT || 8080;

// initialize tmdb api config data
tmdb.initializeTmdbConfig();

// setup movie request endpoint
app.get('/v1/movie', async (req,res) => {
    res.send(await tmdb.fetchMovieData(req));
})

// setup movie request endpoint
app.get('/v1/tv', async (req,res) => {
    res.send(await tmdb.fetchTvData(req));
})

// setup movie request endpoint
app.get('/v1/streams/:type/:id', async (req,res) => {
    res.send(await tmdb.fetchStreamData(req));
})

// endpoint to search same title in both tv & movie categories
app.get('/v1/multi', async (req, res) => {
    res.send(await tmdb.fetchMultiMediaTypeData(req));
})

// spin up express server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
  