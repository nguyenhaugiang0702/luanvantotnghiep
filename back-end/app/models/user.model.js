const mongoose = require("mongoose");
const moment = require("moment-timezone");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  isActive: {
    type: Number,
  },
  gender: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  dob: {
    type: String,
  },
  avatar: {
    type: String,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  role: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
