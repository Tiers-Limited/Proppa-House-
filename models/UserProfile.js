const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    experienceLevel: {
      type: String,
      default: null,
    },
    availability: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    cv: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", UserProfileSchema);
