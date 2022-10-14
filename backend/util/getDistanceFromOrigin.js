const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyDfK98MiY6PIOgnaRS3xqYSi4bqW6z2LwQ';


async function calcDistanceFromOrigin(cities,origin) {
   

   console.log(cities);
   console.log(origin);
   
   const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin[0].lat+","+origin[0].lng)}
          &destination=${encodeURIComponent(cities)}&key=${API_KEY}`
   const response = await axios.get(url);
   const data = response.data;
   if(!data || data.status === 'ZERO_RESULT') {
      const error = new HttpError('Could not find location for the specified address.', 422);
      throw error;
   }
   //console.log(data.routes[0].legs[0].distance.value);
   const total = data.routes[0].legs[0].distance.value; 
   
   console.log("Near"+total/1000)
   return total/1000;


   
 }

module.exports = calcDistanceFromOrigin; 
