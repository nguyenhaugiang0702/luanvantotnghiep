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

const getFilteredBooks = async (filters) => {
  const query = {};

  // Lọc sách theo priceRangeID
  if (filters.price && filters.price.length > 0) {
    query.priceRangeID = { $in: filters.price };
  }
  // Lọc sách theo categoryID
  if (filters.category && filters.category.length > 0) {
    query.categoryID = { $in: filters.category };
  }
  // Lọc sách theo publisherID
  if (filters.publisher && filters.publisher.length > 0) {
    query.publisherID = { $in: filters.publisher };
  }

  if (filters.supplier && filters.supplier.length > 0) {
    // Nếu bạn có trường supplierID trong mô hình, bạn có thể thêm vào đây
    // query.supplierID = { $in: filters.supplier };
  }

  // Lọc sách theo formalityID
  if (filters.formality && filters.formality.length > 0) {
    query.formalityID = { $in: filters.formality };
  }

  // Lọc sách theo authorID
  if (filters.author && filters.author.length > 0) {
    query.authorID = { $in: filters.author };
  }

  // Tìm sách theo điều kiện
  const books = await Book.find(query);
  return books;
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
};
