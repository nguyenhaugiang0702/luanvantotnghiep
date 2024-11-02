const mongoose = require("mongoose");
const moment = require("moment-timezone");

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: false,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
  roleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
