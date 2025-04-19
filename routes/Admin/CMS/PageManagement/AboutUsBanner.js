const express = require("express");
const Controller = require("../../../../controllers/Admin/CMS/PageManagement/AboutUsBanner");

const router = express.Router();

router.post("/add", Controller.addBanner);
router.put("/update/:id", Controller.editBanner);
router.delete("/delete/:id", Controller.deleteBanner);
router.get("/get", Controller.getBanners);

module.exports = router;
