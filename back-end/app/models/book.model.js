const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: String,
  detail: {
    publisherYear: Number,
    weight: Number,
    pageNumber: Number,
    length: Number,
    width: Number,
    originalPrice: Number,
    discountPrice: Number,
  },
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
  publiserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
  },
  categoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  formalityID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Formality",
  },
  images: Array,
  createAt: Date,
  updatedAt: Date,
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;