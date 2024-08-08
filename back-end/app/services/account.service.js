const Account = require("../models/account.model");

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
    const account = Account.findOne(userData)
    return await account;
  } catch (error) {
    throw new Error("Error while finding one user: " + error.message);
  }
};

const activeAccount = async (userData) => {
  try {
    const account = await Account.findOne(userData);
    
    if(account && !account.isActive){
      account.isActive = true;
      account.save();
    }
  } catch (error) {
    throw new Error("Error while activing account user: " + error.message);
  }
};

module.exports = { createAccount, findOne, activeAccount };
