
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
// app.use(express.static('./public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => console.log(`Listening on port ${PORT}`));

app.get('/', function (req, res) {
  res.status(200).send('Welcome to the ?best? API');
});

app.get('/location', function (req, res) {
  const data = require('./data/location.json');
  let city = req.query.city;

  let locationData = new Location(city, data);
  res.status(200).json(locationData);

});

app.get('/weather', (req, res) => {
  const weatherData = require('./data/weather.json');
  Weather.all = [];

  // if(!city) { res.status(400).send({ 'status': 400, msg: 'Parameter missing!'}); }
  weatherData.data.forEach(element => {
    let localWeather = new Weather(element);
    Weather.all.push(localWeather);
  });
  res.send(Weather.all);
});

function Location(city, data) {
  this.search_query = city;
  this.formatted_query = data[0].display_name;
  this.latitude = data[0].lat;
  this.longitude = data[0].lon;
}

function Weather(data, longTimeStamp){
  this.forecast = data.weather.description;
  this.time = data.valid_date;
}

app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));
