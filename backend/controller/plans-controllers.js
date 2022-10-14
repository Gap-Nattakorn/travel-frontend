const fs = require('fs');

// const log4js = require("log4js");

// log4js.configure({
//    appenders: { cheese: { type: "file", filename: "cheese.log" } },
//    categories: { default: { appenders: ["cheese"], level: "error" } }
//  });

// const logger = log4js.getLogger();


const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Place = require('../models/place');
const User = require('../models/user');
const TypePlace = require('../models/typePlace');
const UserPlan = require('../models/userPlan');

const getPlan = require('../util/autoPlan');
const getPlacesByRating = require('../util/getPlacesByRating');
const getPlacesByNearLocation = require('../util/getPlacesByNearLocation');
// const getCoordsForAddress = require('../util/location');
const calDistance = require('../util/calDistance');
// const calcDistance = require('../util/getDistance');




const createPlan = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     next(new HttpError('Invalid inputs passed, please check your data.', 422));
   }
 
   const { namePlan, datePlan, lat, lng} = req.body;
   const location = {
      "lat":lat,
      "lng":lng
   }
   console.log(location)
   const createdPlan = new UserPlan({
      namePlan,
      datePlan,
      origin:location,
      places: [],
      creator: req.userData.userId,
      distance: 0
      
   });

   // console.log(req.userData.userId);
   
   let user;

   try {
      user = await User.findById(req.userData.userId);
   } catch(err) {
      console.log(err);
      const error = new HttpError(
         'Creating place failed, please try again1.',
         500
      );
      return next(error);
   }

   if(!user) {
      const error = new HttpError(
         'Could not find user for provided id',
         404
      );
      return next(error);
   }

   // console.log(user);


   try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdPlan.save({session:sess});
      user.plans.push(createdPlan);
      await user.save({session:sess});
      await sess.commitTransaction();
      //await createdPlan.save();


   } catch(err) {
      console.log(err);
      const error = new HttpError(
         'Creating place failed, please try again2.',
         500
      );
      return next(error);
   }
 
 
   res.status(201).json({ plan: createdPlan }); 
}

///////////////////////////////////////////////////

const getPlansByUserId = async (req, res, next) => {
   // console.log("getplans")
   const userId = req.params.uid;
   let userWithPlans;
   try {
      userWithPlans = await User.findById(userId).populate('plans');
   } catch (err) {
      console.log(err);
      const error = new HttpError(
         'Fetching plans failed, please try again later', 
         500
      );

      return next(error);
   }

   // if (!userWithPlans || userWithPlans.plans.length === 0) {
   //    return next(
   //       new Error('Could not find a places for the provided user id.', 404)
   //    );
   // }
   // console.log(userWithPlaces);

   res.json({plans: userWithPlans.plans.map(plan => plan.toObject({getters: true })) });
}

////////////////////////////////////////////////////

const addPlaceToPlan = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      console.log(errors)
     next(new HttpError('Invalid inputs passed, please check your data.', 422));
   }
   
   const { userId, placeId, planId} = req.body;
 
   let place;

   try {
      place = await Place.findById(placeId);
   } catch(err) {
      const error = new HttpError(
         'Comment failed, please try again.',
         500
      );
      return next(error);
   }

   if(!place) {
      const error = new HttpError(
         'Could not find place',
         404
      );
      return next(error);
   }

  
   let user;

   try {
      user = await User.findById(userId);
   } catch(err) {
      const error = new HttpError(
         'Creating place failed, please try again1.',
         500
      );
      return next(error);
   }

   if(!user) {
      const error = new HttpError(
         'Could not find user for provided id',
         404
      );
      return next(error);
   }

   let plan;

   try {
      plan = await UserPlan.findById(planId);
   } catch(err) {
      const error = new HttpError(
         'Creating place failed, please try again1.',
         500
      );
      return next(error);
   }

   if(!plan) {
      const error = new HttpError(
         'Could not find plan for provided id',
         404
      );
      return next(error);
   }

   if(plan.places.length >= 10) {
      const error = new HttpError(
         'ไม่สามารถเพิ่มสถานที่ท่องเที่ยวได้ เนื่องจากเต็มจำนวนที่กำหนด',
         500
      );
      return next(error);
   }

   let placeInPlan;

   try {
      placeInPlan = await UserPlan.find({_id:planId,places:placeId});
   } catch(err) {
      const error = new HttpError(
         'Creating place failed, please try again1.',
         500
      );
      return next(error);
   }

   console.log(placeInPlan.length);
   console.log(placeInPlan);

   if(placeInPlan.length !== 0) {
      const error = new HttpError(
         'มีสถานที่ท่องเที่ยวในเเผนท่องเที่ยวอยู่เเล้ว',
         500
      );
      return next(error);
   }
   let distance;
   if(plan.places.length === 0){
      try {
         distance = await calDistance(plan.origin, place.address, true);
       } catch (error) {
          console.log(error);
         return next(error);
       }
      plan.distance = distance
      
   }else{
      let places;
      try {
         places = await UserPlan.findById(planId).populate('places');
      } catch(err) {
         const error = new HttpError(
            'Comment failed, please try again.',
            500
         );
         return next(error);
      }
      const lastIndex = places.places.length - 1;
      try {
         distance = await calDistance(places.places[lastIndex].address, place.address);
       } catch (error) {
          console.log(error);
         return next(error);
       }
      plan.distance = plan.distance + distance
   }


   try {
      
      plan.places.push(place);
      await plan.save();

   } catch(err) {
      console.log(err);
      const error = new HttpError(
         'Creating place failed, please try again2.',
         500
      );
      return next(error);
   }
 
 
   res.status(201).json({ message:"add done" }); 
}

