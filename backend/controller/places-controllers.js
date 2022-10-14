const fs = require('fs');

const log4js = require("log4js");
log4js.configure({
   appenders: { cheese: { type: "file", filename: "cheese.log" } },
   categories: { default: { appenders: ["cheese"], level: "error" } }
 });
//const uuid = require('uuid');
const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const Province = require('../models/province');
const TypePlace = require('../models/typePlace');
const CommentPlace = require('../models/commentPlace');
const { compare } = require('bcryptjs');

const testLog = async (req, res, next) => {
   const logger = log4js.getLogger("AUTO PLAN");
   // logger.trace("Entering cheese testing");
   // logger.debug("Got cheese.");
   //logger.info("Cheese is Comté.");
   // logger.warn("Cheese is quite smelly.");
   // logger.error("Cheese is too ripe!");
   //logger.log('test')
   logger.fatal("Cheese was breeding ground for listeria.");
}

const getPlaces = async (req, res, next) => {
   const {pageNumber, pagination} = req.body;
   let places;
   try {
      places = await Place.find({})
                           .sort({rating:-1})
                           .skip((pageNumber - 1) * pagination)
                           .limit(pagination);

   } catch(err){
      const error = new HttpError(
         'Fecthing places failed, please try again later.', 
         500
      );

      return next(error);
   }
   
   res.json({ places: places.map(place => place.toObject({getters: true}))});
};

////////////////////////////////////////////////////////////////////////////////

const countPlaces = async (req, res, next) => {
   
   let places;
   try {
      places = await Place.countDocuments();

   } catch(err){
      const error = new HttpError(
         'Fecthing places failed, please try again later.', 
         500
      );

      return next(error);
   }
   // console.log(places)
   
   res.json({ countPlaces: places});
};

////////////////////////////////////////////////////////////////////////////////

const countPlacesByProvince = async (req, res, next) => {
   const {provinceName} = req.body
   let places;
   try {
      places = await Place.countDocuments({province: provinceName});

   } catch(err){
      const error = new HttpError(
         'Fecthing places failed, please try again later.', 
         500
      );

      return next(error);
   }
   // console.log(places)
   
   res.json({ countPlaces: places});
};

////////////////////////////////////////////////////////////////////////////////

const countPlacesByTypePlace = async (req, res, next) => {
   const {typePlace} = req.body
   let places;
   try {
      places = await Place.countDocuments({typePlace});

   } catch(err){
      const error = new HttpError(
         'Fecthing places failed, please try again later.', 
         500
      );

      return next(error);
   }
   // console.log(places)
   
   res.json({ countPlaces: places});
};

////////////////////////////////////////////////////////////////////////////////

const countPlacesByProvinceAndTypePlace = async (req, res, next) => {
   const {provinceName, typePlace} = req.body

   let places;
   try {
      places = await Place.countDocuments({province: provinceName, typePlace});

   } catch(err){
      const error = new HttpError(
         'Fecthing places failed, please try again later.', 
         500
      );

      return next(error);
   }
   // console.log(places)
   
   res.json({ countPlaces: places});
};

////////////////////////////////////////////////////////////////////////////////

const getProvinces = async (req, res, next) => {
   let provinces;
   try {
      provinces = await Province.find({});

   } catch(err){
      const error = new HttpError(
         'Fecthing provinces failed, please try again later.', 
         500
      );

      return next(error);
   }
   
   res.json({ provinces: provinces.map(provinces => provinces.toObject({getters: true}))});
};

////////////////////////////////////////////////////////////////////////////////

const getTypePlaces = async (req, res, next) => {
   let typePlaces;
   try {
      typePlaces = await TypePlace.find({});

   } catch(err){
      const error = new HttpError(
         'Fecthing typePlaces failed, please try again later.', 
         500
      );

      return next(error);
   }
   
   res.json({ typePlaces: typePlaces.map(typePlaces => typePlaces.toObject({getters: true}))});
};

////////////////////////////////////////////////////////////////////////////////

