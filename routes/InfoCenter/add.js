const express = require("express");
const router = express.Router();
const PHInfoController = require("../../controllers/InfoCenter/add");

router.post("/course", PHInfoController.addCourse);
router.post("/module/:courseId", PHInfoController.addModule);
router.post("/quiz/:courseId/:moduleId", PHInfoController.addQuiz);

module.exports = router;
