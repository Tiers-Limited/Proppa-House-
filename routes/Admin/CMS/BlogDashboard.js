const express = require("express");
const Controller = require("../../../controllers/Admin/CMS/BlogDashboard");

const router = express.Router();

router.get("/get/scheduledBlogs", Controller.getScheduledBlogs);
router.get("/get/recentBlogs", Controller.getRecentBlogs);

module.exports = router;
