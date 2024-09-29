const moment = require("moment-timezone");
const ApiError = require("../api-error");
const cartService = require("../services/cart.service");

exports.create = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const { books } = req.body;
    let cart = await cartService.getCartByUserID(userID);
    // Nếu giỏ hàng không tồn tại, tạo mới
    if (!cart) {
      const totalPrice = books.reduce((acc, book) => {
        if (typeof book.quantity !== "number" || book.quantity <= 0) {
          return next(new ApiError(400, "Số lượng sách không hợp lệ"));
        }
        return acc + book.price * book.quantity;
      }, 0);
      cartData = {
        userID,
        books,
        totalPrice: totalPrice,
        createdAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
        updatedAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
      };
      const newCart = await cartService.createCartByUserID(cartData);
      return res.send({
        message: "Thêm vào giỏ hàng thành công",
        newCart,
      });
    }
    // Cập nhật thông tin sách trong giỏ hàng
    books.forEach((book) => {
      if (typeof book.quantity !== "number" || book.quantity <= 0) {
        return next(new ApiError(400, "Số lượng sách không hợp lệ"));
      }
      const existingBook = cart.books.find(
        (b) => b.bookID.toString() === book.bookID.toString()
      );

      if (existingBook) {
        if (book.method === "DELETE") {
          // Nếu sách đã tồn tại, giảm số lượng và giá
          existingBook.quantity -= book.quantity;
        } else if (book.method === "UPDATE") {
          // Nếu sách đã tồn tại, thay đổi trong input
          existingBook.quantity = book.quantity;
        } else {
          // Nếu sách đã tồn tại, tăng số lượng và giá
          existingBook.quantity += book.quantity;
        }
      } else {
        // Nếu sách chưa tồn tại, thêm vào giỏ hàng
        cart.books.push(book);
      }
    });
    // Cập nhật tổng giá trị giỏ hàng
    cart.totalPrice = cart.books.reduce(
      (acc, book) => acc + book.price * book.quantity,
      0
    );
    cart.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    // Lưu giỏ hàng đã được cập nhật hoặc tạo mới
    cart.save();
    return res.send({
      message: "Thêm vào giỏ hàng thành công",
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm mới sách vào giỏ"));
  }
};

exports.findAll = async (req, res, next) => {
  let totalQuantity = 0;
  const userID = req.user.id;
  try {
    const cart = await cartService.getFullInfoCartByUserID(userID);
    totalQuantity = cart.books.length;
    const cartWithQuantity = {
      ...cart._doc,
      totalQuantity: totalQuantity,
    };
    console.log(cartWithQuantity);
    return res.send(cartWithQuantity);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả sách trong giỏ"));
  }
};

exports.findAllBooksCheckBox = async (req, res, next) => {
  const userID = req.user.id;
  let totalPrice = 0;
  let totalQuantity = 0;
  let checkedOutBooks = [];
  let bookInCart = [];
  try {
    const cart = await cartService.getFullInfoCartByUserID(userID);
    cart.books.forEach((book) => {
      if (book.isCheckOut) {
        totalPrice += book.price * book.quantity;
        totalQuantity += book.quantity;
        checkedOutBooks.push(book);
      }
      bookInCart.push(book);
    });
    return res.send({
      totalPrice,
      totalQuantity,
      books: checkedOutBooks,
      bookInCart: bookInCart,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả sách trong giỏ"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const bookID = req.params.bookID;
    const cart = await cartService.getCartByUserID(userID);
    if (!cart) {
      return next(new ApiError(400, "Không tìm thấy giỏ hàng"));
    }
    const book = cart.books.find((b) => b.bookID.toString() === bookID);
    const newCheckOutStatus = !book.isCheckOut;
    const updateCart = await cartService.updateCheckOutStatus(
      userID,
      bookID,
      newCheckOutStatus
    );
    if (!updateCart) {
      return next(new ApiError(400, "Lỗi khi cập nhật trạng thái checkbox"));
    }
    return res.send({
      message: "Cập nhật thành công trạng thái checkbox",
      updateCart,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật sách"));
  }
};

exports.updateCheckAll = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const cart = await cartService.getCartByUserID(userID);
    if (!cart) {
      return next(new ApiError(400, "Không tìm thấy giỏ hàng"));
    }
    const checkAll = cart.books.every((b) => b.isCheckOut);
    const newCheckOutStatus = !checkAll;
    const updateCart = await cartService.updateCheckOutAllStatus(
      userID,
      newCheckOutStatus
    );

    if (!updateCart) {
      return next(new ApiError(400, "Lỗi khi cập nhật trạng thái checkbox"));
    }
    return res.send({
      message: "Cập nhật thành công trạng thái checkbox",
      updateCart,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật sách"));
  }
};

exports.deleteBookFromCart = async (req, res, next) => {
  try {
    const bookID = req.params.bookID;
    const userID = req.user.id;
    let cart = await cartService.getCartByUserID(userID);
    if (!cart) {
      return next(new ApiError(400, "Không tìm thấy giỏ hàng"));
    }
    const updatedCart = await cartService.deleteBookFromCart(userID, bookID);
    // Cập nhật tổng giá trị giỏ hàng
    cart.totalPrice = updatedCart.books.reduce(
      (acc, book) => acc + book.price * book.quantity,
      0
    );
    cart.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    // Lưu giỏ hàng đã được cập nhật hoặc tạo mới
    cart.save();
    if (!updatedCart) {
      return next(new ApiError(400, "Xóa sách thất bại"));
    }

    return res.send({
      message: "Xóa thành công sách",
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa sách"));
  }
};

exports.deleteAllBookFromCart = async (req, res, next) => {
  try {
    const userID = req.user.id;
    let cart = await cartService.getCartByUserID(userID);
    if (!cart) {
      return next(new ApiError(400, "Không tìm thấy giỏ hàng"));
    }
    const updatedCart = await cartService.clearCart(userID);

    if (!updatedCart) {
      return next(new ApiError(400, "Xóa sách thất bại"));
    }

    return res.send({
      message: "Xóa thành công sách",
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa sách"));
  }
};
