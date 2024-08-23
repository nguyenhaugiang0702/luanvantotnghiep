const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  createAt: Date,
  updatedAt: Date,
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
