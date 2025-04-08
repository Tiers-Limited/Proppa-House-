const express = require("express");
const Controller = require("../../../../controllers/ServicesHub/PropertyMaintenance/Cleaning Services/CleaningServiceRequest");
const router = express.Router();

router.post("/add", Controller.submitCleaningServiceRequest);

module.exports = router;
