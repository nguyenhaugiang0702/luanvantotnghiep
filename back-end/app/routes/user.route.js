const express = require("express");
const users = require("../controllers/user.controller");
const authenticateToken = require("../middlewares/jwt.middleware");

const router = express.Router();

router.route("/").get(users.findALL).post(users.create).delete(users.deleteALL);
router.route("/signIn").post(users.signIn);
router.route("/facebook").post(users.signIn);
router.route("/:userID").get(users.findOne).put(users.update).delete(users.delete);
router
  .route("/activeAccount/:token")
  .get(
    authenticateToken.authenticateTokenFromParamsWithEmail,
    users.activeAccount
  );

router.route("/blockAccount/:userID").put(users.blockAccount);
router.route("/unBlockAccount/:userID").put(users.unBlockAccount);


module.exports = router;
