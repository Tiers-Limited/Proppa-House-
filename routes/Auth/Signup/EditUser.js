const express = require("express");
const router = express.Router();
const Controller = require("../../../controllers/Auth/Signup/EditUser");

router.put("/:userId", Controller.EditUser);

module.exports = router;
