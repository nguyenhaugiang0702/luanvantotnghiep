const express = require("express");
const auth = require("../controllers/auth.controller");
const passport = require("passport");
const config = require("../config/index");
const router = express.Router();
require("../passport");
const authenticateToken = require("../middlewares/jwt.middleware");

router.route("/").post(auth.login);
router.route("/createOTP").post(auth.createOTP);
router.route("/signUp/verifyOTP").post(auth.signUpVerify);
router
  .route("/sendEmailToActive/:token")
  .put(authenticateToken.authenticateTokenFromParams, auth.sendEmailToActive);

router.route("/facebook").get(
  passport.authenticate("facebook", {
    scope: ["email","user_birthday", "user_gender"],
    session: false,
  })
);

router.route("/facebook/callback").get(
  (req, res, next) => {
    passport.authenticate("facebook", (err, profile) => {
      req.user = profile;
      console.log(req.user);
      next();
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(`${config.viteApp.viteURL}/login-success/${req.user?.token}`);
  }
);
module.exports = router;
