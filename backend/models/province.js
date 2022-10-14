const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const provinceSchema = new Schema({
   
   name: {type: String, required: true},
   places: [{type: mongoose.Types.ObjectId, required:true, ref: 'Place'}]

});


module.exports = mongoose.model('Province', provinceSchema);