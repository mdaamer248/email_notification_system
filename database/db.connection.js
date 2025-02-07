const mongoose = require("mongoose");
require("dotenv").config();

const db = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

    console.log(`MongoDB Connected.`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

db();

module.exports = db;
