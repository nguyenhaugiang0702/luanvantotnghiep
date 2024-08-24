const express = require("express");
const router = express.Router();
const publishers = require("../controllers/publisher.controller");
const validation = require("../middlewares/validatePublisher.middelware");

router
  .route("/")
  .get(publishers.findAll)
  .post(validation.createPublisherValidation, publishers.create);

router
  .route("/:publisherID")
  .get(publishers.findOne)
  .put(validation.createPublisherValidation, publishers.update)
  .delete(publishers.delete);

module.exports = router;
