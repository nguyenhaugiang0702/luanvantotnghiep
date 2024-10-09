const express = require("express");
const router = express.Router();
const authors = require("../controllers/author.controller");
const validateSupplier = require("../middlewares/validateAuthor.middleware");

router
  .route("/")
  .get(authors.findAll)
  .post(validateSupplier.createAuthorValidation, authors.create);

router
  .route("/:authorID")
  .put(validateSupplier.createAuthorValidation, authors.update)
  .delete(authors.delete);

module.exports = router;
