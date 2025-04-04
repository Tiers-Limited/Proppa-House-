const express = require("express");
const Controller = require("../../controllers/Chat/get");

const router = express.Router();

router.get("/contacts/:userId", Controller.getContacts);
router.get("/chat/:senderId/:receiverId", Controller.getSpecificChat);

module.exports = router;
