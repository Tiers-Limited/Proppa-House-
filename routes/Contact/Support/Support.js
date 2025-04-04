const express = require("express");
const router = express.Router();
const Controller = require("../../../controllers/Contact/Support/Support");

router.post("/", Controller.Support);

module.exports = router;
