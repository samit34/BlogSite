const { generateToken } = require('../middleware/jwtAuth');
const User = require('../model/userschema');
const bcrypt = require("bcrypt");
const { sendList, notFound } = require("../utils/apiResponse");

const blogcategory = require('../model/category');
const blogcontent = require("../model/blogcontentschema");
const wish = require('../model/wishlist');







const userSignup =  async (req, res) => {
  const { username, email, phone, password } =  req.body;
 
 
 

  try { 
    // Check if username or email already exists
    const existingUser = await User.find({ $or: [{ username:username }, { email:email }] });
    console.log("this is a existinguser" , existingUser )
    if (existingUser.length>0) {
      return res.status(400).json({ message: "Username or email already exists insignup " });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
      const role = "user";      

    // Create new user
    const newUser = new User({
      username,
      email,
      phone,
      role,
      password: hashedPassword,
    });

    await newUser.save();

    const data = await  User.find({username});
 
    const id = data[0]._id

    const payload = {
      username: username,
      userid:  id,
      role : role,

    }
    const  token =   generateToken(payload)

    res.status(201).json({ token, message: "Signup successful" });
  } 
   catch (err) {
    console.error(err);
    res.status(500).send("There is an error in the backend");
  }
};


const login = async (req, res) => {
  const { username, password } = req.body;


  try {
    console.log("Login attempt with:", username, password);

    // Check if the user exists in the database
    const user = await User.findOne({ username });

    if (!user) {
      console.log(" the user is not exist ")
      return res.status(400).json({ error: "Invalid username or password" });

    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      console.log("the password is not exist")
      return res.status(400).json({ error: "Invalid username or password" });
    }
      

    const payload = {
      username: user.username,
      userid: user._id,
      role : user.role

    }
    console.log("this is a samit role" , user.role)

    console.log("this is a pay load ", payload);

    const token = generateToken(payload)
    res.status(200).json({ message: "Login successful", user: { username: user.username }, token: token });
    console.log("the user login succesfully")

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
};






const userupload = async (req, res) => {
  console.log(" the user upload funcation in running ")
  const username = req.user.username;


  console.log("THIS IS USERNAME IN USERUPLOAD FUNCTION", username);
  try {
    const { heading, content, category, eyecatch } = req.body;
    const image = req.file.filename;
    const username = req.user.username;
    const userid = req.user.userid;
    const date = Date.now()
    console.log("THIS IS USERNAME IN USERUPLOAD FUNCTION", username)
    console.log(" the try is running");
    if (!heading || !content || !image || !eyecatch || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newblogcontent = new blogcontent({
      image,
      heading,
      content,
      category,
      username,
      userid: String(userid),
      date,
      eyecatch,
    });
    await newblogcontent.save();


    res.status(200).json({ message: "Data uploaded successfully", data: { heading, content, image, category } });
  } catch (error) {
    console.error("Error during upload:", error);
    res.status(500).json({ error: "Internal server error" });
    console.log("there is an error")
  }
};





const category = async (req, res) => {
  const { category } = req.body; // Extract category from request body

  try {
    // Create a new Category instance
    const newCategory = new blogcategory({ category });

    // Save to the database
    await newCategory.save();

    // Send a success response
    res.status(201).json({ message: 'Category added successfully!', newCategory });
  } catch (err) {
    // Handle errors and send an error response
  
    res.status(500).json({ message: 'Failed to add category', error: err.message });
  }
};



const showcategories = async (req, res) => {
  try {
    const categories = await blogcategory.find();
    return sendList(res, categories, "No categories found");
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories", error: err.message });
  }
};


const showuser = async (req, res) => {
  try {
    const show = await User.find();
    return sendList(res, show, "No users found");
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};


const homecat = async (req, res) => {
  try {
    const cat = await blogcategory.find();
    return sendList(res, cat, "No categories found");
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error: error.message });
  }
};


const deletecat = async (req, res) => {
  const { cat } = req.body


  try {

    const del = cat;
    console.log("this is a del", del);
    const result = await blogcategory.deleteOne({ category: del });
    if (result.deletedCount === 0) {
      return notFound(res, "Category not found");
    }
    res.status(200).json({ message: "category delete succesfully" });
  } catch (error) {
    res.status(500).json({ message: " fail to delete category" });
  }
};

const showblog = async (req, res) => {
  try {
    const blog = await blogcontent.find({});
    return sendList(res, blog, "No blogs found");
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs", error: err.message });
  }
};
const like = async (req, res) => {
  const userid = req.user.userid
  // console.log("userid", userid)
  const blogid = req.body.id
  // console.log("id", blogid)

  try {
    const blog = await blogcontent.findById(blogid);
    if (!blog) {
      return notFound(res, "Blog not found");
    }

    if (blog.liked.includes(userid)) {
      console.log("its already like", blog)
      blog.liked = blog.liked.filter((id) => id !==userid )
      await blog.save();
      return res.status(200).json({ message: "Like removed successfully", blog }) 
    }
    else {


      blog.liked.push(userid);
      // blog.liked = blog.liked.flat();
      await blog.save(); // Save changes to the database
      return res.status(200).json({ message: "Liked successfully", blog });
    }

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });

  }}


