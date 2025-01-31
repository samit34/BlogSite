// const mangoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config()
const {connectDB} = require("./config/ds");
const userRoute = require("./route/userroute")
const path = require("path")
const port = process.env.port || 8000;
app.use(express.json());



app.use(cors());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB()




 
app.use('/user' , userRoute);

app.listen(port,()=>{
    console.log(`the server is running on ${port}`);
})



