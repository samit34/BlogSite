const multer = require('multer');
const path = require('path')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
   
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
  
    const newName = Date.now() + path.extname(file.originalname) ;
    console.log('newname', newName)
    cb(null, newName);
  }
});


const upload = multer({ storage: storage});


module.exports = {upload};




