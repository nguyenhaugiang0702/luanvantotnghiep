const express = require("express");
const suppliers = require("../controllers/supplier.controller");
const authenticateToken = require("../middlewares/jwt.middleware");

const router = express.Router();

router
  .route("/")
  .get(suppliers.findAll)
  .post(suppliers.create);

module.exports = router;
