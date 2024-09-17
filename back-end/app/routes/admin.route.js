const express = require("express");
const auth = require("../controllers/auth.controller");
const config = require("../config/index");
const router = express.Router();
const authenticateToken = require("../middlewares/jwt.middleware");

router.route("/").post(auth.login);

module.exports = router;


