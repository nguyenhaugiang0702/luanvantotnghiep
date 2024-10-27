const Publisher = require("../models/publisher.model");
const { ObjectId } = require("mongodb");

const createPublisher = async (publisherData) => {
  const newPublisher = new Publisher(publisherData);
  return newPublisher.save();
};

const getPublisherById = async (publisherId) => {
  return await Publisher.findById(publisherId);
};

const getAllPublishers = async () => {
  return await Publisher.find({}).sort({ createdAt: -1 });
};

const updatePublisher = async (publisherId, data) => {
  if (ObjectId.isValid(publisherId)) {
    return await Publisher.findByIdAndUpdate(publisherId, data, { new: true });
  }
};

const deletePublisher = async (publisherId) => {
  if (ObjectId.isValid(publisherId)) {
    return await Publisher.findByIdAndDelete(publisherId);
  }
};

const checkNameExist = async (name) => {
  return await Publisher.findOne({ name: name });
};

const checkPhoneNumberExist = async (phoneNumber) => {
  return await Publisher.findOne({ phoneNumber: phoneNumber });
};

const checkEmailExist = async (email) => {
  return await Publisher.findOne({ email: email });
};

module.exports = {
  createPublisher,
  getPublisherById,
  getAllPublishers,
  updatePublisher,
  deletePublisher,
  checkNameExist,
  checkPhoneNumberExist,
  checkEmailExist,
};
