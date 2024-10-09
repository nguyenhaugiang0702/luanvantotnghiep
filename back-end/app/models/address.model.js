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
    name: String,
    code: Number,
  },
  district: {
    name: String,
    code: Number,
  },
  ward: {
    name: String,
    code: Number,
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