const specificblog = async (req, res) => {
  const id = req.params.id;

  try {
    const rows = await blogcontent.find({ _id: id });
    if (!rows.length) {
      return notFound(res, "Blog not found");
    }
    return res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog", error: error.message });
  }
};

//  const wishlist = async(req , res)=>{
  
//   const{id} = req.body
   
//   const username = req.user.username

// try {
    
// const data =await wish({
//      id :id,
//      username :username
// })

//  const wishdata = await  wish.find({id})
//   if(wishdata){
//     console.log("the code till here");     

//     return res.status(409).json({message : "this is already in your card list"}) 

    
//   }
//   else{

//     const data =await wish({
//       id :id,
//       username :username
//  })

// await data.save()
//  console.log("the wish data is save ")
// res.status(200).json({msg:"data has been save succesfully"}) }

// } catch (error) {

//   console.log("the wish data is not  save there is an error" , error);
//   res.status(500).json({msg : "there is some error in  insert data in wishlist "});
// }
// }

const wishlist = async (req, res) => {
  const { id } = req.body;
  const username = req.user.username;

  try {
 
    const existingWish = await wish.findOne({ id, username }); 

    if (existingWish) {
      console.log("The item is already in the wishlist");
      return res.status(409).json({ message: "This item is already in your wishlist" });
    }

    // Create a new wishlist entry
    const newWish = new wish({ id, username });
    await newWish.save();

    console.log("The wish data has been saved");
    res.status(200).json({ message: "Data has been saved successfully" });
  } catch (error) {
    console.error("Error saving wish data:", error);
    res.status(500).json({ message: "There was an error adding the item to the wishlist" });
  }
};




const wishpage = async (req, res) => {
  const user = req.user.username;
  try {
    const wishes = await wish.find({ username: user });
    if (!wishes.length) {
      return sendList(res, [], "Your wishlist is empty");
    }

    const wishIds = wishes.map((w) => w.id);
    console.log("This is the wishlist IDs:", wishIds);

    const blogs = await blogcontent.find({ _id: { $in: wishIds } });
    return sendList(
      res,
      blogs,
      "Saved wishlist items could not be loaded (blogs may have been removed)"
    );
  } catch (error) {
    console.error("Error fetching wishlist and blog content:", error);
    res.status(500).json({ message: "Server error occurred while fetching wishlist and blog content." });
  }
};


