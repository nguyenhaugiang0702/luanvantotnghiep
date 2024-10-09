const express = require("express");
const users = require("../controllers/user.controller");
const jwt = require("../middlewares/jwt.middleware");
const jwtAdmin = require("../middlewares/jwtAdmin.middleware");
const validation = require("../middlewares/validateUser.middelware");
const upload = require("../utils/multer.util");

const router = express.Router();

router
  .route("/getInfoUser")
  .get(jwt.authenticateTokenFromHeader, users.findOne);
router
  .route("/updatePhoneAndEmail")
  .put(jwt.authenticateTokenFromHeader, users.update)
  .delete(users.delete);
router
  .route("/updateProfile")
  .put(
    jwt.authenticateTokenFromHeader,
    validation.updateUserValidation,
    users.updateProfile
  );

router
  .route("/")
  .get(jwtAdmin.authenticateTokenFromHeader, users.findALL)
  .delete(jwtAdmin.authenticateTokenFromHeader, users.deleteALL);
// router.route("/facebook").post(users.signIn);
router
  .route("/:userID")
  .get(jwtAdmin.authenticateTokenFromHeader, users.findOne)
  .put(jwtAdmin.authenticateTokenFromHeader, users.update)
  .delete(jwtAdmin.authenticateTokenFromHeader, users.delete);

router
  .route("/blockAccount/:userID")
  .put(jwtAdmin.authenticateTokenFromHeader, users.blockAccount);
router
  .route("/unBlockAccount/:userID")
  .put(jwtAdmin.authenticateTokenFromHeader, users.unBlockAccount);

module.exports = router;
