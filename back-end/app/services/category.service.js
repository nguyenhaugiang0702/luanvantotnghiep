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
  const categoryID = {
    _id: ObjectId.isValid(categoryId) ? new ObjectId(categoryId) : null,
  };
  return await Category.findByIdAndUpdate(categoryID, categoryData, {
    new: true,
  });
};

const deleteCategory = async (categoryId) => {
  const categoryID = {
    _id: ObjectId.isValid(categoryId) ? new ObjectId(categoryId) : null,
  };
  return await Category.findByIdAndDelete(categoryID);
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
