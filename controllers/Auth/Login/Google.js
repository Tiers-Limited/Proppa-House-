const passport = require("passport");

exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleAuthCallback = (req, res) => {
  passport.authenticate("google", { session: false }, (err, data) => {
    if (err || !data) {
      return res.status(400).json({ error: "Google authentication failed" });
    }

    return res.status(200).json({
      message: "Google SignUp successful",
      user: data.user,
      token: data.token,
    });
  })(req, res);
};
