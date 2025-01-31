const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },

 
});




const category = mongoose.model('categories', userSchema);

module.exports = category;
