const express = require("express");
const cors = require("cors");

const app = express();
const ApiError = require("./app/api-error");
const adminRouter = require("./app/routes/admin/index.route");
const userRouter = require("./app/routes/user/index.route");
const { verifyUserToken, verifyAdminToken } = require("./app/middlewares/auth.middleware");
const path = require('path');

require("./app/passport");
app.use(cors());
app.use(
  cors({
    // origin: "http://localhost:3001",
    origin: '*',
  })
);
// Định nghĩa static file
const staticFiles = [
  "app/images/uploads/books/",
  "app/images/uploads/avatars/",
  "app/images/uploads/comments/",
  "app/images/uploads/orders/",
];
staticFiles.forEach((path) => app.use(`/${path}`, express.static(path)));

// const staticFiles = [
//   path.join(__dirname, 'app/images/uploads/books/'),
//   path.join(__dirname, 'app/images/uploads/avatars/'),
//   path.join(__dirname, 'app/images/uploads/comments/'),
//   path.join(__dirname, 'app/images/uploads/orders/')
// ];

// staticFiles.forEach((folderPath) => app.use('/app/images/uploads/', express.static(folderPath)));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1/admin", verifyAdminToken, adminRouter);
app.use("/api/v1/user", verifyUserToken, userRouter);

// handle 404 response
app.use((req, res, next) => {
  // Code ở đây sẽ chạy khi không có route được định nghĩa nào
  // khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
  return next(new ApiError(404, "Resource not found"));
});

// define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
  // Middleware xử lý lỗi tập trung.
  // Trong các đoạn code xử lý ở các route, gọi next(error) sẽ chuyển về middleware xử lý lỗi này
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.get("/", (req, res) => {
  res.json({ message: "welcome to hau giang bookstore" });
});

module.exports = app;
