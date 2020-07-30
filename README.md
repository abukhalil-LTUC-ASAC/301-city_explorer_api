# city_explorer_api
An exercise in building a server API for [city explorer frontend](https://codefellows.github.io/code-301-guide/curriculum/city-explorer-app/front-end/).  


**Author**: Yahya Abu Khalil
**Version**: 3.1.5

## Overview
The application would help setup an API node where we could call for information from the users and display them in a "frontend", a learning experience on how to navigate data in between.

The application also provides essential data on each location, these data shows the weather, hiking trail, yelp reviews and movie databases for tourists and outgoing locals alike!

## Getting Started
[Follow the link to the front-end](https://codefellows.github.io/code-301-guide/curriculum/city-explorer-app/front-end/).
add this link to it (https://abukhalil-city-explorer-api.herokuapp.com). And start searching for cities!

If you'd want a map for each location, make an account in [LocationIQ](https://my.locationiq.com/dashboard/login?ref=locationiq), get the token API and enter it within the app for geocoding map.

## Architecture
Using Javsscript Express and Nodejs server files, Heroku for deployment, PostgreSQL for persistent database. 

## Change Log

2020-07-26 14:22:06 - Added Initial State Query V-1.0.0
2020-07-27 18:34:38 - Added Final State API V-2.0.0 
2020-07-28 21:34:38 - Added Persistent Storage V-3.0.0 
2020-07-29 17:10:38 - Added Additional API and pagination option V-3.1.5

## Credits and Collaborations
Day 1 - Duha, Nassem, Obada, Waleed.
Day 2 - Duha, Saad, Obada, Waleed.
Day 3 - Duha, Nassem, Obada, Saad, Samara, Waleed.
Day 4 - Safi


### Day 1
```
#1 Repository Set Up

Estimate of time needed to complete: 40 minutes

Start time: 13:40

Finish time: 14:20

Actual time needed to complete: 40 minutes
```
```
#2 Location Query

Estimate of time needed to complete: 30 minutes

Start time: 14:50

Finish time: 16:20

Actual time needed to complete: 1:30 hour // wrong query string  ?amman instead of ?city=amman 
```
```
#3 Weather Query

Estimate of time needed to complete: 1 hour

Start time: 16:40

Finish time: 18:10

Actual time needed to complete: 1:30 hour
```
```
#4 Error Checking

Estimate of time needed to complete: 20 minutes

Start time: 18:10

Finish time: 18:30

Actual time needed to complete: 20 minutes
```

### Day 2
```
#1 Refractor to .map

Estimate of time needed to complete: 10 minutes

Start time: 14:40

Finish time: 14:50

Actual time needed to complete: 10 minutes
```
```
#2 Location API

Estimate of time needed to complete: 30 minutes

Start time: 15:15

Finish time: 15:30

Actual time needed to complete: 15 minutes
```
```
#3 Weather API

Estimate of time needed to complete: 30 minutes

Start time: 17:40

Finish time: 18:10

Actual time needed to complete: 30 minutes
```
```
#4 Trail API

Estimate of time needed to complete: 30 minutes

Start time: 18:10

Finish time: 18:30

Actual time needed to complete: 20 minutes
```
### Day 3
```
#1 SQL Connection

Estimate of time needed to complete: 40 minutes

Start time: 14:40

Finish time: 17:20

Actual time needed to complete: 3 Hours // bad database URL and path finding
```
```
#2 Location Storage

Estimate of time needed to complete: 1 hour

Start time: 19:50

Finish time: 20:50

Actual time needed to complete: 1 hours
```
```
#3 Heroku Deployment

Estimate of time needed to complete: 30 minutes

Start time: 21:00

Finish time: 21:15

Actual time needed to complete: 15 minutes
```
### Day 4
```
#1 MovieDB API

Estimate of time needed to complete: 40 minutes

Start time: 14:00

Finish time: 15:30

Actual time needed to complete: 1.5 Hours // testing different options, added region code from location
```
```
#2 Yelp API

Estimate of time needed to complete: 30 minutes

Start time: 15:30

Finish time: 16:30

Actual time needed to complete: 1 hour // testing yelp for formatted location input, switched to lat lon
```
```
#3 Pagination in Yelp API

Estimate of time needed to complete: 15 minutes

Start time: 16:30

Finish time: 17:00

Actual time needed to complete: 30 minutes // tested pagination of different type (for loop), used offset instead.
```