const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");

// Hàm để xác thực token từ header
function authenticateTokenFromHeader(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return next(new ApiError(403, "Vui lòng kiểm tra lại mã thông báo"));

  jwt.verify(token, "my_jwt_secret_key_bookstore", (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ApiError(401, "Phiên hết hạn, vui lòng đăng nhập lại"));
      } else {
        return next(new ApiError(403, "Vui lòng kiểm tra lại"));
      }
    }
    req.user = { ...user, token };
    next();
  });
}

// Hàm để xác thực token từ route params
function authenticateTokenFromParams(req, res, next) {
  const token = req.params.token;
  if (!token) return next(new ApiError(403, "Vui lòng kiểm tra lại mã thông báo"));

  jwt.verify(token, "my_jwt_secret_key_bookstore", (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ApiError(401, "Phiên hết hạn, vui lòng đăng nhập lại"));
      } else {
        return next(new ApiError(403, "Vui lòng kiểm tra lại"));
      }
    }
    req.user = user;
    next();
  });
}

// Hàm để xác thực token từ route params
function authenticateTokenFromParamsWithEmail(req, res, next) {
  const token = req.params.token;
  if (!token) return next(new ApiError(403, "Vui lòng kiểm tra lại mã thông báo"));

  jwt.verify(token, "my_jwt_secret_key_bookstore", (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ApiError(401, "Phiên hết hạn, vui lòng đăng nhập lại"));
      } else {
        return next(new ApiError(403, "Vui lòng kiểm tra lại"));
      }
    }
    req.user = user;
    next();
  });
}

// Hàm để xác thực token từ route params
function authenticateTokenFromParamsWithEmail(req, res, next) {
  const token = req.params.token;
  if (!token) return next(new ApiError(403, "Vui lòng kiểm tra lại mã thông báo"));

  jwt.verify(token, "my_jwt_secret_key_bookstore", (err, email) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ApiError(401, "Phiên hết hạn, vui lòng đăng nhập lại"));
      } else {
        return next(new ApiError(403, "Vui lòng kiểm tra lại"));
      }
    }
    req.user = email;

    next();
  });
}

// Hàm để xác thực token và lấy thông tin người dùng
const authenticateToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, "my_jwt_secret_key_bookstore", (err, user) => {
      if (err) {
        reject(err); // Trả về lỗi nếu có
      } else {
        resolve(user); // Trả về thông tin người dùng
      }
    });
  });
};

module.exports = {
  authenticateTokenFromHeader,
  authenticateTokenFromParams,
  authenticateTokenFromParamsWithEmail,
  authenticateToken,
};
