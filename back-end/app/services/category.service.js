const Category = require("../models/category.model");
const { ObjectId } = require("mongodb");

const createCategory = async (categoryData) => {
  const newCategory = new Category(categoryData);
  return await newCategory.save();
};

const getAllCategory = async () => {
  return await Category.find({});
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

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  checkNameExist,
  getAllCategory,
};
