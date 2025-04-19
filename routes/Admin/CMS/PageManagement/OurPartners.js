const express = require("express");
const Controller = require("../../../../controllers/Admin/CMS/PageManagement/OurPartners");

const router = express.Router();

router.post("/add/partner", Controller.addPartner);
router.put("/update/partner/:id", Controller.editPartner);
router.delete("/delete/partner/:id", Controller.deletePartner);
router.get("/get/partners", Controller.getAllPartners);

module.exports = router;
