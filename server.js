
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const { response } = require('express');
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
app.use(cors());
// app.use(express.static('./public'));

const PORT = process.env.PORT || 3000;

client.connect().then(() => {
  app.listen(PORT,() => console.log(`Listening on port ${PORT}`));
});


// ----------- Gets API ----------- //

app.get('/', function (req, res) {
  res.status(200).send('Welcome to the ?best? API');
});

app.get('/show', function (req, res) {
  let SQL = 'SELECT * FROM locations'
  client.query(SQL).then(result => {
    res.status(200).send(result.rows);
  });
});

app.get('/location', function (req, res) {
  let city = req.query.city;
  let isWrong = badInput(city);
 
  if(isWrong) {
    res.status(403).send({ 'status': 403, msg: 'Wrong input'});
  } 
  else {
    existsDB(city).then(doesExist => {
      if (doesExist.length>0) {
        res.status(200).send(doesExist[0]);
  
      } else {
        const geo_key = process.env.GEOCODE_API_KEY;
        let url = `https://eu1.locationiq.com/v1/search.php?key=${geo_key}&q=${city}&addressdetails=1&format=json`;

        superagent.get(url).then( data => {
          let locationData = new Location(city, data.body);
          insertDB(locationData);
          res.status(200).send(locationData);
        });
      }
    });
  }
});

app.get('/weather', (req, res) => {
  Weather.all = [];
  let locationLat = req.query.latitude;
  let locationLon = req.query.longitude;

  const weather_key = process.env.WEATHER_API_KEY;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${locationLat}&lon=${locationLon}&days=6&key=${weather_key}`;

  superagent.get(url).then( data => {
    let weatherData = JSON.parse(data.text).data;

    weatherData.map(element => {
      let localWeather = new Weather(element);
      Weather.all.push(localWeather);
    })
    res.status(200).json(Weather.all);
  });
});

app.get('/trails', (req, res) => {
  Trail.all = [];
  let locationLat = req.query.latitude;
  let locationLon = req.query.longitude;
  let maxDistance = 100; // In KMs
  let maxResults = 5;

  const trail_key = process.env.TRAIL_API_KEY;
  let url = `https://www.hikingproject.com/data/get-trails?lat=${locationLat}&lon=${locationLon}&maxDistance=${maxDistance}&maxResults=${maxResults}&key=${trail_key}`;

  superagent.get(url).then( data => {
    let trailData = JSON.parse(data.text).trails;

    trailData.map(element => {
      let localTrail = new Trail(element);
      Trail.all.push(localTrail);
    })
    res.status(200).json(Trail.all);
  });
});

app.get('/movies', (req, res) => {
  Movie.all = [];
  let region_code = req.query.country_code;
  let page_limit = 6;

  const movie_key = process.env.MOVIE_API_KEY;
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${movie_key}&language=en-US&region=${region_code}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;

  superagent.get(url).then( data => {
    let movieData = JSON.parse(data.text).results;

    for (var i = 0; i < page_limit; i++) {
      let localMovie = new Movie(movieData[i]);
      Movie.all.push(localMovie);
    }
    res.status(200).json(Movie.all);
  });
});

app.get('/yelp', (req, res) => {
  Yelp.all = [];
  let locationLat = req.query.latitude;
  let locationLon = req.query.longitude;
  let limit = 5;
  let offset = (req.query.page-1)*5;

  const yelp_key = process.env.YELP_API_KEY;
  let url = `https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${locationLat}&longitude=${locationLon}&limit=${limit}&offset=${offset}`;

  superagent.get(url)
  .set('Authorization', `Bearer ${yelp_key}`)
  .then( data => {
    let yelpData = data.body.businesses;
    yelpData.map(element => {
      let localYelp = new Yelp(element);
      Yelp.all.push(localYelp);
    })
    res.status(200).json(Yelp.all);
  });
});

app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

// ----------- constructors and functions ----------- //

function Location(city, data) {
  this.search_query = city;
  this.formatted_query = data[0].display_name;
  this.latitude = data[0].lat;
  this.longitude = data[0].lon;
  this.country_code = data[0].address.country_code.toUpperCase();
}

function Weather(data) {
  this.forecast = data.weather.description;
  this.time = data.valid_date;
}

function Trail(data) {
  this.name = data.name;
  this.location = data.location;
  this.length = data.length;
  this.stars = data.stars;
  this.star_votes = data.starVotes;
  this.summary = data.summary;
  this.trail_url = data.url;
  this.conditions = data.conditionStatus;
  this.condition_details = data.conditionDetails;
  this.condition_time = data.conditionDate;
}

function Movie(data) {
  this.title = data.title;
  this.overview = data.overview;
  this.average_votes = data.vote_average;
  this.total_votes = data.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  this.popularity = data.popularity;
  this.released_on = data.release_date;
}

function Yelp(data) {
  this.name = data.name;
  this.image_url = data.image_url;
  this.price = data.price;
  this.rating = data.rating;
  this.url = data.url;
}

let badInput = (city) => !city ? true : false ;

function existsDB(city) {
  let SQL = `SELECT search_query,formatted_query,latitude,longitude,country_code FROM locations WHERE search_query=$1;`;
  let values = [city];
  let query = client.query(SQL, values).then((result) => {
    return result.rows;
  });
  return query;
}

function insertDB(data) {
  let SQL = `INSERT INTO locations (search_query,formatted_query,latitude,longitude,country_code) VALUES ($1,$2,$3,$4,$5)`;
  let values = [data.search_query,data.formatted_query,data.latitude,data.longitude,data.country_code];
  client.query(SQL, values);
  console.log(SQL, values);
}