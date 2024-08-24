const Book = require("../models/book.model");

const createBook = async (bookData) => {
  const newBook = new Book(bookData);
  return await newBook.save();
};

const getAllBooks = async () => {
  return await Book.find({});
};

const getBookByID = async (bookId) => {
  const bookID = {
    _id: ObjectId.isValid(bookId) ? new ObjectId(bookId) : null,
  };
  return await Book.findById(bookID);
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
