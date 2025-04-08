const express = require("express");
const Controller = require("../../../../controllers/ServicesHub/PropertyMaintenance/GardenAndLawnMaintainance/GardenAndLawnMaintainance");
const router = express.Router();

router.post("/add", Controller.submitGardenLawnService);

module.exports = router;
