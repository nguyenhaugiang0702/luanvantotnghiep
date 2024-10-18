const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const bookService = require("../../services/book.service");
const orderService = require("../../services/order.service");
const userService = require("../../services/user.service");
const categoryService = require("../../services/category.service");

exports.findAll = async (req, res, next) => {
  let data = {
    orders: {},
    categories: {},
    users: {},
  };
  try {
    // Số lượng sách, người dùng, đơn hàng, thể loại
    const books = await bookService.countBooks();
    data.books = books;
    const users = await userService.countUsers();
    data.users.totalUsers = users;
    const orders = await orderService.countDocumentsOrders();
    data.orders.totalOrders = orders;
    const categories = await categoryService.countCategories();
    data.categories.totalCategories = categories;
    // Tính theo tháng
    const ordersByMonth = await orderService.countOrdersByMonth(
      new Date().getFullYear()
    );
    data.orders.ordersByMonth = ordersByMonth;
    const { categoryNames, bookTotals } =
      await categoryService.countBooksByCategory();
    data.categories.categoryNames = categoryNames; // Mảng tên thể loại
    data.categories.bookTotals = bookTotals;
    const usersByMonth = await userService.countUsersByMonth(
      new Date().getFullYear()
    );
    data.users.usersByMonth = usersByMonth;
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy tất cả dữ liệu ở home-admin"));
  }
  return res.send(data);
};
