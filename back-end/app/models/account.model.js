const mongoose = require("mongoose");
const moment = require("moment-timezone");

const accountSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
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

const Account = mongoose.model("Account", accountSchema);
module.exports = Account;
