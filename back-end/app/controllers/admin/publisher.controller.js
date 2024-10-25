const publisherService = require("../../services/publisher.service");
const moment = require("moment-timezone");
const ApiError = require("../../api-error");

exports.create = async (req, res, next) => {
  try {
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh");
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    const newPublisher = await publisherService.createPublisher(req.body);
    return res.send({
      message: "Thêm thành công nhà xuất bản",
      newPublisher,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo mới nhà xuất bản"));
  }
};

exports.findAll = async (req, res, next) => {
  let publishers = [];
  try {
    publishers = await publisherService.getAllPublishers();
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả nhà xuất bản"));
  }
  return res.send(publishers);
};

exports.findOne = async (req, res, next) => {
  try {
    const publisherID = req.params.publisherID;
    const publisher = await publisherService.getPublisherById(publisherID);
    return res.send(publisher);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy nhà xuất bản"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const publisherID = req.params.publisherID;
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    const publisher = await publisherService.updatePublisher(
      publisherID,
      req.body
    );
    return res.send({
      message: "Cập nhật thành công nhà xuất bản",
      publisher,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật nhà xuất bản"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const publisherID = req.params.publisherID;
    const publisher = await publisherService.deletePublisher(publisherID);
    return res.send({
      message: "Xóa thành công nhà xuất bản",
      publisher,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa nhà xuất bản"));
  }
};
