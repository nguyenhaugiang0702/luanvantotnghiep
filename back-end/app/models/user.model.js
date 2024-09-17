const mongoose = require("mongoose");
const moment = require("moment-timezone");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Number,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  typeLogin: {
    type: String,
    required: false,
  },
  accessToken: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
  role:{
    type: String
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
