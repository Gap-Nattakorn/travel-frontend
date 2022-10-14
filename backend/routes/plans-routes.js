const express = require('express');
const { check } = require('express-validator');

const planControllers = require('../controller/plans-controllers');
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/countPlans/all/plans', planControllers.countPlans);


router.post(
   '/plans/all/plans',
   [
      check('pageNumber')
         .not()
         .isEmpty(),
      check('pagination')
         .not()
         .isEmpty(),
   ], 
   planControllers.getPlans
);

router.post('/countPlans/searchPlans/plans',
   [
      check('searchPlans')
         .not()
         .isEmpty(),
   ], 
   planControllers.countSearchPlans 
);

router.post('/search/searchPlans/plans',
   [
      check('searchPlans')
         .not()
         .isEmpty(),
      check('pageNumber')
         .not()
         .isEmpty(),
      check('pagination')
         .not()
         .isEmpty(),
   ], 
   planControllers.SearchPlans 
);

router.use(checkAuth);

router.get('/:pid', planControllers.getPlanById);

router.post(
   '/autoPlan/plans/bestPath',
   fileUpload.single('image'),
   [
      check('planId')
         .not()
         .isEmpty(),
   ],
   planControllers.getBestPath
   
);

router.patch(
   '/:pid',
   fileUpload.single('image'),
   [
      check('namePlan')
         .not()
         .isEmpty(),
      check('datePlan')
         .not()
         .isEmpty() 
   ], 
   planControllers.updatePlanById 
);

router.get('/places/:pid', planControllers.getPlacesByPlanId);

router.get('/user/:uid', planControllers.getPlansByUserId);

router.post(
   '/addPlace',
   fileUpload.single('image'),
   [
      check('userId')
         .not()
         .isEmpty(),
      check('placeId')
         .not()
         .isEmpty(),
      check('planId')
         .not()
         .isEmpty(),
   ],
   planControllers.addPlaceToPlan
)



router.post(
   '/createPlan',
   fileUpload.single('image'),
   [
      check('namePlan')
         .not()
         .isEmpty(),
      check('datePlan')
         .not()
         .isEmpty(),
      check('lat')
         .not()
         .isEmpty(),
      check('lng')
         .not()
         .isEmpty(),
   ],
   planControllers.createPlan
);

router.post(
   '/autoplan/plans/plans',
   fileUpload.single('image'),
   [
      check('namePlan')
         .not()
         .isEmpty(),
      check('datePlan')
         .not()
         .isEmpty(),
      check('typePlace')
         .not()
         .isEmpty(),
      check('provinceName')
         .not()
         .isEmpty(),
      check('lat')
         .not()
         .isEmpty(),
      check('lng')
         .not()
         .isEmpty(),
      check('typePlan')
         .not()
         .isEmpty(),
      check('countPlace')
         .not()
         .isEmpty(),
   ], 
   planControllers.autoPlan);


router.delete('/:pid',planControllers.deletePlanById );

router.post('/sharedPlans/:pid',planControllers.sharedPlan );

router.delete(
   '/:pid/places',
   fileUpload.single('image'),
   [
      check('placeId')
         .not()
         .isEmpty(),
   ],

   planControllers.deleltePlaceInPlan 
);



module.exports = router;