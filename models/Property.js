const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    basicInfo: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      propertyType: { type: String, required: true },
      location: { type: String, required: true },
    },
    priceSection: {
      price: { type: Number, required: true },
      note: { type: String, default: null },
    },
    mediaUploads: {
      photos: [String],
      floorplans: [String],
      videos: [String],
    },
    propertyDetails: {
      bedrooms: { type: Number, required: true },
      bathrooms: { type: Number, required: true },
      amenities: [String],
      utilitiesIncluded: {
        type: Map,
        of: String,
        default: {},
      },
    },
    propertyStatus: { type: String }, // e.g., "for rent", "for sale"
    listerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String }, // e.g., Draft, Published
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", PropertySchema);
