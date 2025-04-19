const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema(
  {
    countryName: {
      type: String,
      required: true,
    },
    flagIcon: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Coming Soon",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Country", CountrySchema);
