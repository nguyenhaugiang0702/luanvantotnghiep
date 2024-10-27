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
    .populate("formalityID")
    .populate("priceRangeID")
    .sort({ createdAt: -1 });
};

const getFullInfoBookByID = async (bookId) => {
  return await Book.findById(bookId)
    .populate("authorID")
    .populate("publisherID")
    .populate("categoryID")
    .populate("formalityID")
    .populate("priceRangeID");
};

const searchBooks = async (searchValue) => {
  return await Book.find({
    name: { $regex: new RegExp(searchValue, "i") },
  });
};

const getBookByID = async (bookId) => {
  return await Book.findById(bookId);
};

const getBookImagesByID = async (bookId, skip = 0, limit = 0) => {
  const book = await Book.findById(bookId);
  if (skip || limit) {
    const images = book.images || []; // Lấy mảng images
    const paginatedImages = images.slice(skip, skip + limit); // Sử dụng slice để phân trang
    return paginatedImages;
  }
  return book;
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

const buildFilterQuery = (filters, searchQuery) => {
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

  // Add search logic
  if (searchQuery) {
    query.$or = [
      { name: { $regex: searchQuery, $options: "i" } }, // Search by name (title)
      { "detail.description": { $regex: searchQuery, $options: "i" } }, // Search in description
      // Here you can include other fields if necessary
    ];
  }

  return query;
};

const getFilteredBooks = async (filters, skip, limit, sortBy, searchQuery) => {
  const query = buildFilterQuery(filters, searchQuery);
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

const getTotalBooks = async (filters, searchQuery) => {
  const query = buildFilterQuery(filters, searchQuery);
  const totalBooks = await Book.countDocuments(query);
  return totalBooks;
};

const getTopViewedBooks = async () => {
  const books = await Book.find().sort({ view: -1 }).limit(4);

  return books;
};

const countBooks = async (query) => {
  return await Book.countDocuments(query);
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
  getTopViewedBooks,
  countBooks,
};
