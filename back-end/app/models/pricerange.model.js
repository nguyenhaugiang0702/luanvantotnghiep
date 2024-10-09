const mongoose = require("mongoose");
const priceRangeSchema = new mongoose.Schema({
  name: String,
  startPrice: Number,
  endPrice: Number,
  createdAt: Date,
  updatedAt: Date,
});

const PriceRange = mongoose.model("PriceRange", priceRangeSchema);
module.exports = PriceRange;
