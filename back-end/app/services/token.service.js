const jwt = require("jsonwebtoken");

const createAccessToken = (userId) => {
  return jwt.sign({ id: userId }, "my_jwt_secret_key_bookstore", {
    expiresIn: "30m",
  });
};

const createRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, "my_jwt_secret_key_bookstore", {
    expiresIn: "1y",
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
};
