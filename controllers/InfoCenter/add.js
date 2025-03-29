const PHInfoCenter = require("../../models/PH_Info_Center");

// ✅ Add a New Course
exports.addCourse = async (req, res) => {
  try {
    const { courseName, tagline, level, modules } = req.body;

    const newCourse = new PHInfoCenter({
      courseName,
      tagline,
      level,
      modules, // Modules can be optional
    });

    await newCourse.save();
    return res
      .status(201)
      .json({ message: "Course added successfully!", course: newCourse });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Add a Single Module to an Existing Course
exports.addModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name, type, time, content, quiz } = req.body;

    const course = await PHInfoCenter.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const newModule = { name, type, time, content, quiz };

    course.modules.push(newModule);
    await course.save();

    return res
      .status(200)
      .json({ message: "Module added successfully!", course });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Add Quiz tto an Existing Module in a Specific Course
exports.addQuiz = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { question, choices, correctAnswers } = req.body;

    const course = await PHInfoCenter.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const newQuiz = { question, choices, correctAnswers };
    module.quiz.push(newQuiz);

    await course.save();

    return res
      .status(200)
      .json({ message: "Quiz added successfully!", course });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
