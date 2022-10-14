const fs = require('fs');

const { validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const CommentPlace = require('../models/commentPlace');



const getUsers = async (req, res, next) => {
   let users;
   try {
      users = await User.find({}, '-password ');

   } catch(err){
      const error = new HttpError(
         'Fecthing users failed, please try again later.', 
         500
      );

      return next(error);
   }
   
   res.json({ users: users.map(user => user.toObject({getters: true}))});
};

///////////////////////////////////////////////////////////////////////////

const getUsersByUserId = async (req, res, next) => {
   const userId = req.params.uid;

   let user;
   try {
      user = await User.findById(userId);
   } catch (err) {
      const error = new HttpError(
         'Fetching user failed, please try again later', 
         500
      );

      return next(error);
   }

   if (!user) {
      return next(
         new Error('Could not find a user for the provided user id.', 404)
      );
   }

   res.status(200).json({user: user.toObject({getters: true})});

};

///////////////////////////////////////////////////////////////////////////


const updateUser = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      console.log(errors);
      throw new HttpError('Invalid inputs passed, please check your data', 422);
   }
   const {name}  = req.body;
   const userId = req.params.uid;
   const imageUpdate = req.file;


   let user;
   try {
      user = await User.findById(userId);
   } catch(err) {
      const error = new HttpError(
         'Something went wrong, could not update place.', 
         500
      );

      return next(error);
   }

   let commentsUser;
   try {
      commentsUser = await CommentPlace.updateMany({reviewer:userId},{userName:name});
   } catch(err) {
      console.log(err)
      const error = new HttpError(
         'Something went wrong, could not update place.', 
         500
      );

      return next(error);
   }

   // console.log(commentsUser.userName);
   // if (user.id !== req.userData.userId) {
   //    const error = new HttpError(
   //       'You are not allowed to edit this place', 
   //       401
   //    );

   //    return next(error);
   // }
   
   const imagePath = user.image;
   
   user.name = name;
   
   // const u = commentsUser.map(comment => {console.log(comment.userName);comment.userName = name});

   if(imageUpdate){
      user.image = req.file.path;
   }
   
   // console.log(commentsUser);


   try {
      await user.save();
      // await commentsUser.save();
      if(imageUpdate){
         fs.unlink(imagePath, err => {
            console.log(err);
         });
      }
   } catch(err) {
      console.log(err)
      const error = new HttpError(
         'Something went wrong, could not update user.', 
         500
      );
      return next(error);
   }

   

   res.status(200).json({user: user.toObject({getters: true})});
   
};

///////////////////////////////////////////////////////////////////////////


const signup = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return next(
         new HttpError('Invalid inputs passed, please check your data', 422)
      );
   }
   const { name, email, password } = req.body;

   let existingUser;
   try {
      existingUser = await User.findOne({email: email});

   } catch(err) {
      const error = new HttpError(
         'Signing up failed, please try again later.', 
         500
      );

      return next(error);
   }

   if (existingUser){
      const error = new HttpError(
         'มีบัญชีผู้ใช้นี้อยู่เเล้ว', 
         422
      );
      return next(error);
   }

   let hashedPassword;
   try {
      hashedPassword = await bcrypt.hash(password, 12);
   } catch(err) {
      const error = new HttpError(
         'Could not create user, please try again1.', 
         500
      );
      return next(error);
   }
   
   const createdUser = new User({
      name,
      email,
      image: req.file.path,
      password: hashedPassword,
      status: 'user',
      places: [],
      plans: [],
      comments: [],
      favoritePlaces: []
   });

   try {
      await createdUser.save();
   } catch(err) {
      console.log(err)
      const error = new HttpError(
         'Signing up failed, please try again2.',
         500
      );
      return next(error);
   }

   let token;
   try {
      token = await jwt.sign(
         {userId: createdUser.id, email: createdUser.email},
         'supersecret_dont_share',
         {expiresIn: '1h'}
      );
   }catch(err){
      const error = new HttpError(
         'Signing up failed, please try again3.',
         500
      );
      return next(error);
   }


   res
      .status(201)
      .json({
         userId: createdUser.id, 
         email: createdUser.email, 
         userName: createdUser.name,
         ImageUser:createdUser.image, 
         status: createdUser.status, 
         token: token 
      });
};

///////////////////////////////////////////////////////////////////////////


const login = async (req, res, next) => {
   const {email, password} = req.body;

   let existingUser;

   try {
      existingUser = await User.findOne({email: email});

   } catch(err) {
      const error = new HttpError(
         'เข้าสู่ระบบผิดพลาด กรุณาลองอีกครั้ง', 
         500
      );
      console.log('fail');
      
      return next(error);
   }

   if (!existingUser) {
      const error = new HttpError(
         'ไม่พบบัญชีผู้ใช้งาน', 
         403
      );
      console.log('Logged fail1');
      
      return next(error);
   }

   let isValidPassword = false;
   try {
      // console.log(await bcrypt.compare(password, existingUser.password));
      isValidPassword = await bcrypt.compare(password, existingUser.password);
      // console.log(isValidPassword);
   } catch(err) {
      const error = new HttpError(
         'Could not log you in, please check your credentials and try again', 
         500
      );
      return next(error);   
   }


   if (!isValidPassword) {
      const error = new HttpError(
         'รหัสผ่านผิด', 
         403
      );
      console.log('Logged fail2');
      
      return next(error);
   }

   // console.log(existingUser);

   let token;
   try {
      token = await jwt.sign(
         {userId: existingUser.id, email: existingUser.email},
         'supersecret_dont_share',
         {expiresIn: '1h'}
      );
   }catch(err){
      const error = new HttpError(
         'เข้าสู่ระบบผิดพลาด กรุณาลองอีกครั้ง',
         500
      );
      return next(error);
   }
   
   console.log('Login');
   res.json({
      userId: existingUser.id, 
      userName: existingUser.name,
      ImageUser:existingUser.image, 
      email: existingUser.email, 
      status: existingUser.status, 
      token: token 
   });

};

///////////////////////////////////////////////////////////////////////////

const updatePassword = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      console.log(errors);
      throw new HttpError('Invalid inputs passed, please check your data', 422);
   }
   const {password}  = req.body;
   const userId = req.params.uid;

   let user;
   try {
      user = await User.findById(userId);
   } catch(err) {
      const error = new HttpError(
         'Something went wrong, could not update place.', 
         500
      );

      return next(error);
   }

   let hashedPassword;
   try {
      hashedPassword = await bcrypt.hash(password, 12);
   } catch(err) {
      const error = new HttpError(
         'Could not create user, please try again.', 
         500
      );
      return next(error);
   }

   user.password = hashedPassword;

   try {
      await user.save();
      // await commentsUser.save();
   } catch(err) {
      console.log(err)
      const error = new HttpError(
         'Something went wrong, could not update user.', 
         500
      );
      return next(error);
   }
   
   res.status(200).json({user: user.toObject({getters: true})});

}

exports.getUsers = getUsers;
exports.getUsersByUserId = getUsersByUserId;
exports.updateUser = updateUser;
exports.updatePassword = updatePassword;
exports.signup = signup;
exports.login = login;