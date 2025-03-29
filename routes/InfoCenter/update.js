const express = require("express");
const router = express.Router();
const PHInfoController = require("../../controllers/InfoCenter/update");

router.put("/course/:courseId", PHInfoController.updateCourse);
router.put("/course/:courseId/module/:moduleId", PHInfoController.updateModule);
router.put(
  "/course/:courseId/module/:moduleId/quiz/:quizId",
  PHInfoController.updateQuiz
);

module.exports = router;
