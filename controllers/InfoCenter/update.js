const PHInfoCenter = require("../../models/PH_Info_Center");

// ✅ Update an Existing Course
exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { courseName, tagline, level, modules } = req.body;

    const updatedCourse = await PHInfoCenter.findByIdAndUpdate(
      courseId,
      { courseName, tagline, level, modules },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res
      .status(200)
      .json({ message: "Course updated successfully!", course: updatedCourse });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Update a Specific Module in a Course
exports.updateModule = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { name, type, time, content, quiz } = req.body;

    const course = await PHInfoCenter.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    module.name = name || module.name;
    module.type = type || module.type;
    module.time = time || module.time;
    module.content = content || module.content;
    module.quiz = quiz || module.quiz;

    await course.save();

    return res
      .status(200)
      .json({ message: "Module updated successfully!", course });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Update a Quiz in a Specific Module of a Course
exports.updateQuiz = async (req, res) => {
  try {
    const { courseId, moduleId, quizId } = req.params;
    const { question, choices, correctAnswers } = req.body;

    const course = await PHInfoCenter.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const quiz = module.quiz.id(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.question = question || quiz.question;
    quiz.choices = choices || quiz.choices;
    quiz.correctAnswers = correctAnswers || quiz.correctAnswers;

    await course.save();

    return res
      .status(200)
      .json({ message: "Quiz updated successfully!", course });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
