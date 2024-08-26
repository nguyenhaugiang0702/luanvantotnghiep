const Book = require("../models/book.model");
const { ObjectId } = require("mongodb");

const createBook = async (bookData) => {
  const newBook = new Book(bookData);
  return await newBook.save();
};

const getAllBooks = async () => {
  return await Book.find({})
    .populate("authorID")
    .populate("publisherID")
    .populate("categoryID")
    .populate("formalityID");
};

const getBookByID = async (bookId) => {
  const bookID = {
    _id: ObjectId.isValid(bookId) ? new ObjectId(bookId) : null,
  };
  return await Book.findById(bookID)
    .populate("authorID")
    .populate("publisherID")
    .populate("categoryID")
    .populate("formalityID");
};

const updateBook = async (bookId, bookData) => {
  const bookID = {
    _id: ObjectId.isValid(bookId) ? new ObjectId(bookId) : null,
  };
  return await Book.findByIdAndUpdate(bookID, bookData, { new: true });
};

const deleteBook = async (bookId) => {
  const bookID = {
    _id: ObjectId.isValid(bookId) ? new ObjectId(bookId) : null,
  };
  return await Book.findByIdAndDelete(bookID);
};

const checkNameExist = async (name) => {
  return await Book.findOne({ name: name });
};

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  checkNameExist,
  getAllBooks,
  getBookByID,
};
