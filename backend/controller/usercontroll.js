const { generateToken } = require('../middleware/jwtAuth');
const User = require('../model/userschema');
const bcrypt = require("bcrypt");

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

    const newblogcontent = blogcontent({
      image,
      heading,
      content,
      category,
      username,
      userid,
      date,
      eyecatch
    })
    newblogcontent.save();


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
  const decode = req.decode
  // console.log(decode);

  try {
    const categories = await blogcategory.find();
    res.status(200).json(categories);

    // console.log("the showcategories funcation is running");
  } catch (err) {
    
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
  }

}


const showuser = async (req, res) => {
  try {
    const show = await User.find()



    res.status(200).json(show);



  } catch (error) {

  }
}


const homecat = async (req, res) => {
  try {
    const cat = await blogcategory.find()

    res.status(200).json(cat);
  } catch (error) {
 
    // res.status(500).json(error);
  }
}


const deletecat = async (req, res) => {
  const { cat } = req.body


  try {

    const del = cat
    console.log("this is a del", del)
    await blogcategory.deleteOne({ category: del });

    res.status(200).json({ message: "category delete succesfully" });

  } catch (error) {
    res.status(500).json({ message: " fail to delete category" });
  }
}

const showblog = async (req, res) => {

  try {
    const blog = await blogcontent.find({});
    // console.log(blog)
    res.status(200).json(blog)


  } catch (err) {

    //  res.status(500).json({err : "fail to send data"})
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message });

  }

}
const like = async (req, res) => {
  const userid = req.user.userid
  // console.log("userid", userid)
  const blogid = req.body.id
  // console.log("id", blogid)

  try {
    const blog = await blogcontent.findById(blogid)

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


const specificblog = async(req , res)=>{
   
  const id = req.params.id
// console.log("this is a id",id)

    try {
      const specificblog = await blogcontent.find({_id:id})
        
      // console.log("this is a specific blog" , specificblog)
       await res.status(200).json(specificblog)
    } catch (error) {
      //  console.log("specificblog err" ,  error)
       res.status(500).json({message: "this is err" , error})

    }
}

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
  const  user =  await  req.user.username;
    // console.log("this is a user " , user)
    try {
      
      const wishes = await wish.find({ username: user });
    
      const wishIds = wishes.map(wish => wish.id); 
      console.log("This is the wishlist IDs:", wishIds);
  
      
      const blogs = await blogcontent.find({ _id: { $in: wishIds } });
      

    
      // Return the blog content as the response
      res.status(200).json(blogs);
  
    } catch (error) {
      console.error("Error fetching wishlist and blog content:", error);
      res.status(500).json({ message: "Server error occurred while fetching wishlist and blog content." });
    }
};


const deletecard = async(req ,res)=>{

  const {id}  = req.body 
   const username = req.user.username
  console.log("this is is in deletecard" ,id , username)
    try { 
      const wishcard = await wish.findOneAndDelete(
        { username: username, id:  [id]  }, 
        
        { new: true } 
      );

       await res.status(200).json({message: "the card delete sucessfully" })
    } catch (error) {
      res.status(500).json({message: "there is a an err card not delete" ,error})
      console.log("this is a delete error " , error)

    }
    
}


const account = async (req,res)=>{
  const user = req.user.username 
  
  try {
   const  account = await blogcontent.find({ username : user});      
      

    res.status(200).json({ message :"data send to account properly" , account , user})
      

  } catch (error) {
    
    console.log("there is a error in account api" , error)

  }
 


}
   




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




const card = async (req,res)=>{
    const {id} = req.body
    
    try {
   
      await blogcontent.findByIdAndDelete({ _id: id });

       
      await   res.status(200).json({message : "card is delete"})
       

    } catch (error) {
     await   res.status(500).json({message: "there is a err in delete funcation"})
    }

}



const deleteuser =  async(req,res)=>{
  const {username} = req.body   
 try {
   
if(!username){
   console.log("the name is not receive")
}

console.log("this is a name in delete user" , username)
  const userinfo = await User.deleteOne({username : username})

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

