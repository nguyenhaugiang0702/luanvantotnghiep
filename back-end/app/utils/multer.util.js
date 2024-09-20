const multer = require("multer");
const path = require("path");

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

// Thiết lập middleware multer
const upload = multer({ storage: storage });

module.exports = upload;
