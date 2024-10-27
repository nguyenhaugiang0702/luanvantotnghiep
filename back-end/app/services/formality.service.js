const Formality = require("../models/formality.model");
const { ObjectId } = require("mongodb");

const createFormality = async (formalityData) => {
  const newFormality = new Formality(formalityData);
  return await newFormality.save();
};

const getAllFormality = async () => {
  return await Formality.find({}).sort({ createdAt: -1 });
};

const updateFormality = async (formalityId, formalityData) => {
  if (ObjectId.isValid(formalityId)) {
    return await Formality.findByIdAndUpdate(formalityId, formalityData, {
      new: true,
    });
  }
};

const deleteFormality = async (formalityId) => {
  if (ObjectId.isValid(formalityId)) {
    return await Formality.findByIdAndDelete(formalityId);
  }
};

const checkNameExist = async (name) => {
  return await Formality.findOne({ name: name });
};

module.exports = {
  createFormality,
  updateFormality,
  deleteFormality,
  checkNameExist,
  getAllFormality,
};
