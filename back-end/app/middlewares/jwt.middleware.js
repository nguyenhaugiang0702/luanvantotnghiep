const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");

// Hàm để xác thực token từ header
function authenticateTokenFromHeader(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return next(new ApiError(403, "Vui lòng kiểm tra lại mã thông báo"));

  jwt.verify(token, "my_jwt_secret_key_login", (err, user) => {
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
function authenticateTokenFromParams(req, res, next) {
  const token = req.params.token;
  if (!token) return next(new ApiError(403, "Vui lòng kiểm tra lại mã thông báo"));

  jwt.verify(token, "my_jwt_secret_key_login", (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ApiError(401, "Phiên hết hạn, vui lòng đăng nhập lại"));
      } else {
        return next(new ApiError(403, "Vui lòng kiểm tra lại"));
      }
    }
    req.user = user;
    console.log(req.user);
    next();
  });
}

// Hàm để xác thực token từ route params
function authenticateTokenFromParamsWithEmail(req, res, next) {
  const token = req.params.token;
  if (!token) return next(new ApiError(403, "Vui lòng kiểm tra lại mã thông báo"));

  jwt.verify(token, "my_secret_key_with_email_to_active", (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ApiError(401, "Phiên hết hạn, vui lòng đăng nhập lại"));
      } else {
        return next(new ApiError(403, "Vui lòng kiểm tra lại"));
      }
    }
    req.user = user;
    console.log(req.user);
    next();
  });
}

// Hàm để xác thực token từ route params
function authenticateTokenFromParamsWithEmail(req, res, next) {
  const token = req.params.token;
  if (!token) return next(new ApiError(403, "Vui lòng kiểm tra lại mã thông báo"));

  jwt.verify(token, "my_secret_key_with_email_to_active", (err, email) => {
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

module.exports = {
  authenticateTokenFromHeader,
  authenticateTokenFromParams,
  authenticateTokenFromParamsWithEmail,
};
