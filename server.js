
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('./public'));

const PORT = process.env.PORT || 3000;


// app.get('/', function (req, res) {
//   res.status(200).send('Hello World!');
// });

app.get('/location', function (req, res) {
  let data = require('./data/location.json');
  let city = req.query.city;
  console.log('search', city);

  let locationData = new Location(city, data);
  res.status(200).json(locationData);

  console.log(locationData);
  console.log(locationData.search_query);
});


app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));


function Location(city, data) {
  this.search_query = city;
  this.formatted_query = data[0].display_name;
  this.latitude = data[0].lat;
  this.longitude = data[0].lon;
}

app.listen(PORT,() => console.log(`Listening on port ${PORT}`));


