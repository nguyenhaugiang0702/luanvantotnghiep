const express = require("express");
const users = require("../controllers/user.controller");
const authenticateToken = require("../middlewares/jwt.middleware");
const upload = require("../utils/multer.util");

const router = express.Router();

router
  .route("/getInfoUser")
  .get(authenticateToken.authenticateTokenFromHeader, users.findOne);
router
  .route("/updatePhoneAndEmail")
  .put(
    authenticateToken.authenticateTokenFromHeader,
    upload.single("avatar"),
    users.update
  )
  .delete(users.delete);
router
  .route("/updateProfile")
  .put(authenticateToken.authenticateTokenFromHeader, users.updateProfile);
router
  .route("/changePassword/:token")
  .put(authenticateToken.authenticateTokenFromParams, users.changePassword);
router.route("/").get(users.findALL).delete(users.deleteALL);
// router.route("/facebook").post(users.signIn);
router
  .route("/:userID")
  .get(users.findOne)
  .put(users.update)
  .delete(users.delete);
router
  .route("/activeAccount/:token")
  .get(
    authenticateToken.authenticateTokenFromParamsWithEmail,
    users.activeAccount
  );

router.route("/blockAccount/:userID").put(users.blockAccount);
router.route("/unBlockAccount/:userID").put(users.unBlockAccount);

module.exports = router;
