const express = require("express");
const cors = require("cors");

const app = express();
const ApiError = require("./app/api-error");
const userRouter = require("./app/routes/user.route");
const authRouter = require("./app/routes/auth.route");
const supplierRouter = require("./app/routes/supplier.route");
const receiptRouter = require("./app/routes/receipt.route");

require("./app/passport");
app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/suppliers", supplierRouter);
app.use("/api/v1/receipts", receiptRouter);

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
