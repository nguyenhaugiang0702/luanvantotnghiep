const express = require("express");
const authUser = require("../../controllers/auth/authUser.controller");
const passport = require("passport");
const config = require("../../config/index");
const router = express.Router();
require("../../passport");
const jwt = require("../../middlewares/jwt.middleware");
const validation = require("../../middlewares/validateUser.middelware");

router.route("/login").post(validation.loginUserValidation, authUser.login); // Đăng nhập (validated)
router
  .route("/register") 
  .post(validation.registerUserValidation, authUser.register); // Đăng ký (validated)
router
  .route("/forgotPassword") 
  .post(validation.forgotPasswordValidation, authUser.forgotPassword); // Quên mật khẩu (validated)
router.route("/createOTP").post(authUser.createOTP); // Tạo OTP
router.route("/register/verifyOTP").post(authUser.verifyOTP); // Xác thực OTP (validated)
router
  .route("/checkRole")
  .get(jwt.authenticateTokenFromHeader, authUser.checkRole); // Check Role
router
  .route("/refreshToken")
  .post(jwt.authenticateTokenFromHeader, authUser.refreshToken); // RefreshToken

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
