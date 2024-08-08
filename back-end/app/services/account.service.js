const { isValidObjectId } = require("mongoose");
const Account = require("../models/account.model");
const User = require("../models/user.model");
const { ObjectId } = require("mongodb");

const createAccount = async (userData) => {
  try {
    const account = new Account(userData);
    return await account.save();
  } catch (error) {
    throw new Error("Error while creating user: " + error.message);
  }
};

const findOne = async () => {
  try {
    const account = Account.findOne(userData);
    return await account;
  } catch (error) {
    throw new Error("Error while finding one user: " + error.message);
  }
};

const deleteAccount = async (accID) => {
  try {
    const accountID = {
      _id: isValidObjectId(accID) ? new ObjectId(accID) : null,
    };
    const account = await Account.findById(accountID);
    await User.findByIdAndDelete(account.userID);
    await Account.findByIdAndDelete(accountID);
  } catch (error) {
    throw new Error("Error while finding one user: " + error.message);
  }
};

const activeAccount = async (userData) => {
  try {
    const account = await Account.findOne(userData);

    if (account && !account.isActive) {
      account.isActive = true;
      account.save();
    }
    return account;
  } catch (error) {
    throw new Error("Error while activing account user: " + error.message);
  }
};

const blockAccount = async (accID) => {
  try {
    const accountID = {
      _id: isValidObjectId(accID) ? new ObjectId(accID) : null,
    };

    const account = await Account.findByIdAndUpdate(
      accountID,
      { isActive: false },
      { new: true }
    );
    return account;
  } catch (error) {
    throw new Error("Error while activing account user: " + error.message);
  }
};

module.exports = {
  createAccount,
  findOne,
  activeAccount,
  deleteAccount,
  blockAccount,
};
