const express = require("express");
const publishers = require("../../../controllers/admin/publisher.controller");
const validation = require("../../../middlewares/validatePublisher.middelware");

const router = express.Router();

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
