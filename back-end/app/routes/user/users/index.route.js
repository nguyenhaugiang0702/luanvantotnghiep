const express = require("express");
const users = require("../../../controllers/user/user.controller");
const jwt = require("../../../middlewares/jwt.middleware");
const jwtAdmin = require("../../../middlewares/jwtAdmin.middleware");
const validation = require("../../../middlewares/validateUser.middelware");
const upload = require("../../../utils/multer.util");

const router = express.Router();

router
  .route("/getInfoUser")
  .get(jwt.authenticateTokenFromHeader, users.findOne);
router
  .route("/updatePhoneAndEmail")
  .put(jwt.authenticateTokenFromHeader, users.update);
router
  .route("/updateProfile")
  .put(
    jwt.authenticateTokenFromHeader,
    validation.updateUserValidation,
    users.updateProfile
  );
  
module.exports = router;
