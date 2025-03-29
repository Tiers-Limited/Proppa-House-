const PHInfoCenter = require("../../models/PH_Info_Center");

// ✅ Delete an Existing Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const deletedCourse = await PHInfoCenter.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ message: "Course deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a Specific Module in a Course
exports.deleteModule = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;

    const course = await PHInfoCenter.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const moduleIndex = course.modules.findIndex(
      (module) => module._id.toString() === moduleId
    );
    if (moduleIndex === -1) {
      return res.status(404).json({ message: "Module not found" });
    }

    course.modules.splice(moduleIndex, 1);
    await course.save();

    return res.status(200).json({ message: "Module deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a Quiz in a Specific Module of a Course
exports.deleteQuiz = async (req, res) => {
  try {
    const { courseId, moduleId, quizId } = req.params;

    const course = await PHInfoCenter.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const quizIndex = module.quiz.findIndex(
      (quiz) => quiz._id.toString() === quizId
    );
    if (quizIndex === -1) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    module.quiz.splice(quizIndex, 1);
    await course.save();

    return res.status(200).json({ message: "Quiz deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
