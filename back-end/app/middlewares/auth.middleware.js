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

  if (!token) return next(new ApiError(403, "Vui lòng đăng nhập"));

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
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (req.originalUrl.includes("/auth/login")) {
    return next();
  }
  if (!token) {
    return next(new ApiError(403, "Vui lòng đăng nhập"));
  }

  jwt.verify(token, config.jwt.admin.secretKey, (err, admin) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ApiError(401, "Phiên hết hạn, vui lòng đăng nhập lại"));
      } else {
        return next(new ApiError(403, "Vui lòng đăng nhập lại"));
      }
    }

    // Admin
    if (admin.role === "admin") {
      req.admin = { ...admin, token };
      return next();
    }
    // Sale
    const allowedRoutesForSale = [
      "/chats",
      "/suppliers",
      "/orders",
      "/receipts",
      "/auth",
      "/admins",
    ];
    const isSaleAllowed = allowedRoutesForSale.some((route) =>
      req.originalUrl.includes(route)
    );

    if (admin.role === "sale" && isSaleAllowed) {
      req.admin = { ...admin, token };
      return next();
    }
    // Shipper
    const allowedRoutesForShipper = ["/admins/infoAdmin", "/orders", "/auth"];
    const isShipperAllowed = allowedRoutesForShipper.some((route) =>
      req.originalUrl.includes(route)
    );
    if (admin.role === "shipper" && isShipperAllowed) {
      req.admin = { ...admin, token };
      return next();
    }

    return next(new ApiError(403, "Bạn không có quyền truy cập"));
  });
};

module.exports = {
  verifyUserToken,
  verifyAdminToken,
};
