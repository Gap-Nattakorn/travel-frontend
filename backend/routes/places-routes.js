const express = require('express');
const { check } = require('express-validator');

const placeControllers = require('../controller/places-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();

router.get('/:pid', placeControllers.getPlaceById );

router.get('/test/logFile', placeControllers.testLog);

router.get('/popular/places', placeControllers.getPopularPlaces);

router.get('/user/:uid', placeControllers.getPlacesByUserId);

router.get('/favorite/:uid', placeControllers.setFavoritePlacesByUserId);

router.get('/favoritePlace/:uid', placeControllers.getFavoritePlacesByUserId);

router.post('/test/test/test', placeControllers.test);

router.post(
   '/addFavoritePlace/:uid',
   [
      check('placeId')
         .not()
         .isEmpty(),
   ],  
   placeControllers.addFavoritePlaces

);

router.delete(
   '/deleteFavoritePlace/:uid',
   [
      check('placeId')
         .not()
         .isEmpty(),
   ],  
   placeControllers.deleteFavoritePlaces

);

router.get('/countPlaces/all', placeControllers.countPlaces);

router.post(
   '/countPlaces/searchPlacesByProvince',
   [
      check('provinceName')
         .not()
         .isEmpty(),
   ],  
   placeControllers.countPlacesByProvince
);

router.post(
   '/countPlaces/searchPlacesByTypePlace',
   [
      check('typePlace')
         .not()
         .isEmpty(),
   ],  
   placeControllers.countPlacesByTypePlace
);

router.post(
   '/countPlaces/searchPlacesByProvinceAndTypePlace',
   [
      check('provinceName')
         .not()
         .isEmpty(),
      check('typePlace')
         .not()
         .isEmpty(),
   ],  
   placeControllers.countPlacesByProvinceAndTypePlace
);

router.post(
   '/places/all',
   [
      check('pageNumber')
         .not()
         .isEmpty(),
      check('pagination')
         .not()
         .isEmpty(),
   ], 
   placeControllers.getPlaces
);

router.get('/commentPlaces/:pid', placeControllers.getCommentByPlaceId);

router.get('/province/places', placeControllers.getProvinces);

router.get('/typePlace/places', placeControllers.getTypePlaces);

router.post('/search/serachPlacesByProvince',
   [
      check('provinceName')
         .not()
         .isEmpty(),
      check('pageNumber')
         .not()
         .isEmpty(),
      check('pagination')
         .not()
         .isEmpty(),
   ], 
   placeControllers.getPlacesByProvince 
);

router.post('/search/serachPlacesByTypePlace',
   [
     
      check('typePlace')
         .not()
         .isEmpty(),
      check('pageNumber')
         .not()
         .isEmpty(),
      check('pagination')
         .not()
         .isEmpty()
   ], 
   placeControllers.getPlacesByTypePlace
);

router.post('/search/searchPlacesByProvinceAndTypePlace',
   [
      check('provinceName')
      .not()
      .isEmpty(),
      check('typePlace')
         .not()
         .isEmpty(),
      check('pageNumber')
         .not()
         .isEmpty(),
      check('pagination')
         .not()
         .isEmpty(),
   ], 
   placeControllers.getPlacesByProvinceAndTypePlace
);

router.post(
   '/province/places',
   [
      check('provinceName')
         .not()
         .isEmpty(),
   ],
   placeControllers.createProvince
);

router.post(
   '/typePlace/places',
   [
      check('typeName')
         .not()
         .isEmpty(),
   ],
   placeControllers.createTypePlace
);




router.post(
   '/commentPlaces/places',
   [
      check('comment')
         .not()
         .isEmpty(),
      check('rating')
         .not()
         .isEmpty(),
      check('placeId')
         .not()
         .isEmpty(),
      check('reviewer')
         .not()
         .isEmpty(),
   ],
   placeControllers.createCommentPlace
);

router.patch(
   '/updateCommentPlaces/places',
   [
      check('comment')
         .not()
         .isEmpty(),
      check('rating')
         .not()
         .isEmpty(),
      check('placeId')
         .not()
         .isEmpty(),
      check('reviewer')
         .not()
         .isEmpty(),
      check('id')
         .not()
         .isEmpty(),
   ],
   placeControllers.updateCommentPlace
);


router.use(checkAuth);

router.post(
   '/',
   fileUpload.single('image'),
   [
      check('title')
         .not()
         .isEmpty(),
      check('description').isLength({min: 5}),
      check('address')
         .not()
         .isEmpty(), 
      check('provinceName')
         .not()
         .isEmpty(), 
      check('opening')
         .not()
         .isEmpty(), 
   ], 
   placeControllers.createPlace
);

router.patch(
   '/:pid',
   fileUpload.single('image'),
   [
      check('title')
         .not()
         .isEmpty(),
      check('description').isLength({min: 5}),
      check('address')
         .not()
         .isEmpty() 
   ], 
   placeControllers.updatePlaceById );

router.delete('/:pid',placeControllers.deletePlaceById );

module.exports = router;