const getPlaceById = async (req, res, next) => {
   const placeId = req.params.pid;

   let place;

   try {
      place = await Place.findById(placeId);
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

   res.json({place: place.toObject({getters: true})}); 
};

////////////////////////////////////////////////////////////////////////////////

const getPlacesByProvince = async (req, res, next) => {
   const {provinceName ,pageNumber, pagination} = req.body;
   let provinces;
   try {
      provinces = await Place.find({province: provinceName})
                              .sort({title:1})
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
   // if (!provinces || provinces.length === 0) {
   //    return next(
   //       new Error('Could not find a places for the provided user id.', 404)
   //    );
   // }
   

   res.json({ places: provinces.map(place => place.toObject({getters: true}))});
};

//////////////////////////////////////////////

const getPlacesByTypePlace = async (req, res, next) => {
   const {typePlace ,pageNumber, pagination} = req.body;
   let places;
   try {
      places = await Place.find({typePlace: typePlace})
                              .sort({rating:-1})
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
   

   res.json({ places: places.map(place => place.toObject({getters: true}))});
};

//////////////////////////////////////////////

const getPlacesByProvinceAndTypePlace = async (req, res, next) => {
   const {provinceName ,typePlace ,pageNumber, pagination} = req.body;
   let places;
   try {
      places = await Place.find({province: provinceName, typePlace: typePlace})
                              .sort({title:1})
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
   

   res.json({ places: places.map(place => place.toObject({getters: true}))});
};

//////////////////////////////////////////////


const getPlacesByUserId = async (req, res, next) => {
   const userId = req.params.uid;
   //console.log(userId);
   let userWithPlaces;
   try {
      userWithPlaces = await User.findById(userId).populate('places');
   } catch (err) {
      const error = new HttpError(
         'Fetching places failed, please try again later', 
         500
      );

      return next(error);
   }

   if (!userWithPlaces || userWithPlaces.places.length === 0) {
      return next(
         new Error('Could not find a places for the provided user id.', 404)
      );
   }
   // console.log(userWithPlaces);

   res.json({places: userWithPlaces.places.map(place => place.toObject({getters: true })) });
}

////////////////////////////////////////////////////////////////////////////////

const getCommentByPlaceId = async (req, res, next) => {
   const placeId = req.params.pid;

   let CommentWithPlaces;
   try {
      CommentWithPlaces = await CommentPlace.find({place:placeId});
   } catch (err) {
      const error = new HttpError(
         'Fetching places failed, please try again later', 
         500
      );

      return next(error);
   }
   
   if (!CommentWithPlaces) {
      return next(
         new Error('Could not find a places for the provided user id.', 404)
      );
   }
   //console.log(CommentWithPlaces);

   res.json({ comment: CommentWithPlaces.map(comments => comments.toObject({getters: true}))});
}

////////////////////////////////////////////////////////////////////////////////


const createPlace = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     next(new HttpError('Invalid inputs passed, please check your data.', 422));
   }
 
   const { title, description, address, provinceName, typeName, opening} = req.body;
   // console.log(opening);
   const openDay = [];
   const day = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
   console.log(opening)
   const d = opening.split(',');
   for(i = 0; i < d.length; i++ ){

      openDay.push(day[d[i]])
   }
   console.log(openDay)

   let coordinates;
   try {
      coordinates = await getCoordsForAddress(address);
      // console.log(coordinates);

   } catch (error) {
      // console.log(error);
     return next(error);
   }

   let province;

   try {
      province = await Province.findOne({name: provinceName});
   } catch(err) {
      const error = new HttpError(
         'Creating place failed, please try again.',
         500
      );
      return next(error);
   }

   if(!province) {
      const error = new HttpError(
         'Could not find province',
         404
      );
      return next(error);
   }

   
   let typePlace;

   try {
      typePlace = await TypePlace.findOne({typeName: typeName});
   } catch(err) {
      const error = new HttpError(
         'Creating place failed, please try again.',
         500
      );
      return next(error);
   }

   if(!typePlace) {
      const error = new HttpError(
         'Could not find typePlace',
         404
      );
      return next(error);
   }

   // console.log(typePlace);
   
   
   const createdPlace = new Place({
      title,
      description,
      address,
      location: coordinates,
      image: req.file.path,
      province: province._id,
      typePlace: typePlace._id,
      creator: req.userData.userId,
      comments: [],
      rating:0,
      opening:openDay
   });

   // console.log(createdPlace);
   
   let user;

   try {
      user = await User.findById(req.userData.userId);
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

   // console.log(user);


   try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdPlace.save({session:sess});
      user.places.push(createdPlace);
      province.places.push(createdPlace);
      typePlace.places.push(createdPlace);
      await user.save({session:sess});
      await province.save({session:sess});
      await typePlace.save({session:sess});
      await sess.commitTransaction();

   } catch(err) {
      console.log(err);
      const error = new HttpError(
         'Creating place failed, please try again2.',
         500
      );
      return next(error);
   }
 
 
   res.status(201).json({ place: createdPlace });
 };

////////////////////////////////////////////////////////////////////////////////


const updatePlaceById = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      // console.log(errors);
      throw new HttpError('Invalid inputs passed, please check your data', 422);
   }
   // console.log(req.body);
   const {title, description, address} = req.body;
   // console.log(title);
   const placeId = req.params.pid;
   const imageUpdate = req.file;

   // console.log(placeId);
   // console.log("PATH " + imageUpdate);

   let place;
   try {
      place = await Place.findById(placeId);
   } catch(err) {
      const error = new HttpError(
         'Something went wrong, could not update place.', 
         500
      );

      return next(error);
   }

   if (place.creator.toString() !== req.userData.userId) {
      const error = new HttpError(
         'You are not allowed to edit this place', 
         401
      );

      return next(error);
   }

   const imagePath = place.image;

   let coordinates;
   try {
     coordinates = await getCoordsForAddress(address);
   } catch (error) {
     return next(error);
   }
   
   place.title = title;
   place.description = description;
   place.address = address;
   place.location = coordinates;
   
   if(imageUpdate){
      place.image = req.file.path;
   }
   

   try {
      await place.save();
      if(imageUpdate){
         fs.unlink(imagePath, err => {
            console.log(err);
         });
      }
   } catch(err) {
      // console.log(err);
      const error = new HttpError(
         'Something went wrong, could not update place2.', 
         500
      );
      return next(error);
   }

   res.status(200).json({place: place.toObject({getters: true})});
   
};

