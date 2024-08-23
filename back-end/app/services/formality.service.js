const Formality = require("../models/formality.model");
const { ObjectId } = require("mongodb");

const createFormality = async (formalityData) => {
  const newFormality = new Formality(formalityData);
  return await newFormality.save();
};

const getAllFormality = async () => {
  return await Formality.find({});
};

const updateFormality = async (formalityId, formalityData) => {
  const formalityID = {
    _id: ObjectId.isValid(formalityId) ? new ObjectId(formalityId) : null,
  };
  return await Formality.findByIdAndUpdate(formalityID, formalityData, {
    new: true,
  });
};

const deleteFormality = async (formalityId) => {
  const formalityID = {
    _id: ObjectId.isValid(formalityId) ? new ObjectId(formalityId) : null,
  };
  return await Formality.findByIdAndDelete(formalityID);
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
