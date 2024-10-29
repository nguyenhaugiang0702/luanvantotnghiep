const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const cartService = require("../../services/cart.service");
const bookService = require("../../services/book.service");
const voucherService = require("../../services/vouchers/voucher.service");
const voucherCategoryService = require("../../services/vouchers/voucherCategory.service");
const voucherUsedsService = require("../../services/vouchers/voucherUseds.service");

exports.create = async (req, res, next) => {
  try {
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
    const { books } = req.body;
    let cart = await cartService.getCartByUserID(userID);
    if (!cart) {
      const totalPrice = await cartService.calculateTotalPriceAndCheckStock(
        books,
        userID,
        next
      );
      if (!totalPrice) return;
      cartData = {
        userID,
        books,
        totalPrice: totalPrice,
        createdAt: moment.tz("Asia/Ho_Chi_Minh"),
        updatedAt: moment.tz("Asia/Ho_Chi_Minh"),
      };
      const newCart = await cartService.createCartByUserID(cartData);
      return res.send({
        message: "Thêm vào giỏ hàng thành công",
        newCart,
      });
    } else {
      const updatedCart = await cartService.updateCartItems(
        books,
        userID,
        next
      );
      if (!updatedCart) return;

      return res.send({
        message: "Cập nhật giỏ hàng thành công",
      });
    }
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm mới sách vào giỏ"));
  }
};

exports.findAll = async (req, res, next) => {
  let totalQuantity = 0;
  let userID = req.user ? req.user.id : null;
  if (!userID) {
    return next(new ApiError(400, "Vui lòng đăng nhập"));
  }
  try {
    let cart = await cartService.getFullInfoCartByUserID(userID);
    if (!cart) {
      cartData = {
        userID,
        books: [],
        totalPrice: 0,
        createdAt: moment.tz("Asia/Ho_Chi_Minh"),
        updatedAt: moment.tz("Asia/Ho_Chi_Minh"),
      };
      cart = await cartService.createCartByUserID(cartData);
    }
    totalQuantity = cart?.books?.length;
    const cartWithQuantity = {
      ...cart?._doc,
      totalQuantity: totalQuantity,
    };
    return res.send(cartWithQuantity);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy tất cả sách trong giỏ"));
  }
};

exports.findAllBooksCheckBox = async (req, res, next) => {
  const userID = req.user ? req.user.id : null;
  if (!userID) {
    return next(new ApiError(400, "Vui lòng đăng nhập"));
  }
  let totalPrice = 0; // Giá sau khi giảm
  let totalQuantity = 0;
  let checkedOutBooks = [];
  let bookInCart = [];
  let appliedDiscount = 0; // Giá giảm được (VND)
  let originalTotalPrice = 0; // Tổng giá ban đầu
  let totalWeight = 0;
  const currentDate = moment().tz("Asia/Ho_Chi_Minh").toDate();

  try {
    // Tìm mã giảm gía đã được áp dụng và chưa sử dụng
    const discountCodeApplied = await voucherUsedsService.getOneVoucherUsed({
      userID: userID,
      isApplied: true,
      isUsed: false,
    });

    const cart = await cartService.getFullInfoCartByUserID(userID);
    cart?.books?.forEach((book) => {
      if (book.isCheckOut) {
        const bookObj = book.bookID;
        totalPrice += book.price * book.quantity; // Tính tổng giá
        totalQuantity += book.quantity; // Tổng số lượng
        totalWeight += bookObj.detail.weight * book.quantity; // Tổng trọng lượng
        checkedOutBooks.push(book);
      }
      bookInCart.push(book);
    });

    // Lưu lại tổng giá trị chưa giảm
    originalTotalPrice = totalPrice;

    // Tính toán áp dụng mã giảm giá nếu có
    if (discountCodeApplied) {
      const voucher = discountCodeApplied.voucherID;
      // Kiểm tra mã hết hạn chưa
      const endDate = moment(voucher.endDate).tz("Asia/Ho_Chi_Minh").toDate();
      if (endDate < currentDate) {
        // Cập nhật lại trạng thái applied là false nếu như hết hạn
        await voucherUsedsService.updateVoucherUseds(discountCodeApplied._id, {
          isApplied: false,
        });
      } else {
        const discountValue = calculateDiscount(
          totalPrice,
          voucher.voucherCategoryID
        );
        // Áp dụng mức giảm giá (giảm phần trăm hoặc giá trị cố định)
        appliedDiscount += discountValue;

        // Cập nhật tổng tiền sau khi áp dụng giảm giá
        totalPrice -= appliedDiscount;
        if (totalPrice < 0) {
          totalPrice = 0;
        }
      }
    }

    return res.send({
      originalTotalPrice,
      totalPrice,
      totalQuantity,
      totalWeight,
      discountValue: appliedDiscount,
      books: checkedOutBooks,
      bookInCart: bookInCart,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy tất cả sách trong giỏ"));
  }
};

// Hàm tính toán giảm giá
function calculateDiscount(totalPrice, voucher) {
  let discountValue = 0;

  // Kiểm tra loại giảm giá và áp dụng tương ứng
  if (voucher.discountType === "percent") {
    // Giảm giá theo phần trăm
    discountValue = (voucher.value / 100) * totalPrice;

    // Nếu có giá trị giảm tối đa, thì không vượt quá giá trị này
    if (voucher.maxValue && discountValue > voucher.maxValue) {
      discountValue = voucher.maxValue;
    }
  } else if (voucher.discountType === "amount") {
    // Giảm giá cố định
    discountValue = voucher.value;
  }

  // Kiểm tra tổng giá trị có đạt điều kiện giá trị tối thiểu hay không
  if (voucher.minValue && totalPrice < voucher.minValue) {
    discountValue = 0; // Không áp dụng nếu tổng tiền không đủ điều kiện
  }

  return discountValue;
}

exports.update = async (req, res, next) => {
  try {
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
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

    // Kiểm tra mã giảm giá có được sử dụng không
    const noBooksCheckedOut = updateCart.books.every((b) => !b.isCheckOut);
    const voucher = await voucherUsedsService.getOneVoucherUsed({
      userID: userID,
      isApplied: true,
    });

    // Nếu có chọn sách và có chọn mã giảm gía thì đặt về false
    if (noBooksCheckedOut && voucher) {
      await voucherUsedsService.updateVoucherUseds(voucher._id, {
        isApplied: !voucher.isApplied,
      });
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
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
    const cart = await cartService.getCartByUserID(userID);
    if (!cart) {
      return next(new ApiError(400, "Không tìm thấy giỏ hàng"));
    }
    // Kiểm tra xem tất cả sách có đang được chọn không
    const checkAll = cart.books.every((b) => b.isCheckOut);
    const newCheckOutStatus = !checkAll;
    const updateCart = await cartService.updateCheckOutAllStatus(
      userID,
      newCheckOutStatus
    );

    if (!updateCart) {
      return next(new ApiError(400, "Lỗi khi cập nhật trạng thái checkbox"));
    }

    // Kiểm tra mã giảm giá có được sử dụng không, nếu có thì lấy chi tiết ra
    const noBooksCheckedOut = updateCart.books.every((b) => !b.isCheckOut);
    const voucher = await voucherUsedsService.getOneVoucherUsed({
      userID: userID,
      isApplied: true,
    });

    // Nếu có chọn sách và có chọn mã giảm gía thì đặt về false
    if (noBooksCheckedOut && voucher) {
      await voucherUsedsService.updateVoucherUseds(voucher._id, {
        isApplied: !voucher.isApplied,
      });
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
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
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
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
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