////////////////////////////////////////////////////////////////////////////////


const deletePlaceById = async (req, res, next) => {
   const placeId = req.params.pid;
   
   let place;
   try {
      place = await Place.findById(placeId).populate('creator province typePlace');
   } catch(err){
      // console.log(err);
      const error = new HttpError(
         'Something went wrong1, could not delete place.', 
         500
      );
      return next(error);
   }

   if(!place) {
      const error = new HttpError(
         'Could not find place for this id.', 
         404
      );
      return next(error);
   }

   if (place.creator.id !== req.userData.userId) {
      const error = new HttpError(
         'You are not allowed to delete this place', 
         401
      );

      return next(error);
   }

   //console.log(place);

   const imagePath =  place.image;

   try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await place.remove({session: sess});
      place.creator.places.pull(place);
      place.province.places.pull(place);
      place.typePlace.places.pull(place);
      await place.creator.save({session: sess});
      await place.province.save({session: sess});
      await place.typePlace.save({session: sess});
      await sess.commitTransaction();
   } catch(err) {
      console.log(err);
      const error = new HttpError(
         'Something went wrong2, could not delete place.', 
         500
      );
      return next(error);
   }

   fs.unlink(imagePath, err => {
      console.log(err);
   });
   
   res.status(200).json({ message:'Deleted Place!' })
};

////////////////////////////////////////////////////////

const createProvince = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return next(
         new HttpError('Invalid inputs passed, please check your data', 422)
      );
   }
   const { provinceName } = req.body;

   const createdProvince = new Province({
      name:provinceName,
      places: []
   });

   try {
      await createdProvince.save();
   } catch(err) {
      const error = new HttpError(
         'Signing up failed, please try again.',
         500
      );
      return next(error);
   }

   res.status(201).json({ province: createdProvince });

 };

