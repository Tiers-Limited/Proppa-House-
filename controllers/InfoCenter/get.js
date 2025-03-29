const PHInfoCenter = require("../../models/PH_Info_Center");

// ✅ Get All Courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await PHInfoCenter.find();
    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Get a Single Course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await PHInfoCenter.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ course });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
