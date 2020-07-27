
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const app = express();
app.use(cors());
// app.use(express.static('./public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => console.log(`Listening on port ${PORT}`));

// ----------- Gets API ----------- //

app.get('/', function (req, res) {
  res.status(200).send('Welcome to the ?best? API');
});

app.get('/location', function (req, res) {
  // const data = require('./data/location.json');
  let city = req.query.city;
  let isWrong = badInput(city);
  
  if(isWrong) {
    console.log(city, isWrong)
    res.status(403).send({ 'status': 403, msg: 'Wrong input'});

  } else {
    // let locationData = new Location(city, data);

    let geo_key = process.env.GEOCODE_API_KEY;
    let url = `https://eu1.locationiq.com/v1/search.php?key=${geo_key}&q=${city}&format=json`;
  
    superagent.get(url).then( data => {
      let locationData = new Location(city, data.body);
      res.status(200).send(locationData);
      // return locationData;
    });
  }
});

var locationLatLon = [];

app.get('/weather', (req, res) => {
  // const weatherData = require('./data/weather.json');
  Weather.all = [];
  console.log(locationLatLon);
  let weather_key = process.env.WEATHER_API_KEY;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${locationLatLon[0]}&lon=${locationLatLon[1]}&days=6&key=${weather_key}`;

  superagent.get(url).then( data => {
    let weatherData = JSON.parse(data.text).data;

    weatherData.map(element => {
      let localWeather = new Weather(element);
      Weather.all.push(localWeather);
      console.log(localWeather);
    })
    res.status(200).json(Weather.all);
  });
});

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

let badInput = (city) => !city ? true : false ;