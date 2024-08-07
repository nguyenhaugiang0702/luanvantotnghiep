const mongoose = require("mongoose");
const moment = require("moment-timezone");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    default: () =>
      moment().tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY"),
  },
  updatedAt: {
    type: String,
    default: () =>
      moment().tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY"),
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
