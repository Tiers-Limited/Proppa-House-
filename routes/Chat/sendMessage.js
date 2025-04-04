const express = require("express");
const Controller = require("../../controllers/Chat/sendMessage");

const router = express.Router();

router.post("/", Controller.sendMessage);

module.exports = router;
