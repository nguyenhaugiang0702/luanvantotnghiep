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
  if (ObjectId.isValid(bookId)) {
    return await Book.findByIdAndUpdate(bookId, bookData, { new: true });
  }
};

const deleteBook = async (bookId) => {
  if (ObjectId.isValid(bookId)) {
    return await Book.findByIdAndDelete(bookId);
  }
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

const buildFilterQuery = (filters) => {
  const query = {};

  // Lọc theo các trường
  if (filters.price && filters.price.length > 0) {
    query.priceRangeID = { $in: filters.price };
  }
  if (filters.category && filters.category.length > 0) {
    query.categoryID = { $in: filters.category };
  }
  if (filters.publisher && filters.publisher.length > 0) {
    query.publisherID = { $in: filters.publisher };
  }
  if (filters.supplier && filters.supplier.length > 0) {
    query.supplierID = { $in: filters.supplier };
  }
  if (filters.formality && filters.formality.length > 0) {
    query.formalityID = { $in: filters.formality };
  }
  if (filters.author && filters.author.length > 0) {
    query.authorID = { $in: filters.author };
  }

  return query;
};

const getFilteredBooks = async (filters, skip, limit) => {
  const query = buildFilterQuery(filters);
  const books = await Book.find(query).skip(skip).limit(limit);
  return books;
};

const getTotalBooks = async (filters) => {
  const query = buildFilterQuery(filters);
  const totalBooks = await Book.countDocuments(query);
  return totalBooks;
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
  getFilteredBooks,
  getTotalBooks,
  buildFilterQuery,
};
