const Category = require("../models/category.model");
const { ObjectId } = require("mongodb");
const bookService = require("./book.service");

const createCategory = async (categoryData) => {
  const newCategory = new Category(categoryData);
  return await newCategory.save();
};

const getAllCategory = async () => {
  return await Category.find({}).sort({ createdAt: -1 });
};

const updateCategory = async (categoryId, categoryData) => {
  if (ObjectId.isValid(categoryId)) {
    return await Category.findByIdAndUpdate(categoryId, categoryData, {
      new: true,
    });
  }
};

const deleteCategory = async (categoryId) => {
  if (ObjectId.isValid(categoryId)) {
    return await Category.findByIdAndDelete(categoryId);
  }
};

const checkNameExist = async (name) => {
  return await Category.findOne({ name: name });
};

const countCategories = async () => {
  return await Category.countDocuments();
};

const countBooksByCategory = async () => {
  // Lấy tất cả các thể loại
  const categories = await Category.find().select('name');
  
  // Khởi tạo mảng chứa tên thể loại và số lượng sách
  const categoryNames = [];
  const bookTotals = [];

  // Đếm số lượng sách cho từng thể loại
  await Promise.all(
    categories.map(async (category) => {
      const totalBooks = await bookService.countBooks({ categoryID: category._id }); // Đếm sách theo thể loại
      categoryNames.push(category.name);        // Thêm tên thể loại vào mảng categoryNames
      bookTotals.push(totalBooks);              // Thêm số lượng sách vào mảng bookTotals
    })
  );

  // Trả về 2 mảng
  return {
    categoryNames,  // Mảng chứa tên thể loại
    bookTotals      // Mảng chứa số lượng sách tương ứng
  };
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  checkNameExist,
  getAllCategory,
  countCategories,
  countBooksByCategory
};
