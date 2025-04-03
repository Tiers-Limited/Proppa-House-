const express = require("express");
const router = express.Router();
const {
  facebookAuth,
  facebookAuthCallback,
} = require("../../../controllers/Auth/Login/Facebook");

router.get("/", facebookAuth);
router.get("/callback", facebookAuthCallback);

module.exports = router;
