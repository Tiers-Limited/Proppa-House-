const express = require("express");
const router = express.Router();
const Controller = require("../../../controllers/Auth/Signup/JobListingRegistration");

router.post("/register", Controller.registerForJobListing);
router.get("/successHandler", Controller.stripeSuccessHandler);

module.exports = router;
