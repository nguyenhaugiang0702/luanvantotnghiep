const ApiError = require("../api-error");
const accountService = require("../services/account.service");
const Account = require("../models/account.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const account = await Account.findOne({ email });

    if (!account) {
      return next(new ApiError(404, "Account does not exist."));
    }

    if (!account.isActive) {
      return next(new ApiError(404, "Account has not been activated."));
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return next(new ApiError(400, "Incorrect password."));
    }

    const accessToken = jwt.sign({ id: account._id }, "your_jwt_secret_key", {
      expiresIn: "1h",
    });

    res.send({
      message: "Logged in successfully!",
      accessToken,
    });
  } catch (error) {
    return next(new ApiError(500, "Error while logging in"));
  }
};

exports.activeAccount = async (req, res, next) => {
  const userID = new ObjectId(req.user._id);
  const userEmail = req.user.email;
  try {
    const userEmailExist = await accountService.activeAccount({
      userID: userID,
      email: userEmail,
    });
    res.send({
      message: "Account is activated!",
      userEmailExist,
    });
  } catch (error) {
    return next(new ApiError(500, "Error while activing account"));
  }
};

exports.blockAccount = async (req, res, next) => {
  try {
    await accountService.blockAccount(req.params.accountID);
    res.send({
      message: "Account has been locked!",
    });
  } catch (error) {
    return next(new ApiError(500, "Error while blocking account"));
  }
};

exports.findALL = async (req, res, next) => {
  res.send({ message: "handle findALL" });
};

exports.findOne = async (req, res, next) => {
  res.send({ message: "handle findOne" });
};

exports.update = async (req, res, next) => {
  res.send({ message: "handle update" });
};

exports.delete = async (req, res, next) => {
  const accountID = req.params.accountID;
  try {
    await accountService.deleteAccount(accountID);
    res.send({ message: "Deleted Successfully!"});
  } catch (error) {
    return next(
      new ApiError(500, `Error while deleting a account with ID = ${accountID}`)
    );
  }
};

exports.deleteALL = async (req, res, next) => {
  res.send({ message: "handle deleteALL" });
};
