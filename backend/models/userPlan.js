const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userPlanSchema = new Schema({
   
   namePlan: {type: String, required: true},
   datePlan: {type: Date, required: true},
   origin: {
      lat: {type: Number, required: true},
      lng: {type: Number, required: true}
   },
   places: [{type: mongoose.Types.ObjectId, required:true, ref: 'Place'}],
   creator: {type: mongoose.Types.ObjectId, required:true, ref: 'User'},
   distance: {type: Number, required: true},

});


module.exports = mongoose.model('UserPlan', userPlanSchema);