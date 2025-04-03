const express = require("express");
const router = express.Router();
const Controller = require("../../../controllers/Contact/Email/Email");

router.post("/", Controller.submitContactForm);

module.exports = router;
