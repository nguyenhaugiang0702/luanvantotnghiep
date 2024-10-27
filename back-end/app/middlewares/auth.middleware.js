const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");
const config = require("../config/index");

// Hàm để xác thực token từ header
const verifyUserToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || null;
  if (!authHeader) {
    return next();
  }
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return next(new ApiError(403, "Vui lòng kiểm tra lại mã thông báo"));

  jwt.verify(token, config.jwt.user.secretKey, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ApiError(401, "Phiên hết hạn, vui lòng đăng nhập lại"));
      } else {
        return next(new ApiError(403, "Vui lòng đăng nhập lại"));
      }
    }
    req.user = { ...user, token };
    next();
  });
};

const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || null;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return next(new ApiError(403, "Vui lòng kiểm tra lại mã thông báo"));

  jwt.verify(token, config.jwt.admin.secretKey, (err, admin) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ApiError(401, "Phiên hết hạn, vui lòng đăng nhập lại"));
      } else {
        return next(new ApiError(403, "Vui lòng đăng nhập lại"));
      }
    }
    req.admin = { ...admin, token };
    next();
  });
};

module.exports = {
  verifyUserToken,
  verifyAdminToken,
};
