const express = require("express");
const Controller = require("../../../../controllers/Admin/CMS/PageManagement/Countries");

const router = express.Router();

router.post("/add", Controller.addCountry);
router.put("/update/:id", Controller.updateCountry);
router.delete("/delete/:id", Controller.deleteCountry);
router.get("/get", Controller.getAllCountries);

module.exports = router;
