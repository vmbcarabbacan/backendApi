const mongoose = require("mongoose");

const connectDB = async () => {
  const { DATABASE_URI } = process.env;
  return await mongoose.connect(DATABASE_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
