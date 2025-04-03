const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/Users");
const jwt = require("jsonwebtoken");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "emails", "name", "picture"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        console.log("Facebook Profile", profile);
        console.log("Facebook Access Token", accessToken);
        console.log("Facebook Refresh Token", refreshToken);

        if (!user) {
          user = new User({
            name: profile.name.givenName + " " + profile.name.familyName,
            email: profile.emails[0].value,
            password: "",
          });
          await user.save();
        }

        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "7d",
          }
        );

        return done(null, user, token);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
