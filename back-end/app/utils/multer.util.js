const multer = require("multer");
const path = require("path");

const imageFileTypes = /jpeg|jpg|png|webp/;
// Kiểm tra file có phải là ảnh không
function checkFileType(file, cb) {
  const extname = imageFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = imageFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "File không hợp lệ. Chỉ chấp nhận các định dạng ảnh (jpeg, jpg, png, webp)"
      )
    );
  }
}

// Thiết lập nơi lưu trữ và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.body.fileType === "avatar") {
      cb(null, "app/images/uploads/avatars/");
    } else if (req.body.fileType === "book") {
      cb(null, "app/images/uploads/books/");
    } else if (req.body.fileType === "comment") {
      cb(null, "app/images/uploads/comments/");
    } else {
      cb(new Error("Invalid file type"), null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Thiết lập middleware multer với kiểm tra tệp
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});
module.exports = upload;
