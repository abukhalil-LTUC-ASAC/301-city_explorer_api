
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

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
  const data = require('./data/location.json');
  let city = req.query.city;
  let isWrong = badInput(city);

  if(isWrong) {
    res.status(403).send({ 'status': 403, msg: 'Wrong input'});

  } else {
    let locationData = new Location(city, data);
    res.status(200).send(locationData);
  }
});

app.get('/weather', (req, res) => {
  const weatherData = require('./data/weather.json');
  Weather.all = [];

  weatherData.data.forEach(element => {
    let localWeather = new Weather(element);
    Weather.all.push(localWeather);
  });
  res.status(200).send(Weather.all);
});

app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

// ----------- constructors and functions ----------- //
function Location(city, data) {
  this.search_query = city;
  this.formatted_query = data[0].display_name;
  this.latitude = data[0].lat;
  this.longitude = data[0].lon;
}

function Weather(data, longTimeStamp) {
  this.forecast = data.weather.description;
  this.time = data.valid_date;
}

let badInput = (city) => !city ? true : false ;