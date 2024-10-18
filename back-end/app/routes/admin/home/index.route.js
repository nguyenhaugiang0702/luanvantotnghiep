const express = require("express");
const router = express.Router();
const home = require("../../../controllers/admin/home.controller");

router.route("/").get(home.findAll);

module.exports = router;
