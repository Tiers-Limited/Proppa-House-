const express = require("express");
const router = express.Router();
const {
  facebookAuth,
  facebookAuthCallback,
} = require("../../../controllers/Auth/Signup/Facebook");

router.get("/", facebookAuth);
router.get("/callback", facebookAuthCallback);

module.exports = router;
