const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
   
   title: {type: String, required: true},
   description: {type: String, required: true},
   rating: {type: Number, required: true},
   image: {type: String, required: true},
   address: {type: String, required: true},
   location: {
      lat: {type: Number, required: true},
      lng: {type: Number, required: true}
   },
   opening : [{type: String, required: true}],
   province: {type: mongoose.Types.ObjectId, required:true, ref: 'Province'},
   typePlace: {type: mongoose.Types.ObjectId, required:true, ref: 'TypePlace'},
   creator: {type: mongoose.Types.ObjectId, required:true, ref: 'User'},
   comments: [{type: mongoose.Types.ObjectId, required:true, ref: 'CommentPlace'}]

});


module.exports = mongoose.model('Place', placeSchema);