const mongoose = require("mongoose");
const moment = require("moment-timezone");

const receiptSchema = new mongoose.Schema({
  supplierID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
  },
  bookID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  detail: {
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
    },
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

const Receipt = mongoose.model("Receipt", receiptSchema);
module.exports = Receipt;
