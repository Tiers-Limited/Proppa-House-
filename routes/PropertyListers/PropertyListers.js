const express = require("express");
const Controller = require("../../controllers/PropertyListers/PropertyListers");

const router = express.Router();

router.post("/add", Controller.addProperty);
router.put("/update/:id", Controller.updateProperty);
router.delete("/delete/:id", Controller.deleteProperty);
router.post("/duplicate/:id", Controller.duplicateProperty);
router.put("/toggle/:id", Controller.acceptOrRejectProperty);

module.exports = router;
