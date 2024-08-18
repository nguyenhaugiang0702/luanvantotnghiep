const mongoose = require("mongoose");
const moment = require("moment-timezone");

const supplierSchema = new mongoose.Schema({
  name:{
    type: String,
    require: false,
  },
  email: {
    type: String,
    required: false,
    unique: false,
  },
  phoneNumber: {
    type: String,
    required: false,
    unique: false,
  },
  address:{
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
});

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
