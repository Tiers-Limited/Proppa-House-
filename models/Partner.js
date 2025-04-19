const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    websiteUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", PartnerSchema);
