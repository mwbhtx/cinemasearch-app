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
    })
    .catch( error => {
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
            vote_count: obj.vote_count,
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
            vote_count: obj.vote_count,
            type: 'movie',
        }
    })

    return mappedArray;
}

function filterResponseData(response) {
    
    // convert data to an array
    const resultsArray = tmdbResultsToArray(response);

    //
    const filteredArray = tmdbFilterResultsArray(resultsArray);

    // filter data
    return tmdbFilterResultsArray(filteredArray);

}

function sortTmdbResultsArrayByMostVotes(responseArray) {

    responseArray.sort( (firstItem, secondItem) => {

        if (firstItem.vote_count > secondItem.vote_count) {
            return -1;
        } if (firstItem.vote_count < secondItem.vote_count) {
            return 1;
        } else {
            return 0;
        }
    });

    return responseArray;

}

async function fetchMovieData(req) {

    try {
       
        // fetch tmdb response
        const tmdbResponse = await axios(buildTmdbResponseConfig(tmdbBaseURL + movieSearchEndpoint, req.query.query));
        
        // response to return back to client
        const filteredResponse = filterResponseData(tmdbResponse);
    
        // build client json response
        const cinemaSearchResponseBody = buildCinemaSearchMovieResponseObject(filteredResponse);

        // sort response by most votes
        sortTmdbResultsArrayByMostVotes(cinemaSearchResponseBody);
        
        // send data to client
        return cinemaSearchResponseBody;
    }
    catch (error) {
        return error;
    }
}

async function fetchTvData(req) {

    try {
        // fetch tmdb response
        const tmdbResponse = await axios(buildTmdbResponseConfig(tmdbBaseURL + tvSearchEndpoint, req.query.query));
        
        // response to return back to client
        const filteredResponse = filterResponseData(tmdbResponse);
        
        // build client json response
        const cinemaSearchResponseBody = buildCinemaSearchTVResponseObject(filteredResponse);

        // sort response by most votes
        sortTmdbResultsArrayByMostVotes(cinemaSearchResponseBody);

        // send data to client
        return cinemaSearchResponseBody;
    }
    catch (error) {
        return error;
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

    try {

        const response = await axios(options);

        console.log(JSON.stringify(response.data.streamingInfo, null, 2));
        
        return response.data.streamingInfo;
    }
    catch (error) {
        return error;
    }

}

async function fetchMultiMediaTypeData(req) {

    const tvResponse = await fetchTvData(req);

    const movieResponse = await fetchMovieData(req);

    const clientResponse = tvResponse.concat(movieResponse); 

    sortTmdbResultsArrayByMostVotes(clientResponse);

    return clientResponse;
    
}

module.exports.fetchMultiMediaTypeData = fetchMultiMediaTypeData;
module.exports.initializeTmdbConfig = initializeTmdbConfig;
module.exports.fetchMovieData = fetchMovieData;
module.exports.fetchTvData = fetchTvData;
module.exports.fetchStreamData = fetchStreamData;