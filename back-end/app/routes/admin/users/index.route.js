const express = require("express");
const users = require("../../../controllers/admin/user.controller");

const router = express.Router();

router.route("/").get(users.findALL).delete(users.deleteALL);
router
  .route("/:userID")
  .get(users.findOne)
  .put(users.update)
  .delete(users.delete);

router.route("/blockAccount/:userID").put(users.blockAccount);
router.route("/unBlockAccount/:userID").put(users.unBlockAccount);

module.exports = router;
