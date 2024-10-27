const jwt = require("jsonwebtoken");
const config = require("../config/index");

const createAccessToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.user.secretKey, {
    expiresIn: "30m",
  });
};

const createRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.user.secretKey, {
    expiresIn: "1y",
  });
};

const createAdminAccessToken = (adminId) => {
  return jwt.sign({ id: adminId }, config.jwt.admin.secretKey, {
    expiresIn: "30m",
  });
};

const createAdminRefreshToken = (adminId) => {
  return jwt.sign({ id: adminId }, config.jwt.admin.secretKey, {
    expiresIn: "1y",
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  createAdminAccessToken,
  createAdminRefreshToken,
};