/////////////////////////////////////////////////////

const getPlacesByPlanId = async (req, res, next) => {
   const planId = req.params.pid;

   let place;

   try {
      place = await UserPlan.findById(planId).populate('places');
   } catch(err) {
      const error = new HttpError(
         'Something went wrong, could not find a place.', 
         500
      );

      return next(error);
   }

   if (!place) {
    const error = new HttpError(
         'Could not find a place for the provided id.', 
         404
    );

    return next(404);

   }

   res.json({place: place.places.map(place => place.toObject({getters: true }))}); 
};

/////////////////////////////////////////////////////

const getPlanById = async (req, res, next) => {
   const planId = req.params.pid;

   let plan;

   try {
      plan = await UserPlan.findById(planId);
   } catch(err) {
      const error = new HttpError(
         'Something went wrong, could not find a place.', 
         500
      );

      return next(error);
   }

   if (!plan) {
    const error = new HttpError(
         'Could not find a place for the provided id.', 
         404
    );

    return next(404);

   }

   res.json({plan: plan.toObject({getters: true})}); 
};

//////////////////////////////////////////////////////

const updatePlanById = async (req, res, next) => {
   console.log("update")
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      console.log(errors);
      throw new HttpError('Invalid inputs passed, please check your data', 422);
   }

   const {namePlan, datePlan} = req.body;
   
   const planId = req.params.pid;
 
   let plan;
   try {
      plan = await UserPlan.findById(planId);
   } catch(err) {
      const error = new HttpError(
         'Something went wrong, could not update plan1.', 
         500
      );

      return next(error);
   }

   // console.log(plan)

   if (plan.creator.toString() !== req.userData.userId) {
      const error = new HttpError(
         'You are not allowed to edit this plan', 
         401
      );

      return next(error);
   }

   
   plan.namePlan = namePlan;
   plan.datePlan = datePlan;

   
   
   try {
      await plan.save();
   } catch(err) {
      // console.log(err);
      const error = new HttpError(
         'Something went wrong, could not update plan2.', 
         500
      );
      return next(error);
   }

   res.status(200).json({plan: plan.toObject({getters: true})});
   
};

///////////////////////////////////////////////////////

