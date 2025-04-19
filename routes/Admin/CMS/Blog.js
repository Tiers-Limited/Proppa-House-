const express = require("express");
const Controller = require("../../../controllers/Admin/CMS/Blog");

const router = express.Router();

router.post("/add", Controller.createBlog);
router.put("/update/:id", Controller.updateBlog);
router.delete("/delete/:id", Controller.deleteBlog);
router.get("/get", Controller.getBlogs);
router.get("/get/:id", Controller.getBlogById);

module.exports = router;
