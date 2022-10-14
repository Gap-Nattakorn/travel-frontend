//const axios = require('axios');

//const calcDistance = require("./getDistance");

//const HttpError = require('../models/http-error');

//const API_KEY = 'AIzaSyBrW9SVbqSdIVQLrdJwZ7k83bura9k645c';
const calcDistanceFromOrigin = require('../util/getDistanceFromOrigin');


var popSize;
var population = [];
var fitness = [];

var recordDistance = Infinity;
var bestEver = [];
var currentBest;
var bestNearPath;



var cities = [];
var Origin = [];
var totalCities;
var totalPlaces;
var order = [];
var distance = []; 



async function getPlacesByNearLocation(city, origin, totalPlace) {
   cities = city;
   Origin.push(origin)
   totalCities = cities.length;
   totalPlaces = totalPlace;
   popSize = totalPlace*25;

   console.log(cities);
   for(p = 0 ; p < totalCities; p++){
      var d = await calcDistanceFromOrigin(cities[p],Origin);
      distance.push(d);
   }

   console.log(distance);
   
   for(var place = 0 ; place < totalCities; place++ ){
      order.push(place);
   }
   //console.log('order')
   //console.log(order)

   for (var i = 0; i < popSize; i++) {
    
      var pop = shuffle(order);
      // var x = [];
      // for(var j = 0; j < pop.length; j++){
      //    x[j]=pop[j];
      // }
      population.push(pop);
   }
   //console.log(population);
   
   for(var x = 0; x < 1; x++ ){
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

   return {bestNearPath, places};
   
}

async function calculateFitness() {
   var currentRecord = Infinity;
   for (var i = 0; i < population.length; i++) {
        //console.log(i)
        console.log(population[i])
        var d =  calcDistance(distance, population[i])
            console.log(d);
            if (d < recordDistance) {
            //console.log(d);
            recordDistance = d;
            bestEver = population[i];
            bestNearPath = d;
                  
            }
            if (d < currentRecord) {
            currentRecord = d;
            currentBest = population[i];
            // console.log("cB"+currentBest)
            }
            fitness[i] = 1 / (Math.pow(d, 8) + 1);
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
   // console.log('nextGeneration')

   var newPopulation = [];
   for (var i = 0; i < population.length; i++) {
       var orderA = pickOne(population, fitness);
       var orderB = pickOne(population, fitness);
       var order = crossOver(orderA, orderB);
       mutate(order, 0.01);
       newPopulation[i] = order;
   }
   population = newPopulation;
   //console.log("ddd"+population);
   //console.log("bestNearPath"+bestNearPath)
   //return bestNearPath;
   }
////////////////////////////////////////////
   function pickOne(list, prob) {
   // console.log("pickOne");
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
   // console.log("crossOver");
   var start = Math.floor(Math.random(orderA.length));
   var end = Math.floor(Math.random(start+1, orderA.length));
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
   // console.log("mutate");
      
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
   // console.log("swap");
   
var temp = a[i];
a[i] = a[j];
a[j] = temp;
}  

function shuffle(arra1) {
   var ctr = totalPlaces, temp, index;
   var arra2 = [];
   //arra2 = arra1.slice(0,1);
   // While there are elements in the array
   for(i = 0; i < ctr; i++) {
      index = Math.floor(Math.random() * arra1.length); 
      
      while(arra2.includes(arra1[index])){
         index = Math.floor(Math.random() * arra1.length); 
         //if(arra2.includes(arra1[index])) continue;   
      }
      //  index = Math.floor(Math.random() * arra1.length); 
      //  if(arra2.includes(arra1[index])) continue;
      //  ctr--;
      arra2.push(arra1[index])
    }
   //console.log(arra2);
   return arra2;
}

function calcDistance(cities,population){
   var rating = [];
   var totalRating = 0;
   for(p = 0; p < population.length; p++){
      var city = population[p];
      rating[p] = cities[city];
      totalRating += rating[p];
      //console.log(places)
   }
   //var lastIndex = places.length - 1;
   //totalRating = totalRating/population.length;
   return totalRating;

}


module.exports = getPlacesByNearLocation; 
