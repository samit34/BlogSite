const user = require('../model/userschema');

const blockMiddleware = async (req, res, next) => {
  const { username } = req.body;


  console.log("this is a name in  blockmiddleware" , username)

  try {
   
    const userInfo = await user.findOne({ username: username });

   
    if (!userInfo) {
      return res.status(404).json({ message: 'User not found.' });
    }

   
    if (userInfo.status === 'block') {
      return res.status(403).json({ message: 'Your account is blocked. Please contact support.' });
    }

    next();
  } catch (err) {
    
    return res.status(500).json({ message: 'An error occurred.', error: err.message });
  }
};

module.exports = { blockMiddleware};

  
