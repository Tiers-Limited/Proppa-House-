const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.facebookAuth = (req, res, next) => {
  passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
};

exports.facebookAuthCallback = (req, res, next) => {
  passport.authenticate("facebook", { session: false }, (err, user, token) => {
    if (err || !user) {
      return res
        .status(500)
        .json({ message: "Facebook authentication failed", error: err });
    }

    return res.status(200).json({
      message: "Login successful!",
      user,
      token,
    });
  })(req, res, next);
};
