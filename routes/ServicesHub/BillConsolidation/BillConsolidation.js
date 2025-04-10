const express = require("express");
const Controller = require("../../../controllers/ServicesHub/BillConsolidation/BillConsolidation");
const router = express.Router();

router.post("/add", Controller.submitBillsConsolidation);

module.exports = router;
