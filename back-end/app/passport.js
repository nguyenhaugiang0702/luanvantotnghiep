require("dotenv").config();
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const userService = require("./services/user.service");
const moment = require("moment");
const jwt = require("jsonwebtoken");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/api/v1/auth/facebook/callback",
      profileFields: [
        "id",
        "displayName",
        "photos",
        "email",
        "gender",
        "birthday",
        "name",
      ],
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        if (profile?.id) {
          const birthday = profile?._json?.birthday; // Ngày sinh nhận từ Facebook, ví dụ '07/20/2002'
          const formattedBirthday = moment(birthday, "MM/DD/YYYY").format(
            "DD/MM/YYYY"
          );
          const userData = {
            email: profile?.emails[0]?.value,
            firstName: profile?._json?.first_name,
            lastName: profile?._json?.last_name,
            gender: profile?.gender,
            image: profile?.photos[0]?.value,
            dob: formattedBirthday,
            phoneNumber: "0384804447",
            password: "nhg4563ywh",
            typeLogin: profile.provider,
          };
          const user = await userService.createUser(userData);
          console.log("User created:", user);
          const token = jwt.sign({ _id: user._id }, "your_jwt_secret_key", {
            expiresIn: "6h",
          });
          await userService.updateUser(user._id, { accessToken: token });

          profile.token = token;
        }
      } catch (error) {}
      return cb(null, profile);
    }
  )
);
