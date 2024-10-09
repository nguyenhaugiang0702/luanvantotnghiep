const Author = require("../models/author.model");
const { ObjectId } = require("mongodb");

const createAuthor = async (authorData) => {
  const newAuthor = new Author(authorData);
  return await newAuthor.save();
};

const getAllAuthors = async () => {
  return await Author.find({});
};

const updateAuthor = async (authorId, authorData) => {
  return await Author.findByIdAndUpdate(authorId, authorData, {
    new: true,
  });
};

const deleteAuthor = async (authorId) => {
  const authorID = {
    _id: ObjectId.isValid(authorId) ? new ObjectId(authorId) : null,
  };
  return await Author.findByIdAndDelete(authorID);
};

const checkNameExist = async (name) => {
  return await Author.findOne({ name: name });
};

module.exports = {
  createAuthor,
  updateAuthor,
  deleteAuthor,
  checkNameExist,
  getAllAuthors,
};
