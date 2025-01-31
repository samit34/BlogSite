const rolecheck = (...allowedrole)=>{
return (req,res,next) =>{
  console.log("checking for  role")
        const allowrole = req.user.role
          if(!allowrole.includes(allowedrole)){
            console.log("this is a role " , allowrole )
            return res.status(401).json({message :"you are unothorized"});
    
          }
          
            next();
          
         }
}

module.exports = {
    rolecheck
}