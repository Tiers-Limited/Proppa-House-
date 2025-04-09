const express = require("express");
const Controller = require("../../../controllers/ServicesHub/PropertyInsurance/PropertyInsurance");
const router = express.Router();

router.post("/add", Controller.submitPropertyInsurance);

module.exports = router;
