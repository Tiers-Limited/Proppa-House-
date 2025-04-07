const express = require("express");
const router = express.Router();
const Controller = require("../../../controllers/Auth/Signup/RegisterForRole");

router.post("/", Controller.registerForRole);

module.exports = router;
