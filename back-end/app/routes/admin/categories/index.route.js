const express = require("express");
const router = express.Router();
const categories = require("../../../controllers/admin/category.controller");

router.route("/").get(categories.findAll).post(categories.create);

router.route("/:categoryID").put(categories.update).delete(categories.delete);

module.exports = router;
