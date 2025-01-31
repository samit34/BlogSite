const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  image: {
    type: String, 
    required: true
  },
  heading: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  category:{
    type: String,
     required: true
  },

  username: {
    type: String, // Add username field
    required: true
},

userid : {
  type : String,
  required : true
},


eyecatch : {
  type : String,
  required : true
},
 
date : {
  type : String,
  required : true
},



liked: {
  type: [String],  
  default: []      
}


});




const category = mongoose.model('blogcontent ', userSchema);

module.exports = category;