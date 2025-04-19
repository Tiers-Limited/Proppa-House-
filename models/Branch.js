const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    branchImage: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", BranchSchema);
