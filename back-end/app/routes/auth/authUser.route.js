const express = require("express");
const authUser = require("../../controllers/auth/authUser.controller");
const passport = require("passport");
const config = require("../../config/index");
const router = express.Router();
require("../../passport");
const jwt = require("../../middlewares/jwt.middleware");

router.route("/").post(authUser.login);
router.route("/createOTP").post(authUser.createOTP);
router.route("/signUp/verifyOTP").post(authUser.signUpVerify);
router
  .route("/checkRole")
  .get(jwt.authenticateTokenFromHeader, authUser.checkRole);
router
  .route("/refreshToken")
  .post(jwt.authenticateTokenFromHeader, authUser.refreshToken);

///////////////
// router.route("/facebook").get(
//   passport.authenticate("facebook", {
//     scope: ["email","user_birthday", "user_gender"],
//     session: false,
//   })
// );

// router.route("/facebook/callback").get(
//   (req, res, next) => {
//     passport.authenticate("facebook", (err, profile) => {
//       req.user = profile;
//       console.log(req.user);
//       next();
//     })(req, res, next);
//   },
//   (req, res) => {
//     res.redirect(`${config.viteApp.viteURL}/login-success/${req.user?.token}`);
//   }
// );
module.exports = router;
