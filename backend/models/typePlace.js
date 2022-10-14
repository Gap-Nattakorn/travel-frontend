const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const typePlaceSchema = new Schema({
   
   typeName: {type: String, required: true},
   places: [{type: mongoose.Types.ObjectId, required:true, ref: 'Place'}]

});


module.exports = mongoose.model('TypePlace', typePlaceSchema);