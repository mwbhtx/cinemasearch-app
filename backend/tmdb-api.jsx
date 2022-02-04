const axios = require('axios');

const tmdbBaseURL = 'https://api.themoviedb.org/3/';
const movieSearchEndpoint = 'search/movie';
const tvSearchEndpoint = 'search/tv';

function buildTmdbResponseConfig(url, query) {

    return {
        url: url,
        headers: {
            'Authorization': 'Bearer ' + process.env.THEMOVIEDB_API_KEY,
        },
        params: {
            query: query,
            include_adult: false,
        }
    }
}

function initializeTmdbConfig() {

    axios.get(tmdbBaseURL + 'configuration',
    {
        headers: {'Authorization': 'bearer ' + process.env.THEMOVIEDB_API_KEY}
    })
    .then( response => {
        tmdbConfigurationData = response.data;
        console.log('Successfully loaded TMDB configuration data on startup.');
    })
    .catch( error => {
        // fatal error
        console.log('Error fetching TMDB configuration data on startup.');
        console.log(error);
    })

}

function tmdbResultsToArray(response) {

        // extract results array from response
        const resultsArray = response.data.results;
        return resultsArray;

}

function tmdbFilterResultsArray(originalArray) {

        // filter results based on vote_count property to extract meaningful results
        const filteredArray = originalArray.filter( object => (object.vote_count >= 2 && object.poster_path));

        // return filtered array
        return filteredArray;
}

function buildCinemaSearchTVResponseObject(resultsArray) {

    // fetch available service provider for content


    // build array of valid objects and return response
    const mappedArray = resultsArray.map( obj => {
        return {
            title: obj.name,
            image_url: obj.poster_path ? (tmdbConfigurationData.images.secure_base_url+tmdbConfigurationData.images.poster_sizes[4]+obj.poster_path) : null,
            tmdb_id: obj.id,
            type: 'tv',
        }
    })

    return mappedArray;
}


function buildCinemaSearchMovieResponseObject(resultsArray) {

    // fetch available service provider for content


    // build array of valid objects and return response
    const mappedArray = resultsArray.map( obj => {
        return {
            title: obj.title,
            image_url: obj.poster_path ? (tmdbConfigurationData.images.secure_base_url+tmdbConfigurationData.images.poster_sizes[4]+obj.poster_path) : null,
            tmdb_id: obj.id,
            type: 'movie',
        }
    })

    return mappedArray;
}

function filterResponseData(response) {
    
    // convert data to an array
    const resultsArray = tmdbResultsToArray(response);

    // filter data
    return tmdbFilterResultsArray(resultsArray);

}

async function fetchMovieData(req,res) {

    try {
       
        // fetch tmdb response
        const tmdbResponse = await axios(buildTmdbResponseConfig(tmdbBaseURL + movieSearchEndpoint, req.query.query));
        
        // response to return back to client
        const filteredResponse = filterResponseData(tmdbResponse);
    
        // build client json response
        const cinemaSearchResponseBody = buildCinemaSearchMovieResponseObject(filteredResponse);
        
        // send data to client
        res.send(cinemaSearchResponseBody);
    }
    catch (error) {
        res.send(error);
    }
}

async function fetchTvData(req, res) {

    try {
        // fetch tmdb response
        const tmdbResponse = await axios(buildTmdbResponseConfig(tmdbBaseURL + tvSearchEndpoint, req.query.query));
        
        // response to return back to client
        const filteredResponse = filterResponseData(tmdbResponse);
        
        // build client json response
        const cinemaSearchResponseBody = buildCinemaSearchTVResponseObject(filteredResponse);

        // send data to client
        res.send(cinemaSearchResponseBody);
    }
    catch (error) {
        res.send(error);
    }
}

async function fetchStreamData(req,res) {

    var options = {
        method: 'GET',
        url: 'https://streaming-availability.p.rapidapi.com/get/basic',
        params: {country: 'us', tmdb_id: req.params.type + '/' + req.params.id},
        headers: {
        'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
        'x-rapidapi-key': process.env.MOTN_API_KEY,
        }
    };

    axios.request(options).then(function (response) {

        const clientResponse = {
            streamingInfo: response.data.streamingInfo,
        }

        res.send(clientResponse);
        
    }).catch(function (error) {
        console.log(error);
        res.send(error);
    });
    
}

module.exports.initializeTmdbConfig = initializeTmdbConfig;
module.exports.fetchMovieData = fetchMovieData;
module.exports.fetchTvData = fetchTvData;
module.exports.fetchStreamData = fetchStreamData;