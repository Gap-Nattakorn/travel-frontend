const express = require('express');
const {check} = require('express-validator');

const usersControllers = require('../controller/users-controller');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();



router.get('/', usersControllers.getUsers);

router.get('/edit/:uid', usersControllers.getUsersByUserId);

//router.use(checkAuth);


router.patch(
   '/edit/:uid',
   fileUpload.single('image'),
   [
      check('name')
         .not()
         .isEmpty()
   ], 
   usersControllers.updateUser
);
router.patch(
   '/editPassword/:uid',
   fileUpload.single('image'),
   [
      check('password')
         .not()
         .isEmpty()
   ], 
   usersControllers.updatePassword
);


router.post(
   '/signup', 
   fileUpload.single('image'),
   [
      check('name')
         .not()
         .isEmpty(),
      check('email')
         .normalizeEmail()
         .isEmail(),
      check('password').isLength({min: 6})
   ],
   usersControllers.signup);

router.post('/login', usersControllers.login);

module.exports = router;


