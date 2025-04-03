const express = require("express");
const router = express.Router();
const Controller = require("../../../controllers/Auth/Signup/Signup");

router.post("/", Controller.Signup);

module.exports = router;
