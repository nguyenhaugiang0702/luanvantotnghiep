const mongoose = require("mongoose");
const publisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  createdAt: Date,
  updatedAt: Date,
});

const Publisher = mongoose.model("Publisher", publisherSchema);
module.exports = Publisher;
