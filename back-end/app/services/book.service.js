const Book = require("../models/book.model");
const { ObjectId } = require("mongodb");

const createBook = async (bookData) => {
  const newBook = new Book(bookData);
  return await newBook.save();
};

const getFullInfoAllBooks = async () => {
  return await Book.find({})
    .populate("authorID")
    .populate("publisherID")
    .populate("categoryID")
    .populate("formalityID");
};

const getFullInfoBookByID = async (bookId) => {
  return await Book.findById(bookId)
    .populate("authorID")
    .populate("publisherID")
    .populate("categoryID")
    .populate("formalityID");
};

const searchBooks = async (searchValue) => {
  return await Book.find({
    name: { $regex: new RegExp(searchValue, "i") },
  });
};

const getBookByID = async (bookId) => {
  return await Book.findById(bookId);
};

const getBookImagesByID = async (bookId) => {
  return await Book.findById(bookId);
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

const getFilteredBooks = async (filters, skip, limit, sortBy) => {
  const query = buildFilterQuery(filters);
  let books = await Book.find(query).skip(skip).limit(limit);
  books = books.map((book) => {
    const originalPrice = book.detail.originalPrice || 0;
    const discountPrice = book.detail.discountPrice || 0;
    book.finalPrice = originalPrice - discountPrice;
    return book;
  });

  // Sắp xếp theo giá sau giảm giá
  if (sortBy === "asc") {
    books.sort((a, b) => a.finalPrice - b.finalPrice);
  } else if (sortBy === "desc") {
    books.sort((a, b) => b.finalPrice - a.finalPrice);
  }

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
  getFullInfoAllBooks,
  getFullInfoBookByID,
  getBookImagesByID,
  findImageByBookIDAndImageID,
  getFilteredBooks,
  getTotalBooks,
  buildFilterQuery,
  getBookByID,
  searchBooks,
};
