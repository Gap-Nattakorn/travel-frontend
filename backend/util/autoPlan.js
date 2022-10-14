const axios = require('axios');
const { compare } = require('bcryptjs');

const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyDfK98MiY6PIOgnaRS3xqYSi4bqW6z2LwQ';

const calcDistance = require('./calDistanceForAutoPlan');
// const log4js = require("log4js");
// log4js.configure({
//    appenders: { cheese: { type: "file", filename: "autoPlan.log" } },
//    categories: { default: { appenders: ["cheese"], level: "error" } }
//  });
// const logger = log4js.getLogger();


var popSize ;
var population = [];
var fitness = [];

var recordDistance = Infinity;
var bestEver = [];
var currentBest;
var bestPath;


var cities = [];
var totalCities;
var order = [];




async function getPlan(ci) {
   population = []
   console.log(population.length);
   cities = ci;
   popSize = Math.pow(2, cities.length); 
   //popSize = 125;
   console.log(cities);
   totalCities = cities.length;
   console.log(cities.length);
   console.log('popSize'+popSize)
   order = [];
   //population = [];
   for(var place = 0 ; place < totalCities; place++ ){
      order.push(place);
   }
   console.log("order"+order);
   for (var i = 0; i < popSize; i++) {
      population[i] = shuffle(order);
      //var pop = shuffle(order);
      // var x = [];
      // for(var j = 0; j < pop.length; j++){
      //    x[j]=pop[j];
      // }
      //population.push(pop);
      console.log(i+": "+population[i]);
    }
    console.log(population.length);

    if(population.length !== popSize){
       console.log('ERROR')

    }

   for(var x = 0; x < 3; x++ ){
      // logger.fatal("------------------------------ROUND"+x+"START");
      console.log(population.length);
      console.log("------------------------------ROUND"+x+"START------------------------------");

      await calculateFitness();
    
      await normalizeFitness();

      await nextGeneration();

      console.log("------------------------------ROUND"+x+"END---------------------------------");
      // logger.fatal("------------------------------ROUND"+x+"END");


   } 
   var places = [];
   for(var p = 0; p < totalCities; p++){
      var index = [];
      index = bestEver;
      places.push(cities[index[p]]);
   }

   return {bestPath, places};
   
}

//  function calcDistance(cities,population) {
   
   
//    var cityAIndex = population[0];
//    var cityA = cities[cityAIndex];
//    var cityBIndex = population[1];
//    var cityB = cities[cityBIndex];
//    var cityCIndex = population[2];
//    var cityC = cities[cityCIndex]
//    var cityDIndex = population[3];
//    var cityD = cities[cityDIndex]
//    var total = 0;
   
//    const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(cityA)}
//       &destination=${encodeURIComponent(cityB)}
//       &waypoints=${encodeURIComponent(cityC)}|${encodeURIComponent(cityD)}
//       &key=AIzaSyBrW9SVbqSdIVQLrdJwZ7k83bura9k645c`  
//    )
//    // .then(function (response) {
//       const data = response.data;
//       if(!data || data.status === 'ZERO_RESULT') {
//          const error = new HttpError('Could not find location for the specified address.', 422);
//          throw error;
//       }
//       let dura = 0;
//       for (var i = 0; i < data.routes[0].legs.length; i++) {
//          //console.log(data.routes[0].legs[i].distance.value);
//          //console.log(data.routes[0].legs[i].duration.value);
//          total += data.routes[0].legs[i].distance.value;
//          dura += data.routes[0].legs[i].duration.value;
//        }
//        console.log("TOTAL"+total)
//        return total/1000;

  
     
      
//    //  })
//    //  .catch(function (error) {
//    //    // handle error
//    //    console.log(error);
//    //  })
   
   
//  }

async function calculateFitness() {
   var currentRecord = Infinity;
   for (var i = 0; i < population.length; i++) {
        console.log(population[i])
        var d = await calcDistance(cities, population[i])
            console.log(d);
            // logger.fatal(d);
            
            if (d < recordDistance) {
            //console.log(d);
            recordDistance = d;
            bestEver = population[i];
            bestPath = d;
                  
            }
            if (d < currentRecord) {
            currentRecord = d;
            currentBest = population[i];
            // console.log("cB"+currentBest)
            }
            fitness[i] = 1 / (Math.pow(d, 8) + 1);
            console.log(fitness[i])     
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
   var end = Math.floor(Math.random(0 + 1, orderA.length));
   var neworder = orderA.slice(0, end);
   
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
   // console.log("swap");
   
var temp = a[i];
a[i] = a[j];
a[j] = temp;
}  

function shuffle(arra1) {
   
   var arra2 = arra1.slice(1,arra1.length);;
   var ctr = arra2.length, temp, index;
   while (ctr > 0) {
      
       index = Math.floor(Math.random() * ctr);
 
       ctr--;
       temp = arra2[ctr];
       arra2[ctr] = arra2[index];
       arra2[index] = temp;
      }
      arra2.unshift(arra1[0]);
      //console.log(arra2);
   return arra2;
}

module.exports = getPlan; 


      // https://maps.googleapis.com/maps/api/directions/json?origin=13.672239800000002,100.65345529999999
      // &destination=วัดพระเชตุพนวิมลมังคลารามราชวรวิหาร
      // &waypoints=วัดธรรมมงคล|ถนน+เยาวราช|วัดอรุณราชวราราม+ราชวรมหาวิหาร|ภูเขาทอง+วัดสระเกศราชวรวิหาร|วัดพระเเก้ว
      // &key=AIzaSyBrW9SVbqSdIVQLrdJwZ7k83bura9k645c

      // https://maps.googleapis.com/maps/api/geocode/json?address=ถนน+เยาวราช&key=AIzaSyBrW9SVbqSdIVQLrdJwZ7k83bura9k645c

      
      // https://maps.googleapis.com/maps/api/directions/json?origin=13.672239800000002,100.65345529999999
      // &destination=วัดอรุณราชวราราม+ราชวรมหาวิหาร
      // &waypoints=วัดธรรมมงคล|ถนน+เยาวราช|ภูเขาทอง+วัดสระเกศราชวรวิหาร
      // &key=AIzaSyBrW9SVbqSdIVQLrdJwZ7k83bura9k645c

      // https://maps.googleapis.com/maps/api/directions/json?origin=13.672239800000002,100.65345529999999
      // &destination=วัดธรรมมงคล
      // &key=AIzaSyBrW9SVbqSdIVQLrdJwZ7k83bura9k645c

      // https://maps.googleapis.com/maps/api/directions/json?origin=วัดธรรมมงคล
      // &destination=ถนน+เยาวราช
      // &key=AIzaSyBrW9SVbqSdIVQLrdJwZ7k83bura9k645c

      // https://maps.googleapis.com/maps/api/directions/json?origin=ถนน+เยาวราช
      // &destination=ภูเขาทอง+วัดสระเกศราชวรวิหาร
      // &key=AIzaSyBrW9SVbqSdIVQLrdJwZ7k83bura9k645c

      // https://maps.googleapis.com/maps/api/directions/json?origin=ภูเขาทอง+วัดสระเกศราชวรวิหาร
      // &destination=วัดอรุณราชวราราม+ราชวรมหาวิหาร
      // &key=AIzaSyBrW9SVbqSdIVQLrdJwZ7k83bura9k645c

      