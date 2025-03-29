const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  choices: { type: [String], required: true },
  correctAnswers: { type: [String], required: true },
});

const ModuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  time: { type: String, required: true },
  content: {
    htmlCode: { type: String, default: "" },
    files: { type: [String], default: [] },
  },
  quiz: { type: [QuizSchema], default: [] },
});

const PHInfoCenterSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    tagline: { type: String, required: false },
    level: { type: String, required: false },
    modules: { type: [ModuleSchema], default: [] },
  },
  { timestamps: true }
);

const PHInfoCenter = mongoose.model("PH_Info_Center", PHInfoCenterSchema);

module.exports = PHInfoCenter;
