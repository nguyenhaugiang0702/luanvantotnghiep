const express = require("express");
const users = require("../../../controllers/user/user.controller");
const validation = require("../../../middlewares/validateUser.middelware");

const router = express.Router();

router.route("/getInfoUser").get(users.findOne);
router.route("/updatePhoneAndEmail").put(users.update);
router
  .route("/updateProfile")
  .put(validation.updateUserValidation, users.updateProfile);

module.exports = router;
