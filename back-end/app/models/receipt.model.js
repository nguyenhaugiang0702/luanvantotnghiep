const mongoose = require("mongoose");
const moment = require("moment-timezone");

const receiptSchema = new mongoose.Schema({
  supplierID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  detail: {
    quantity: {
      type: Number,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
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

const Receipt = mongoose.model("Receipt", receiptSchema);
module.exports = Receipt;