const deleltePlaceInPlan = async (req, res, next) => {
   const planId = req.params.pid;
   const { placeId } = req.body;
   
   let plan;
   try {
      plan = await UserPlan.findById(planId);
   } catch(err){
      // console.log(err);
      const error = new HttpError(
         'Something went wrong1, could not delete place.', 
         500
      );
      return next(error);
   }

   if(!plan) {
      const error = new HttpError(
         'Could not find plan for this id.', 
         404
      );
      return next(error);
   }

   if (plan.creator.toString() !== req.userData.userId) {
      const error = new HttpError(
         'You are not allowed to delete this place', 
         401
      );

      return next(error);
   }


   let place;
   try {
      place = await Place.findById(placeId);
   } catch(err) {
      const error = new HttpError(
         'Comment failed, please try again.',
         500
      );
      return next(error);
   }

   if(!place) {
      const error = new HttpError(
         'Could not find place',
         404
      );
      return next(error);
   }

   let distance;
   if(plan.places.length === 1 ){
      try {
         distance = await calDistance(plan.origin, place.address, true);
       } catch (error) {
          console.log(error);
         return next(error);
       }
      plan.distance = plan.distance - distance;

   }else{
      let places;
      try {
         places = await UserPlan.findById(planId).populate('places');
      } catch(err) {
         const error = new HttpError(
            'Comment failed, please try again.',
            500
         );
         return next(error);
      }

      const lastIndex = places.places.length - 1;
      const deleteIndex = plan.places.indexOf(placeId);
      const previousIndex = deleteIndex - 1;
      const nextIndex = deleteIndex + 1;

      if(deleteIndex === 0){
         try {
            distance = await calDistance(plan.origin, places.places[deleteIndex].address, true);
         }catch (error) {
            console.log(error);
            return next(error);
         }
         plan.distance = plan.distance - distance

         try {
            distance = await calDistance(places.places[deleteIndex].address, places.places[nextIndex].address);
         }catch (error) {
            console.log(error);
            return next(error);
         }
         plan.distance = plan.distance - distance

         try {
            distance = await calDistance(plan.origin, places.places[nextIndex].address, true);
         }catch (error) {
            console.log(error);
            return next(error);
         }
         plan.distance = plan.distance + distance

      }else{
         
         try {
            distance = await calDistance(places.places[previousIndex].address, places.places[deleteIndex].address);
         }catch (error) {
            console.log(error);
            return next(error);
         }
         plan.distance = plan.distance - distance

      
         if(nextIndex < lastIndex){
            try {
               distance = await calDistance(places.places[deleteIndex].address, places.places[nextIndex].address);
            }catch (error) {
               console.log(error);
               return next(error);
            }
            plan.distance = plan.distance - distance
   
            try {
               distance = await calDistance(places.places[previousIndex].address, places.places[nextIndex].address);
            }catch (error) {
               console.log(error);
               return next(error);
            }
            plan.distance = plan.distance + distance
         }
   
      }
      
   }
   

   try {

      plan.places.pull(placeId);
      await plan.save();
    
   } catch(err) {
      const error = new HttpError(
         'Something went wrong2, could not delete place.', 
         500
      );
      return next(error);
   }

   
   res.status(200).json({ message:'Pulled Place!' })
};

/////////////////////////////////////////////////////////

const deletePlanById = async (req, res, next) => {
   const planId = req.params.pid;
   let plan;
   try {
      plan = await UserPlan.findById(planId).populate('creator');
   } catch(err){
      // console.log(err);
      const error = new HttpError(
         'Something went wrong1, could not delete place.', 
         500
      );
      return next(error);
   }

   if(!plan) {
      const error = new HttpError(
         'Could not find plan for this id.', 
         404
      );
      return next(error);
   }

   if (plan.creator.id !== req.userData.userId) {
      const error = new HttpError(
         'You are not allowed to delete this place', 
         401
      );

      return next(error);
   }

   //console.log(place);


   try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await plan.remove({session: sess});
      plan.creator.plans.pull(plan);
      await plan.creator.save({session: sess});
      await sess.commitTransaction();
   } catch(err) {
      // console.log(err);
      const error = new HttpError(
         'Something went wrong2, could not delete place.', 
         500
      );
      return next(error);
   }


   res.status(200).json({ message:'Deleted Place!' })
};

////////////////////////////////////////////////////////////

const countPlans = async (req, res, next) => {
   
   let plans;
   try {
      plans = await UserPlan.countDocuments({shared:true});

   } catch(err){
      const error = new HttpError(
         'Fecthing places failed, please try again later.', 
         500
      );

      return next(error);
   }
   // console.log(places)
   
   res.json({ countPlans: plans});
};

////////////////////////////////////////////////////////////


const getPlans = async (req, res, next) => {
   const {pageNumber, pagination} = req.body;
   let plans;
   try {
      plans = await UserPlan.find({shared:true})
                           .sort({namePlan:1})
                           .skip((pageNumber - 1) * pagination)
                           .limit(pagination);

   } catch(err){
      const error = new HttpError(
         'Fecthing places failed, please try again later.', 
         500
      );

      return next(error);
   }
   
   res.json({ plans: plans.map(plan => plan.toObject({getters: true}))});
};

///////////////////////////////////////////////////////////