const deletecard = async (req, res) => {
  const { id } = req.body;
  const username = req.user.username;
  const idStr = id != null ? String(id) : "";
  console.log("this is is in deletecard", idStr, username);
  try {
    if (!idStr) {
      return res.status(400).json({ message: "Blog id is required" });
    }

    // Wishlist stores `id` as [String]; match the blog _id string (not id: [id], which broke the query)
    const wishcard = await wish.findOneAndDelete({
      username,
      id: idStr,
    });

    if (!wishcard) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    return res.status(200).json({ message: "the card delete sucessfully" });
  } catch (error) {
    console.log("this is a delete error ", error);
    return res
      .status(500)
      .json({ message: "there is a an err card not delete", error: String(error) });
  }
};


const account = async (req, res) => {
  const user = req.user.username;

  try {
    const account = await blogcontent.find({ username: user });
    if (!account.length) {
      return res.status(200).json({
        success: false,
        message: "No posts found for this account",
        account: [],
        user,
      });
    }

    res.status(200).json({
      success: true,
      message: "data send to account properly",
      account,
      user,
    });
  } catch (error) {
    console.log("there is a error in account api", error);
    res.status(500).json({ message: "Failed to load account", error: error.message });
  }
};
   




const profilepic = async (req, res) => {
  const data = req.file?.filename;
  const username = req.user?.username;
   console.log("the code is enter here")
  try {
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    if (data) {
      // Update the user's profile picture
      const updatedUser = await User.findOneAndUpdate(
        { username: username },
        { $set: { photo: data } },
        { new: true } // Return the updated document
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("Profile picture updated:", data);
      return res.status(200).json(updatedUser);
    } else {
      // If no file is provided, fetch the user's current data
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    }
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({ message: "Failed to update profile picture" });
  }
};




const card = async (req, res) => {
  const { id } = req.body;

  try {
    const deleted = await blogcontent.findByIdAndDelete(id);
    if (!deleted) {
      return notFound(res, "Blog not found");
    }
    return res.status(200).json({ message: "card is delete" });
  } catch (error) {
    return res.status(500).json({ message: "there is a err in delete funcation" });
  }
};




const deleteuser =  async(req,res)=>{
  const {username} = req.body   
 try {
   
if(!username){
   console.log("the name is not receive")
}

console.log("this is a name in delete user" , username)
  const userinfo = await User.deleteOne({username : username})
  if (userinfo.deletedCount === 0) {
    return notFound(res, "User not found");
  }
  res.json({message:"user deleted" , userinfo})
 

 } catch (error) {
  res.status(409).json({message : "the user is not delte there is an error"});
  }
 }




 const blockuser = async (req, res) => {
  const { username } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username: username });

    // If user not found, return an error message
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the user is already blocked
    if (user.status === 'block') {
      // If blocked, unblock the user
      await User.updateOne(
        { username: username },
     {  $set : { status: 'active' }}
      );
      res.json({ message: 'User unblocked successfully.' });
      console.log('User is unblocked successfully.');
    } else {
      // If not blocked, block the user
      await User.updateOne(
        { username: username },
       {$set :{ status: 'block' }}
      );
      res.json({ message: 'User blocked successfully.' });
      console.log('User is blocked successfully.');
    }
  } catch (error) {
    console.log('Error in block/unblock user function:', error);
    res.status(500).json({ message: 'Error in block/unblock user', error });
  }
};



const transporter = require("../config/nodemailerConfig");

const sendEmail = (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  const mailOptions = {
     from: {email},
    to: "samitdhiman0001@gmail.com",
    subject: "Contact Form Submission",
    text: ` Dear BlogSite,\n\n
    My name is ${firstName} ${lastName}.My email address is ${email}.\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Error sending email");
    }
    return res.status(200).send("Email sent successfully!");
  });
};



module.exports = { userSignup, login, userupload, category, showcategories, showuser, homecat, deletecat,
   showblog, like,specificblog ,wishlist , wishpage , deletecard ,  account , profilepic, card , deleteuser , blockuser , sendEmail };

