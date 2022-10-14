const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyDfK98MiY6PIOgnaRS3xqYSi4bqW6z2LwQ';


async function calDistance(origin,cities, isFirstPlace = false) {
   
   
   var url ;
   var total = 0;
   if(isFirstPlace){
      url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin.lat+","+origin.lng)}
         &destination=${encodeURIComponent(cities)}&key=${API_KEY}`
   }else {
      url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}
         &destination=${encodeURIComponent(cities)}&key=${API_KEY}`
   }
   
   
   
   
   const response = await axios.get(
      url 
   )
      const data = response.data;
      if(!data || data.status === 'ZERO_RESULT') {
         const error = new HttpError('Could not find location for the specified address.', 422);
         throw error;
      }
      let dura = 0;
      console.log(data.routes[0].legs[0].distance.value);
      total += data.routes[0].legs[0].distance.value;
      dura += data.routes[0].legs[0].duration.value;
       
       console.log(total/1000)
       return total/1000;
 
 }

module.exports = calDistance; 
