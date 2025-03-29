const express = require("express");
const router = express.Router();
const PHInfoController = require("../../controllers/InfoCenter/get");

router.get("/courses", PHInfoController.getAllCourses);
router.get("/course/:courseId", PHInfoController.getCourseById);

module.exports = router;
