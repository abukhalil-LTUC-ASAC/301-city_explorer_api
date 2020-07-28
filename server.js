
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

// ----------- Global Vars ----------- //

var locationLatLon = [];

// ----------- Gets API ----------- //

app.get('/', function (req, res) {
  res.status(200).send('Welcome to the ?best? API');
});

app.get('/show', function (req, res) {
  let SQL = 'SELECT * FROM locations'
  console.log('do');

  client.query(SQL).then(result => {
    res.status(200).send(result.rows);
  });
});

app.get('/location', function (req, res) {
  let city = req.query.city;
  let isWrong = badInput(city);
 
  if(isWrong) {
    console.log(city, isWrong)
    res.status(403).send({ 'status': 403, msg: 'Wrong input'});
  } 
  else {
    existsDB(city).then(doesExist => {
      if (doesExist.length>0) {
        console.log('exists', doesExist);
        locationLatLon = [doesExist[0].latitude, doesExist[0].longitude];
        res.status(200).send(doesExist[0]);
  
      } else {
        console.log('not exists', doesExist);

        const geo_key = process.env.GEOCODE_API_KEY;
        let url = `https://eu1.locationiq.com/v1/search.php?key=${geo_key}&q=${city}&format=json`;

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
  console.log('weather location', locationLatLon)
  const weather_key = process.env.WEATHER_API_KEY;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${locationLatLon[0]}&lon=${locationLatLon[1]}&days=6&key=${weather_key}`;

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
  console.log(locationLatLon);
  const trail_key = process.env.TRAIL_API_KEY;
  let maxDistance = 100; // In KMs
  let maxResults = 5;
  let url = `https://www.hikingproject.com/data/get-trails?lat=${locationLatLon[0]}&lon=${locationLatLon[1]}&maxDistance=${maxDistance}&maxResults=${maxResults}&key=${trail_key}`;

  superagent.get(url).then( data => {
    let trailData = JSON.parse(data.text).trails;

    trailData.map(element => {
      let localTrail = new Trail(element);
      Trail.all.push(localTrail);
    })
    res.status(200).json(Trail.all);
  });
});

app.get('/locations')

app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

// ----------- constructors and functions ----------- //

function Location(city, data) {
  this.search_query = city;
  this.formatted_query = data[0].display_name;
  this.latitude = data[0].lat;
  this.longitude = data[0].lon;

  locationLatLon[0] = data[0].lat;
  locationLatLon[1] = data[0].lon;
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

let badInput = (city) => !city ? true : false ;

function existsDB(city) {
  let SQL = `SELECT search_query,formatted_query,latitude,longitude FROM locations WHERE search_query=$1;`;
  let values = [city];
  let query = client.query(SQL, values).then((result) => {
    return result.rows;
  });
  return query;
}

function insertDB(data) {
  let SQL = `INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4)`;
  let values = [data.search_query,data.formatted_query,data.latitude,data.longitude,];
  client.query(SQL, values);
  console.log(SQL, values);
}