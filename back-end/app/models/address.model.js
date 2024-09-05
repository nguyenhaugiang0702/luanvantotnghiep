const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: String,
  province: {
    type: String,
  },
  district: {
    type: String,
  },
  ward: {
    type: String,
  },
  detailAddress: {
    type: String,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },  
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
