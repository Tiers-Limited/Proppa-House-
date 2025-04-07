const express = require("express");
const Controller = require("../../../controllers/ServicesHub/PropertyViewing/PropertyViewing");
const router = express.Router();

router.post("/add", Controller.createViewingRequest);
router.get("/stripeSuccessHandler", Controller.handleStripeSuccess);

module.exports = router;
