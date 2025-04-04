const express = require("express");
const Controller = require("../../controllers/Report/Report");

const router = express.Router();

router.post("/add", Controller.addReport);

module.exports = router;
