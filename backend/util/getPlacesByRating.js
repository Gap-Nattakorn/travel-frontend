//const axios = require('axios');

//const HttpError = require('../models/http-error');

//const API_KEY = 'AIzaSyBrW9SVbqSdIVQLrdJwZ7k83bura9k645c';

//const calcDistance = require('../util/getDistance');


var popSize = 250;
var population = [];
var fitness = [];

var recordDistance = 0;
var bestEver = [];
var currentBest;
var bestRating;

// var cities = [
//    'มหาวิทยาลัยเทคโนโลยีมหานคร',
//    'ตลาดน้ำขวัญเรียม',
//    'วัดบางกระเจ้านอก',
//    'สวน 50 พรรษา มหาจักรีสิรินธร',
//    'สวนหลวง ร.9',
//    'Megabangna',
//    'สนามเสือป่า',
//    'วัดพระเเก้ว'
// ]
// var totalCities = cities.length;

var cities = [];
var ratings = [];
var totalCities;
var totalPlaces;
var order = [];

// for(var place = 0 ; place < cities.length; place++ ){
//    order.push(place);
// }


async function getPlacesByRating(city, rating, totalPlace) {
   cities = city;
   console.log(cities)
   ratings = rating;
   totalCities = cities.length;
   totalPlaces = totalPlace;
   for(var place = 0 ; place < totalCities; place++ ){
      order.push(place);
   }
   console.log("o"+order)

   for (var i = 0; i < popSize; i++) {
    
      var pop = shuffle(order);
      // var x = [];
      // for(var j = 0; j < pop.length; j++){
      //    x[j]=pop[j];
      // }
      population.push(pop);
    }

   for(var x = 0; x < 3; x++ ){
      await calculateFitness();
    
      await normalizeFitness();

      await nextGeneration();

      console.log("I"+x);
   } 
   var places = [];
   for(var p = 0; p < totalPlaces; p++){
      var index = [];
      index = bestEver;
      places.push(cities[index[p]]);
   }

   return {bestRating, places};
   
}

function calculateFitness() {
   var currentRecord = 0;
   for (var i = 0; i < population.length; i++) {
        console.log(population[i])
        var d = calcRating(ratings, population[i])
            console.log("rating: "+d);
            
            if (d > recordDistance) {
            recordDistance = d;
            bestEver = population[i];
            bestRating = d;
                  
            }
            if (d > currentRecord) {
            currentRecord = d;
            currentBest = population[i];
            // console.log("cB"+currentBest)
            }
            fitness[i] = d / (Math.pow(10, 8) + 5);
            //console.log(fitness[i])     
   }
 }     

function normalizeFitness() {
   // console.log('normalizeFitness')
   var sum = 0;
   for (var i = 0; i < fitness.length; i++) {
       sum += fitness[i];
   }
   for (var i = 0; i < fitness.length; i++) {
       fitness[i] = fitness[i] / sum;
   }
   }
///////////////////////////////////////////////////////////
   function nextGeneration() {

   var newPopulation = [];
   for (var i = 0; i < population.length; i++) {
       var orderA = pickOne(population, fitness);
       var orderB = pickOne(population, fitness);
       var order = crossOver(orderA, orderB);
       mutate(order, 0.01);
       newPopulation[i] = order;
   }
   population = newPopulation;
   }
////////////////////////////////////////////
   function pickOne(list, prob) {
   var index = 0;
   var r = Math.random();


   while (r > 0) {
       r = r - prob[index];
       index++;
   }
   index--;
   return list[index].slice();
   }
/////////////////////////////////
function crossOver(orderA, orderB) {
   var start = Math.floor(Math.random(orderA.length));
   var end = Math.floor(Math.random(start + 1, orderA.length));
   var neworder = orderA.slice(start, end);
   for (var i = 0; i < orderB.length; i++) {
     var city = orderB[i];
     if (!neworder.includes(city)) {
       neworder.push(city);
     }
   }
   return neworder;
 }
////////////////////////////////////////////////////////////////
   function mutate(order, mutationRate) {
      
   for (var i = 0; i < totalCities; i++) {
       if (Math.random() < mutationRate) {
       var indexA = Math.floor(Math.random(order.length));
       var indexB = (indexA + 1) % totalCities;
       if(indexA === 0 || indexB === 0) continue;
       swap(order, indexA, indexB);
       }
   }
   }
////////////////////////////////////////////////////////////////////////////////////////////////////////      
function swap(a, i, j) {
   
   var temp = a[i];
   a[i] = a[j];
   a[j] = temp;
}  

function shuffle(arra1) {
   var ctr = totalPlaces, temp, index;
   var arra2 = [];
  
   while (ctr > 0) {
      
       index = Math.floor(Math.random() * arra1.length); // ctr = 3
     
       if(arra2.includes(arra1[index])) continue;
       ctr--;
       arra2.push(arra1[index])
    }
   return arra2;
}

function calcRating(cities,population){
   var rating = [];
   var totalRating = 0;
   for(p = 0; p < population.length; p++){
      var city = population[p];
      rating[p] = cities[city];
      totalRating += rating[p];
      
   }
   totalRating = totalRating/population.length;
   return totalRating;

}

module.exports = getPlacesByRating; 
