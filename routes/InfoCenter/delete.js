const express = require("express");
const router = express.Router();
const PHInfoController = require("../../controllers/InfoCenter/delete");

router.delete("/course/:courseId", PHInfoController.deleteCourse);
router.delete(
  "/course/:courseId/module/:moduleId",
  PHInfoController.deleteModule
);
router.delete(
  "/course/:courseId/module/:moduleId/quiz/:quizId",
  PHInfoController.deleteQuiz
);

module.exports = router;