const SearchPlans = async (req, res, next) => {
   const {searchPlans,pageNumber, pagination} = req.body;
   let plans;
   try {
      plans = await UserPlan.find({namePlan: {$regex: searchPlans, $options: 's'}, shared:true })
                              .sort({namePlan:1})
                              .skip((pageNumber - 1) * pagination)
                              .limit(pagination);
;

   } catch(err){
      const error = new HttpError(
         'Fecthing users failed, please try again later.', 
         500
      );

      return next(error);
   }
   //console.log(provinces);
   // if (!places || places.length === 0) {
   //    return next(
   //       new Error('Could not find a places for the provided user id.', 404)
   //    );
   // }
   

   res.json({ plans: plans.map(plans => plans.toObject({getters: true}))});
};

//////////////////////////////////////////////////////////

const countSearchPlans = async (req, res, next) => {
   const {searchPlans} = req.body;
   let plans;
   try {
      plans = await UserPlan.countDocuments({namePlan:{$regex: searchPlans, $options: 's'}, shared:true});

   } catch(err){
      const error = new HttpError(
         'Fecthing places failed, please try again later.', 
         500
      );

      return next(error);
   }
   // console.log(places)
   
   res.json({ countPlans: plans});
};

////////////////////////////////////////////////////////////

const sharedPlan = async (req, res, next) => {
   const planId = req.params.pid;
   
   let plan;
   try {
      plan = await UserPlan.findById(planId);
   } catch(err){
      // console.log(err);
      const error = new HttpError(
         'Something went wrong1, could not delete place.', 
         500
      );
      return next(error);
   }

   if(!plan) {
      const error = new HttpError(
         'Could not find plan for this id.', 
         404
      );
      return next(error);
   }

   if (plan.creator.toString() !== req.userData.userId) {
      const error = new HttpError(
         'You are not allowed to delete this place', 
         401
      );

      return next(error);
   }

   plan.shared = true;

   try {
      await plan.save();
    
   } catch(err) {
      const error = new HttpError(
         'Something went wrong2, could not delete place.', 
         500
      );
      return next(error);
   }

    
}

////////////////////////////////////////////////////////////


const autoPlan = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     next(new HttpError('Invalid inputs passed, please check your data.', 422));
   }
   const {namePlan, datePlan, typePlace, provinceName, lat, lng, typePlan, countPlace} = req.body;
   const date = new Date(datePlan);
   const dayPlan = date.getDay();
   console.log(dayPlan);
   const day = ['อาทิตย์','จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
   req.setTimeout(0);
   let places;
   const p = [];
   const r = [];
   const tp = [];
   const location = {
      "lat":lat,
      "lng":lng
   }
   const t = typePlace.split(',');
   for(i = 0; i < t.length; i++ ){
      tp.push(t[i])
   }
   // console.log(tp);
   try {
   places = await Place.find({typePlace:{ $in: tp }, province:provinceName,opening:day[dayPlan]});
   } catch(err) {
      console.log(err);
      const error = new HttpError(
         'ไม่พบสถานที่ท่องเที่ยวที่ต้องการ',
         500
      );
      return next(error);
   }

   if(!places || places.length == 0 || places.length < countPlace) {
      const error = new HttpError(
         'ไม่พบสถานที่ท่องเที่ยว',
         404
      );
      return next(error);
   }
   
   console.log('------------------------------------------------')
   // console.log(places.length)
   // console.log(places)
   console.log('------------------------------------------------')
  
   for(var i = 0; i< places.length; i++){
         p.push(places[i].address)
         r.push(places[i].rating)
   }
   
   // console.log(countPlace)
   
   let rating;
   if(typePlan === 'popular'){
      try {
         rating = await getPlacesByRating(p, r, countPlace);
      //   console.log(plans);
   
      } catch (error) {
         console.log("error"+error);
        return next(error);
      }
   
      if(!rating||rating.places.length === 0 ){
         const error = new HttpError(
            'Could not create plan.', 
            404
       );
      }
   }else if(typePlan === 'near'){
      try {
         rating = await getPlacesByNearLocation(p, location, countPlace);
      //   console.log(plans);
   
      } catch (error) {
         console.log("error"+error);
        return next(error);
      }
   
      if(!rating||rating.places.length === 0 ){
         const error = new HttpError(
            'Could not create plan.', 
            404
       );
      }
   }
   
   console.log(rating.places);
   console.log(rating.bestRating);

   const a = rating.places;
   a.unshift(location);
   let plans;

   try {
     plans = await getPlan(a);

   } catch (error) {
      console.log(error);
     return next(error);
   }

   if(!plans||plans.places.length === 0 ){
      const error = new HttpError(
         'Could not create plan.', 
         404
    );
   }

   // console.log(pl)

   const createdPlan = new UserPlan({
      namePlan,
      datePlan,
      origin:location,
      places: [],
      creator: req.userData.userId,
      distance: plans.bestPath
      
   });

   let user;

   try {
      user = await User.findById(req.userData.userId);
   } catch(err) {
      console.log(err);
      const error = new HttpError(
         'Creating place failed, please try again1.',
         500
      );
      return next(error);
   }

   if(!user) {
      const error = new HttpError(
         'Could not find user for provided id',
         404
      );
      return next(error);
   }


   for(i = 1; i < plans.places.length; i++){
      let place;
      try {
         place = await Place.findOne({address:{$regex:plans.places[i], $options: 's'}});
         
      } catch (error) {
         return next(error);
      }

      if(!place) {
         const error = new HttpError(
            'Could not find place',
            404
         );
         return next(error);
      }

      createdPlan.places.push(place);

   }
   
   try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdPlan.save({session:sess});
      user.plans.push(createdPlan);
      await user.save({session:sess});
      await sess.commitTransaction();


   } catch(err) {
      console.log(err);
      const error = new HttpError(
         'Creating place failed, please try again2.',
         500
      );
      return next(error);
   }

   console.log(plans);
   console.log(rating);
   res.json({plans,createdPlan});
   // console.log(datePlan);
   // res.json({namePlan, datePlan, typePlace, provinceName, location});

}

