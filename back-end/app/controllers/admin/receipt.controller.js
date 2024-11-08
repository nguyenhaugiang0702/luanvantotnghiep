const config = require("../../config/index");
const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const receiptService = require("../../services/receipt.service");
const supplierService = require("../../services/supplier.service");

exports.create = async (req, res, next) => {
  try {
    const adminID = req.admin ? req.admin.id : null;
    let totalPrice = 0;
    const { detail } = req.body;
    if (!adminID) {
      return next(new ApiError(400, "Vui lòng đăng nhập!"));
    }
    req.body.adminID = adminID;
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh");
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    detail.forEach((book) => {
      totalPrice += parseInt(book.totalPrice);
    });
    req.body.totalPrice = totalPrice;
    const newReceipt = await receiptService.createReceipt(req.body);
    return res.send({
      message: "Thêm nhập hàng thành công",
      newReceipt,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm nhập hàng mới!"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const { receiptID } = req.params;
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh");
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    const receipt = await receiptService.getReceiptByID(receiptID);
    if (!receipt) {
      return next(new ApiError(400, "Không tồn tại đơn nhập hàng!"));
    }
    const newReceiptDetail = req.body.detail[0];
    // Sử dụng service để thêm chi tiết và cập nhật sách
    await receiptService.addReceiptDetailAndUpdateBook(
      receipt,
      newReceiptDetail,
      next
    );
    // Cập nhật lại totalPrice cho đơn nhập hàng
    await receiptService.updateTotalPriceForReceipt(receiptID);

    return res.send({
      message: "Thêm nhập hàng thành công",
      newReceipt: newReceiptDetail,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm nhập hàng mới!"));
  }
};

exports.findAll = async (req, res, next) => {
  let receipts = [];
  try {
    receipts = await receiptService.getAllReceipts({});
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy nhập!"));
  }
  return res.send(receipts);
};

exports.findAllStockProducts = async (req, res, next) => {
  try {
    const totalBooks = {};
    const receipts = await receiptService.getAllStockProducts();
    // Duyệt qua tất cả các hóa đơn
    receipts.forEach((receipt) => {
      // Duyệt qua từng chi tiết của hóa đơn
      receipt.detail.forEach((item) => {
        const { bookID, quantity } = item;

        // Nếu sách đã tồn tại trong đối tượng `totalBooks`, cộng dồn số lượng
        if (totalBooks[bookID._id]) {
          totalBooks[bookID._id].quantity += quantity;
        } else {
          // Nếu chưa tồn tại, thêm mới vào đối tượng với số lượng ban đầu
          totalBooks[bookID._id] = {
            bookID: bookID._id,
            bookName: bookID.name,
            categoryName: bookID.categoryID?.name || "N/A", // Tên danh mục
            formalityName: bookID.formalityID?.name || "N/A", // Hình thức
            publisherName: bookID.publisherID?.name || "N/A", // Nhà xuất bản
            quantity: quantity,
          };
        }
      });
    });
    const totalBooksArray = Object.values(totalBooks);
    console.log(totalBooksArray);
    return res.send(totalBooksArray);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy nhập!"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const receiptID = req.params.receiptID;
    const receipt = await receiptService.getReceiptByID(receiptID);
    const receiptDetail = receipt.detail.map((item) => ({
      bookName: item.bookID.name,
      quantity: item.quantity,
      price: item.price,
    }));
    return res.send({
      supplier: {
        id: receipt.supplierID._id,
        name: receipt.supplierID.name,
      },
      receiptID: receipt._id,
      receiptDetail: receiptDetail,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy nhập hàng chi tiết!"));
  }
};