////////////////////////////////////////////////////////

const createTypePlace = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return next(
         new HttpError('Invalid inputs passed, please check your data', 422)
      );
   }
   const { typeName } = req.body;

   const createdTypePlace = new TypePlace({
      typeName,
      places: []
   });

   try {
      await createdTypePlace.save();
   } catch(err) {
      const error = new HttpError(
         'Signing up failed, please try again.',
         500
      );
      return next(error);
   }

   res.status(201).json({ typePlace: createdTypePlace });

 };

////////////////////////////////////////////////////////

 const createCommentPlace = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     next(new HttpError('Invalid inputs passed, please check your data.', 422));
   }
 
   const {comment, rating, placeId, reviewer} = req.body;
 
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
      user = await User.findById(reviewer);
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


   const createdComment = new CommentPlace({
      comment,
      rating,
      place: placeId,
      reviewer: reviewer,
      userName: user.name
   });


   // console.log(rating/(place.comments.length+1));
   console.log(((place.rating*place.comments.length)+rating));
   console.log((place.comments.length + 1));
   if(place.comments.length !== 0){
      place.rating = (((place.rating*place.comments.length)+rating)/(place.comments.length + 1));
   }else{
      place.rating = rating;
   }
   console.log(place.rating)

   try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdComment.save({session:sess});
      user.comments.push(createdComment);
      place.comments.push(createdComment);
      await user.save({session:sess});
      await place.save({session:sess});
      await sess.commitTransaction();

   } catch(err) {
      console.log(err);
      const error = new HttpError(
         'Creating place failed, please try again2.',
         500
      );
      return next(error);
   }
 
 
   res.status(201).json({ comment: createdComment }); 

 };

////////////////////////////////////////////////////////

const updateCommentPlace = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     next(new HttpError('Invalid inputs passed, please check your data.', 422));
   }
 
   const {comment, rating, placeId, reviewer, id} = req.body;

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

   let commentPlaces;

   try {
      commentPlaces = await Place.findById(placeId).populate('comments');
   } catch(err) {
      const error = new HttpError(
         'Comment failed, please try again.',
         500
      );
      return next(error);
   }

   if(!commentPlaces) {
      const error = new HttpError(
         'Could not find place',
         404
      );
      return next(error);
   }
   //console.log(commentPlaces.comments[0].rating);
   // console.log(commentPlaces.comments.length);
   let Rating = 0;

   if(commentPlaces.comments.length > 0){
      for(i = 0; i < commentPlaces.comments.length; i++){
         if(commentPlaces.comments[i].id === id){
            Rating += rating;
            continue;
         }
         // console.log(commentPlaces.comments[i].rating)
         Rating += commentPlaces.comments[i].rating;
      }
   
   
      place.rating = Rating/commentPlaces.comments.length;
   }else {
      place.rating = rating;
   }
   // console.log("ra"+place.rating);
   

   let cmt;
   try {
      cmt = await CommentPlace.findById(id);
   } catch(err) {
      const error = new HttpError(
         'Something went wrong, could not update place.', 
         500
      );

      return next(error);
   }

   if (cmt.reviewer.toString() !== reviewer) {
      const error = new HttpError(
         'You are not allowed to edit this place', 
         401
      );

      return next(error);
   }

   cmt.comment = comment;
   cmt.rating = rating;

   try {
      await cmt.save();
      await place.save();
     
   } catch(err) {
      console.log(err);
      const error = new HttpError(
         'Something went wrong, could not update place2.', 
         500
      );
      return next(error);
   }

   res.status(201).json({ update: cmt }); 


 
}

////////////////////////////////////////////////////////

const setFavoritePlacesByUserId = async (req, res, next) => {
   const userId = req.params.uid;

   let favoritePlaces;
   try {
      favoritePlaces = await User.findById(userId);
   } catch (err) {
      const error = new HttpError(
         'Fetching places failed, please try again later', 
         500
      );

      return next(error);
   }

   //console.log(favoritePlaces);

   res.json({favoritePlaces: favoritePlaces.toObject({getters: true }) });
}

