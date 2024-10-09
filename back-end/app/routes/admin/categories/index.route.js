const express = require("express");
const router = express.Router();
const categories = require("../../../controllers/category.controller");
// const validateSupplier = require("../middlewares/validateAuthor.middleware");

router.route("/").get(categories.findAll).post(categories.create);

router.route("/:categoryID").put(categories.update).delete(categories.delete);

module.exports = router;
