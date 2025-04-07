const express = require("express");
const Controller = require("../../../controllers/ServicesHub/PropertySearch/PropertySearch");
const router = express.Router();

router.post("/add", Controller.submitPropertySearch);
router.get("/stripeSuccessHandler", Controller.handleStripeSuccess);

module.exports = router;
