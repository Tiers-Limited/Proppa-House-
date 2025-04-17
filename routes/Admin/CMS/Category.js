const express = require("express");
const Controller = require("../../../controllers/Admin/CMS/Category");

const router = express.Router();

router.post("/add", Controller.createCategory);
router.put("/update/:id", Controller.updateCategory);
router.delete("/delete/:id", Controller.deleteCategory);
router.get("/get/", Controller.getCategories);

module.exports = router;
