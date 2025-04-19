const mongoose = require("mongoose");

const AboutUsBannerSchema = new mongoose.Schema(
  {
    banner: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutUsBanner", AboutUsBannerSchema);
