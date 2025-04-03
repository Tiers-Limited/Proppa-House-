const express = require("express");
const router = express.Router();
const Controller = require("../../../controllers/Auth/Login/Login");

router.post("/", Controller.Login);

module.exports = router;
