const express = require("express");
const router = express.Router();
const {
  googleAuth,
  googleAuthCallback,
} = require("../../../controllers/Auth/Login/Google");

router.get("/", googleAuth);
router.get("/callback", googleAuthCallback);

module.exports = router;
