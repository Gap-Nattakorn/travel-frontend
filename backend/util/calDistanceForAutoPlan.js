const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyDfK98MiY6PIOgnaRS3xqYSi4bqW6z2LwQ';


async function calcDistanceForNearLocation(cities,population) {
   
   var places = [];
   var url ;
   for(p = 0; p < population.length; p++){
      var city = population[p];
      places[p] = cities[city];
     
   }
   var lastIndex = places.length - 1;
   var total = 0;

   if(places.length <= 2 ){
      url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(places[0].lat+","+places[0].lng)}
            &destination=${encodeURIComponent(places[1])}&key=${API_KEY}`
   }else {
      url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(places[0].lat+","+places[0].lng)}
            &destination=${encodeURIComponent(places[lastIndex])}&waypoints=`
      for(p = 1; p < (places.length-1); p++){
         if(p === (places.length-2)){
            url += `${encodeURIComponent(places[p])}&key=${API_KEY}`
         }else{
            url += `${encodeURIComponent(places[p])}|`
         }
      }
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
     
      for (var i = 0; i < data.routes[0].legs.length; i++) {
         // console.log(data.routes[0].legs[i].distance.value);
         total += data.routes[0].legs[i].distance.value;
         dura += data.routes[0].legs[i].duration.value;
       }
      //  console.log("TOTAL"+total)
       return total/1000;
 
 }

module.exports = calcDistanceForNearLocation; 
