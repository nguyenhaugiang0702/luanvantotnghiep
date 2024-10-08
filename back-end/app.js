const express = require("express");
const cors = require("cors");

const app = express();
const ApiError = require("./app/api-error");
const adminRouter = require("./app/routes/admin/index.route");
const user1Router = require("./app/routes/user/index.route");

// const userRouter = require("./app/routes/user.route");
// const authUserRouter = require("./app/routes/auth/authUser.route");
// const authAdminRouter = require("./app/routes/auth/authAdmin.route");
// const supplierRouter = require("./app/routes/supplier.route");
// const receiptRouter = require("./app/routes/receipt.route");
// const authorRouter = require("./app/routes/author.route");
// const publisherRouter = require("./app/routes/publisher.route");
// const categoryRouter = require("./app/routes/category.route");
// const formalityRouter = require("./app/routes/formality.route");
// const bookRouter = require("./app/routes/book.route");
// const priceRangeRouter = require("./app/routes/pricerange.route");
// const cartRouter = require("./app/routes/cart.route");
// const addressRouter = require("./app/routes/address.route");
// const orderRouter = require("./app/routes/order.route");
// const chatRouter = require("./app/routes/chat.route");
// const commentRouter = require("./app/routes/comment.route");
// const voucherRouter = require("./app/routes/voucher.route");

const upload = require("./app/utils/multer.util");

require("./app/passport");
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);
// Định nghĩa static file
const staticFiles = [
  "app/images/uploads/books/",
  "app/images/uploads/avatars/",
  "app/images/uploads/comments/",
];
staticFiles.forEach((path) => app.use(`/${path}`, express.static(path)));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", user1Router);

// app.use("/api/v1/users", upload.single("avatar"), userRouter);
// app.use("/api/v1/auth/user", authUserRouter);
// app.use("/api/v1/auth/admin", authAdminRouter);
// app.use("/api/v1/suppliers", supplierRouter);
// app.use("/api/v1/receipts", receiptRouter);
// app.use("/api/v1/authors", authorRouter);
// app.use("/api/v1/publishers", publisherRouter);
// app.use("/api/v1/categories", categoryRouter);
// app.use("/api/v1/formalities", formalityRouter);
// app.use("/api/v1/priceRanges", priceRangeRouter);
// app.use("/api/v1/carts", cartRouter);
// app.use("/api/v1/address", addressRouter);
// app.use("/api/v1/orders", orderRouter);
// app.use("/api/v1/chats", chatRouter);
// app.use("/api/v1/comments", upload.array("images"), commentRouter);
// app.use("/api/v1/vouchers", voucherRouter);
// app.use("/api/v1/books", upload.array("images"), bookRouter);

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
