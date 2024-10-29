const jwt = require("jsonwebtoken");
const config = require("../config/index");

const createAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, config.jwt.user.secretKey, {
    expiresIn: "30m",
  });
};

const createRefreshToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, config.jwt.user.secretKey, {
    expiresIn: "1y",
  });
};

const createAdminAccessToken = (adminId, role) => {
  return jwt.sign({ id: adminId, role: role }, config.jwt.admin.secretKey, {
    expiresIn: "30m",
  });
};

const createAdminRefreshToken = (adminId, role) => {
  return jwt.sign({ id: adminId, role: role }, config.jwt.admin.secretKey, {
    expiresIn: "1y",
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  createAdminAccessToken,
  createAdminRefreshToken,
};
