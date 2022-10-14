const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const User = require('../models/user');

const Schema = mongoose.Schema;

const commentPlaceSchema = new Schema({
   
   comment: {type: String, required: true},
   rating: {type: Number, required: true},
   place: {type: mongoose.Types.ObjectId, required:true, ref: 'Place'},
   reviewer: {type: mongoose.Types.ObjectId, required:true, ref: 'User'},
   dateComment: { type : Date, default: Date.now },
   userName: {type: String, required: true}

});


module.exports = mongoose.model('CommentPlace', commentPlaceSchema);