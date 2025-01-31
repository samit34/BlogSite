// backend/config/nodemailerConfig.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "samitdhiman0001@gmail.com", 
    pass: "gkoo wjkb sydi vzbq", 
  },
});

module.exports = transporter;
