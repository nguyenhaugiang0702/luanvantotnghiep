const Publisher = require("../models/publisher.model");
const { ObjectId } = require("mongodb");

const createPublisher = async (publisherData) => {
  const newPublisher = new Publisher(publisherData);
  return newPublisher.save();
};

const getPublisherById = async (publisherId) => {
  const publisherID = {
    _id: ObjectId.isValid(publisherId) ? new ObjectId(publisherId) : null,
  };
  return await Publisher.findById(publisherID);
};

const getAllPublishers = async () => {
  return await Publisher.find({});
};

const updatePublisher = async (publisherId, data) => {
  const publisherID = {
    _id: ObjectId.isValid(publisherId) ? new ObjectId(publisherId) : null,
  };
  return await Publisher.findByIdAndUpdate(publisherID, data, { new: true });
};

const deletePublisher = async (publisherId) => {
  const publisherID = {
    _id: ObjectId.isValid(publisherId) ? new ObjectId(publisherId) : null,
  };
  return await Publisher.findByIdAndDelete(publisherID);
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
