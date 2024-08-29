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

const getBookImagesByID = async (bookId) => {
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

const deleteImage = async (bookId, index) => {
  const bookID = {
    _id: ObjectId.isValid(bookId) ? new ObjectId(bookId) : null,
  };
  return await Book.findByIdAndDelete(bookID);
};

const checkNameExist = async (name) => {
  return await Book.findOne({ name: name });
};

const findImageByBookIDAndImageID = async (bookID, imageID) => {
  const book = await Book.findById(bookID);

  const imageIndex = book.images.findIndex((img) =>
    img._id.equals(new ObjectId(imageID))
  );

  return {
    book,
    imageIndex,
    oldImagePath: book.images[imageIndex].path,
  };
};

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  checkNameExist,
  getAllBooks,
  getBookByID,
  getBookImagesByID,
  findImageByBookIDAndImageID,
};
