const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const MONGO_URI = (process.env.MONGO_URI || "").trim();
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing or empty in .env");
  }
  /** If your URI has no database path (…mongodb.net/…), Mongoose uses "test". Set MONGO_DB_NAME to match the DB name you use in Atlas. */
  const dbName = (process.env.MONGO_DB_NAME || "").trim();
  const opts = dbName ? { dbName } : {};
  await mongoose.connect(MONGO_URI, opts);
  console.log("the data base is connected");
  console.log(`MongoDB database in use: "${mongoose.connection.name}"`);
};

module.exports = { connectDB };