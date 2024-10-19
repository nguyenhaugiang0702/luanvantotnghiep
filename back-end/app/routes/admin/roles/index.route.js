const express = require("express");
const router = express.Router();
const role = require("../../../controllers/admin/role.controller");
const validateSupplier = require("../../../middlewares/validateAuthor.middleware");

router
  .route("/")
  .get(role.findAll)
  .post(role.create);

router
  .route("/:roleID")
  .put(role.update)
  .delete(role.delete);

module.exports = router;
