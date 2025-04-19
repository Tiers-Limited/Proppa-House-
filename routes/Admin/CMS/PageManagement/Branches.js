const express = require("express");
const Controller = require("../../../../controllers/Admin/CMS/PageManagement/Branches");

const router = express.Router();

router.post("/add", Controller.addBranch);
router.put("/update/:id", Controller.editBranch);
router.delete("/delete/:id", Controller.deleteBranch);
router.get("/get", Controller.getAllBranches);

module.exports = router;
