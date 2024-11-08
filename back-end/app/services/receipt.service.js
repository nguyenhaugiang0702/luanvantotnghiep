const Receipt = require("../models/receipt.model");
const Book = require("../models/book.model");
const { ObjectId } = require("mongodb");
const moment = require("moment");
const ApiError = require("../api-error");

const createReceipt = async (receiptData) => {
  const receipt = new Receipt(receiptData);
  for (const detail of receiptData.detail) {
    const book = await Book.findById(detail.bookID);

    if (book) {
      book.quantityImported += parseInt(detail.quantity);
      await book.save();
    }
  }
  return await receipt.save();
};

const getAllReceipts = async (query) => {
  return await Receipt.find(query)
    .populate("supplierID")
    .populate("adminID")
    .sort({ createdAt: -1 });
};

const getAllStockProducts = async () => {
  return await Receipt.find({}).populate({
    path: "detail.bookID",
    populate: [
      { path: "categoryID", select: "name" },
      { path: "formalityID", select: "name" },
      { path: "publisherID", select: "name" },
    ],
  });
};

const getReceiptByID = async (receiptID) => {
  return await Receipt.findById(receiptID)
    .populate("detail.bookID")
    .populate("supplierID");
};

const getReceiptBySupplierID = async (supplierID) => {
  return await Receipt.findOne({ supplierID: supplierID });
};

const groupReceiptsBySupplier = (receipts) => {
  const grouped = {};

  receipts.forEach((receipt) => {
    const supplierID = receipt.supplierID._id;
    const supplierInfo = receipt.supplierID;

    // Nếu nhà cung cấp chưa tồn tại trong grouped, tạo mới
    if (!grouped[supplierID]) {
      grouped[supplierID] = {
        supplierInfo,
        receipts: [],
      };
    }

    // Thêm thông tin chi tiết của đơn nhập với ngày `createdAt` giữ nguyên
    grouped[supplierID].receipts.push({
      _id: receipt._id,
      createdAt: receipt.createdAt, // Giữ nguyên ngày
      adminID: receipt.adminID,
      details: receipt.detail,
      supplierInfo: supplierInfo,
    });
  });

  // Chuyển kết quả thành mảng
  return Object.values(grouped).map((supplier) => ({
    supplierInfo: supplier.supplierInfo,
    receipts: supplier.receipts,
  }));
};

const addReceiptDetailAndUpdateBook = async (receipt, newDetail, next) => {
  try {
    // Thêm chi tiết mới vào receipt
    receipt.detail.push(newDetail);

    // Tìm sách và cập nhật số lượng
    const book = await Book.findById(newDetail.bookID);
    if (!book) {
      throw new ApiError(400, "Sách không tồn tại!");
    }

    // Cập nhật số lượng sách
    book.quantityImported += parseInt(newDetail.quantity);
    await book.save();

    // Lưu receipt sau khi cập nhật
    await receipt.save();

    return receipt;
  } catch (error) {
    return next(error); // Xử lý lỗi và truyền tiếp cho middleware
  }
};

const updateTotalPriceForReceipt = async (receiptID) => {
  try {
    const updatedReceipt = await Receipt.findById(receiptID);
    if (!updatedReceipt) {
      throw new ApiError(
        400,
        "Không thể lấy lại đơn nhập hàng để tính toán tổng giá trị!"
      );
    }
    // Tính tổng giá trị cho đơn nhập hàng
    const totalPrice = updatedReceipt.detail.reduce((total, detail) => {
      return total + detail.quantity * detail.price;
    }, 0);

    // Cập nhật lại totalPrice cho đơn nhập hàng
    updatedReceipt.totalPrice = totalPrice;

    // Lưu lại đơn nhập hàng đã cập nhật
    await updatedReceipt.save();

    return updatedReceipt;
  } catch (error) {
    throw new ApiError(
      500,
      "Lỗi khi tính toán và cập nhật tổng giá trị cho đơn nhập hàng."
    );
  }
};

module.exports = {
  createReceipt,
  getAllReceipts,
  getReceiptByID,
  getReceiptBySupplierID,
  getAllStockProducts,
  addReceiptDetailAndUpdateBook,
  updateTotalPriceForReceipt,
};
