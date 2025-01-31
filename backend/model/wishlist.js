const mongoose = require("mongoose");


const wishlistschema =  new mongoose.Schema({
  
    username:{
        type:String ,
        default : Array,
        required : true
    },

    id:{
        type:[String] ,
        required : true
    }


})

const wish = mongoose.model('wishlist', wishlistschema );

module.exports = wish;