const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true, // Ensures unique emails
  },
  
  photo: {
    type: String,
     
  },


  status: { type: String, enum: ['active', 'blocked'], default: 'active' },

  role:{
    type: String,
    required : true,
    default: "user"
  }


});




const User = mongoose.model('User', userSchema);

module.exports = User;
