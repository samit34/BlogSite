const { userSignup, login, userupload, category, showcategories, showuser, homecat, deletecat, showblog, like, specificblog, wishlist, wishpage, deletecard ,  account, profilepic, card, deleteuser, blockuser, sendEmail } = require('../controller/usercontroll');
const express = require("express");

const User = require('../model/userschema');
const { upload } = require('../middleware/Multer');
const { verifyToken } = require('../middleware/jwtAuth');

const { blockMiddleware} = require('../middleware/block');
const { rolecheck } = require('../middleware/role');


const Route = express.Router();

Route.post('/signupuser', userSignup);

Route.post('/login',blockMiddleware ,  login);

Route.post('/upload', verifyToken, upload.single('image'), userupload);

Route.post('/categories', category)

Route.get('/showcategories', verifyToken, showcategories)

Route.get('/showuser', showuser)

Route.get('/homecategory', homecat)

Route.post('/deletecategory', deletecat)

Route.get('/showblog' ,showblog)

Route.post('/like', verifyToken, like)

Route.post('/specificblog/:id', specificblog)

Route.post('/wishlist',verifyToken, wishlist)
Route.post('/wish' , verifyToken , wishpage)

Route.post('/signup',userSignup)
Route.post('/deletecard', verifyToken ,  deletecard)

Route.post('/account', verifyToken  , account)

Route.post('/photo' , verifyToken , upload.single('photo') , profilepic )

Route.post("/card", card)

Route.post('/deleteuser',rolecheck("admin"), deleteuser);

Route.post('/userblock' ,verifyToken , rolecheck("admin") ,   blockuser)

Route.post ('/email' , sendEmail )

module.exports = (Route);



