const express = require("express");
const Controller = require("../../../controllers/ServicesHub/RepairService/RepairService");
const router = express.Router();

router.post("/add", Controller.submitRepairService);

module.exports = router;
