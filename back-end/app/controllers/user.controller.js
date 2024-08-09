const userService = require("../services/user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const sendEmail = require("../utils/email.util");
const moment = require("moment");
const ApiError = require("../api-error");
const User = require("../models/user.model");
const ValidateService = require("../utils/validate.util");

exports.create = async (req, res, next) => {
  try {
    const validateService = new ValidateService();
    const errors = await validateService.validateUser(req.body);
    if (errors.length > 0) {
      return next(new ApiError(400, errors))
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    req.body.createdAt = moment().format("HH:mm:ss DD/MM/YYYY");
    req.body.updatedAt = moment().format("HH:mm:ss DD/MM/YYYY");
    const newUser = await userService.createUser(req.body);
    const accessTokenWithEmail = jwt.sign(
      { email: newUser.email, _id: newUser._id },
      "my_secret_key_with_email_to_active"
    );

    const activeAccountUrl = `${config.app.appUrl}/api/v1/users/activeAccount/${accessTokenWithEmail}`;
    const message = `
        <p>Please click on the link below to activate your account</p>
        <a href="${activeAccountUrl}" target="_blank">Click Here</a>
    `;
    await sendEmail({
      email: newUser.email,
      subject: "Activate the account",
      html: message,
    });
    res.send({
      message: "Register Successfully!",
      newUser,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error when registering account"));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return next(new ApiError(404, "Account does not exist."));
    }

    if (user.isActive <= 0) {
      return next(new ApiError(404, "Account has not been activated."));
    }

    if (user.isActive >= 2) {
      return next(new ApiError(404, "Account has been locked"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ApiError(400, "Incorrect password."));
    }

    const accessToken = jwt.sign({ _id: user._id }, "your_jwt_secret_key", {
      expiresIn: "6h",
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
  const userID = req.user._id;
  const userEmail = req.user.email;
  try {
    const userEmailExist = await userService.activeUserAccount({
      _id: userID,
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
    await userService.blockUserAccount(req.params.userID);
    res.send({
      message: "Account has been locked!",
    });
  } catch (error) {
    return next(new ApiError(500, "Error while blocking account"));
  }
};

exports.unBlockAccount = async (req, res, next) => {
  try {
    await userService.unBlockUserAccount(req.params.userID);
    res.send({
      message: "Account has been unlocked!",
    });
  } catch (error) {
    return next(new ApiError(500, "Error while blocking account"));
  }
};

exports.findALL = async (req, res) => {
  let usersData = [];
  try {
    usersData = await userService.getAllUser();
    return res.send(usersData);
  } catch (error) {
    return next(new ApiError(500, "Error when get all users"));
  }
};

exports.findOne = async (req, res) => {
  res.send({ message: "handle findOne" });
};

exports.update = async (req, res) => {
  res.send({ message: "handle update" });
};

exports.delete = async (req, res, next) => {
  const userID = req.params.userID;
  try {
    await userService.deleteUserAccount(userID);
    res.send({ message: "Deleted Successfully!" });
  } catch (error) {
    return next(
      new ApiError(500, `Error while deleting a account with ID = ${accountID}`)
    );
  }
};

exports.deleteALL = async (req, res) => {
  res.send({ message: "handle deleteALL" });
};
