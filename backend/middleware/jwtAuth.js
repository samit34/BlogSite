const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// to generate token while signup or login
const generateToken = (payload)=>{
    return jwt.sign(payload, JWT_SECRET, {expiresIn: '1d'} );
}

const verifyToken = (req,res, next)=>{

    const authorization = req.headers.authorization; 
    //  const checking = req.headers
//   console.log(checking);
   
    if(!authorization) return res.status(401).json({err:"Token not found"});

    const token = authorization.split(' ')[1];

    if(!token) return res.status(401).json({err:"Unauthorized"});
    try{

        const decode = jwt.verify(token, JWT_SECRET);
    
        req.user = decode;

        
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({err:"Invalid token"});
    }


}

module.exports = { generateToken, verifyToken }