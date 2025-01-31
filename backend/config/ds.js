const mongoose = require("mongoose");
 require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI


const connectDB = ( )=>{
  
    try{
    mongoose.connect(MONGO_URI);
 console.log("the data base is connected")
}catch(err){
  console.log(" the data base is not connected" ,err);
}


}

module.exports = {connectDB};