///////////////////////////////////////////////////////

const addFavoritePlaces = async (req, res, next) => {
   const { placeId } = req.body;
   const userId = req.params.uid;

   let user;
   try {
      user = await User.findById(userId);
   } catch (err) {
      const error = new HttpError(
         'Fetching places failed, please try again later', 
         500
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

   try {
      
      user.favoritePlaces.push(place);
      await user.save();

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

///////////////////////////////////////////////////////

const deleteFavoritePlaces = async (req, res, next) => {
   const { placeId } = req.body;
   const userId = req.params.uid;

   let user;
   try {
      user = await User.findById(userId);
   } catch (err) {
      const error = new HttpError(
         'Fetching places failed, please try again later', 
         500
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

   try {
      
      user.favoritePlaces.pull(place);
      await user.save();

   } catch(err) {
      console.log(err);
      const error = new HttpError(
         'Creating place failed, please try again2.',
         500
      );
      return next(error);
   }


   res.status(201).json({ message:"delete done" }); 
}

///////////////////////////////////////////////////////

const getFavoritePlacesByUserId = async (req, res, next) => {
   const userId = req.params.uid;

   let favoritePlaces;
   try {
      favoritePlaces = await User.findById(userId).populate('favoritePlaces');
   } catch (err) {
      const error = new HttpError(
         'Fetching places failed, please try again later', 
         500
      );

      return next(error);
   }
   //console.log(favoritePlaces);

   // if (!favoritePlaces || favoritePlaces.favoritePlaces.length === 0) {
   //    return next(
   //       new Error('Could not find a places for the provided user id.', 404)
   //    );
   // }
   // console.log(userWithPlaces);

   res.json({places: favoritePlaces.favoritePlaces.map(place => place.toObject({getters: true })) });
}

///////////////////////////////////////////////////////

const getPopularPlaces = async (req, res, next) => {
   let places;
   try {
      places = await Place.find({})
                           .sort({rating:-1})
                           .limit(5);

   } catch(err){
      const error = new HttpError(
         'Fecthing places failed, please try again later.', 
         500
      );

      return next(error);
   }
   
   res.json({ places: places.map(place => place.toObject({getters: true}))});
}

const test = async (req, res, next) => {

   const {opening,datePlan} = req.body;
   const birthday = new Date(datePlan);
   const day1 = birthday.getDay();
   let places;
   try {
      places = await Place.find({opening:day1})

   } catch(err){
      const error = new HttpError(
         'Fecthing places failed, please try again later.', 
         500
      );

      return next(error);
   }
   console.log(places);
   
   res.json({ places: places.map(place => place.toObject({getters: true})),day1});
}



exports.getPlaces = getPlaces;
exports.getProvinces = getProvinces;
exports.getTypePlaces = getTypePlaces;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.getPlacesByProvince = getPlacesByProvince; 
exports.getPlacesByTypePlace = getPlacesByTypePlace; 
exports.getPlacesByProvinceAndTypePlace = getPlacesByProvinceAndTypePlace; 
exports.getCommentByPlaceId = getCommentByPlaceId;
exports.createPlace = createPlace;
exports.createProvince = createProvince;
exports.createTypePlace = createTypePlace;
exports.createCommentPlace = createCommentPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
exports.countPlaces = countPlaces;
exports.countPlacesByProvince = countPlacesByProvince;
exports.countPlacesByTypePlace = countPlacesByTypePlace;
exports.countPlacesByProvinceAndTypePlace = countPlacesByProvinceAndTypePlace;
exports.updateCommentPlace = updateCommentPlace;
exports.getFavoritePlacesByUserId = getFavoritePlacesByUserId;
exports.setFavoritePlacesByUserId = setFavoritePlacesByUserId;
exports.addFavoritePlaces = addFavoritePlaces;
exports.deleteFavoritePlaces = deleteFavoritePlaces;
exports.getPopularPlaces = getPopularPlaces;
exports.test = test;
exports.testLog = testLog;