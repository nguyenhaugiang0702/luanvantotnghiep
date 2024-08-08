const userService = require("../services/user.service");
const accountService = require("../services/account.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const sendEmail = require("../utils/email.util");
const ApiError = require("../api-error");

exports.create = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newAccount = {
      userID: newUser._id,
      email: req.body.email,
      password: hashedPassword,
      isActive: false,
    };
    await accountService.createAccount(newAccount);
    const accessTokenWithEmail = jwt.sign(
      { email: newAccount.email, _id: newAccount.userID },
      "my_secret_key_with_email_to_active",
    );
    const activeAccountUrl = `${config.app.appUrl}/api/v1/accounts/activeAccount/${accessTokenWithEmail}`;
    const message = `
        <p>Please click on the link below to activate your account</p>
        <a href="${activeAccountUrl}" target="_blank">Click Here</a>
    `;
    await sendEmail({
      email: newAccount.email,
      subject: "Activate the account",
      html: message,
    });
    res.status(201).json({
      user: newUser,
      account: newAccount,
    });
  } catch (error) {
    return next(new ApiError(500, "Error when registering account"));
  }
};

exports.findALL = async (req, res) => {
  res.send({ message: "handle findALL" });
};

exports.findOne = async (req, res) => {
  res.send({ message: "handle findOne" });
};

exports.update = async (req, res) => {
  res.send({ message: "handle update" });
};

exports.delete = async (req, res) => {
  res.send({ message: "handle delete" });
};

exports.deleteALL = async (req, res) => {
  res.send({ message: "handle deleteALL" });
};
