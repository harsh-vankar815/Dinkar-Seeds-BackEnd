const mongoose = require("mongoose");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/dinkarSeedsDB";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("mongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
