const Receipt = require("../models/receipt.model");
const { ObjectId } = require("mongodb");
const moment = require("moment");

const createReceipt = async (receiptData) => {
  const receipt = new Receipt(receiptData);
  return await receipt.save();
};

const getAllReceipts = async () => {
  return groupReceiptsBySupplier(await Receipt.find({}).populate("supplierID"));
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

module.exports = {
  createReceipt,
  getAllReceipts,
  getReceiptByID,
  getReceiptBySupplierID,
  getAllStockProducts,
};