////////////////////////////////////////////////////////////

const getBestPath = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     next(new HttpError('Invalid inputs passed, please check your data.', 422));
   }
   const {planId} = req.body;
   const places = [];
   // console.log(planId);
   req.setTimeout(0);
   let plan;
   try {
      plan = await UserPlan.findById(planId);
   } catch(err){
      // console.log(err);
      const error = new HttpError(
         'Something went wrong1, could not delete place.', 
         500
      );
      return next(error);
   }

   if(!plan) {
      const error = new HttpError(
         'Could not find plan for this id.', 
         404
      );
      return next(error);
   }

   // console.log(plan);


   let placeInPlan;
   try {
      placeInPlan = await UserPlan.findById(planId).populate('places');
   } catch(err) {
      const error = new HttpError(
         'Comment failed, please try again.',
         500
      );
      return next(error);
   }

   if(placeInPlan.length === 0){
      const error = new HttpError(
         'ไม่พบสถานที่ท่องเที่ยว',
         500
      );
      return next(error);
   }

 
   places.push(plan.origin)
   for(i = 0; i< placeInPlan.places.length; i++){
      places.push(placeInPlan.places[i].address);
   }
   console.log(places);

   let plans;

   try {
     plans = await getPlan(places);

   } catch (error) {
      console.log(error);
     return next(error);
   }

   if(!plans||plans.places.length === 0 ){
      const error = new HttpError(
         'Could not create plan.', 
         404
    );
   }

   // console.log(plans.places);
   // console.log(plans.bestPath);

   const newPlaces = [];
   
   for(x = 1; x < plans.places.length; x++){
      for(i = 0; i< placeInPlan.places.length; i++){
         if( plans.places[x] === placeInPlan.places[i].address ){
            newPlaces.push(placeInPlan.places[i]._id);
            break;
         }
      }
   }

   console.log(newPlaces);
   console.log(plans.places);
   console.log(plans.bestPath);


   plan.distance = plans.bestPath;
   plan.places = newPlaces;

   try {
      await plan.save();
   } catch(err) {
      // console.log(err);
      const error = new HttpError(
         'Something went wrong, could not update plan2.', 
         500
      );
      return next(error);
   }

   res.json({place: placeInPlan.places.map(place => place.toObject({getters: true }))}); 

  

}

exports.createPlan = createPlan;
exports.getPlanById = getPlanById;
exports.getPlansByUserId = getPlansByUserId;
exports.addPlaceToPlan = addPlaceToPlan;
exports.getPlacesByPlanId = getPlacesByPlanId;
exports.updatePlanById = updatePlanById;
exports.deleltePlaceInPlan = deleltePlaceInPlan;
exports.deletePlanById = deletePlanById;
exports.countPlans = countPlans;
exports.getPlans = getPlans;
exports.SearchPlans = SearchPlans;
exports.countSearchPlans = countSearchPlans;
exports.sharedPlan = sharedPlan;
exports.autoPlan = autoPlan;
exports.getBestPath = getBestPath;