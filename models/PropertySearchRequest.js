const mongoose = require("mongoose");

const PropertySearchRequestSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    preferredContactMethod: {
      type: String,
      enum: ["Call", "Whatsapp", "Email"],
      required: true,
    },

    propertyPreferences: [
      {
        propertyType: { type: String },
        numBedrooms: { type: Number },
        numBathrooms: { type: Number },
        furnished: { type: Boolean },
        parkingRequired: { type: String },
        petFriendly: { type: String },
      },
    ],

    locationAndBudget: [
      {
        country: { type: String },
        city: { type: String },
        townOrArea: { type: String },
        budget: { type: Number },
        moveInDate: { type: Date },
        minimumLeaseTerm: {
          type: String,
          enum: ["6 Months", "12 Months", "Flexible"],
        },
        additionalPreferences: [String],
        specificRequirements: { type: String, maxlength: 2500 },
      },
    ],

    moveInAssistance: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Unpaid", "Paid", "Completed"],
      default: "Unpaid",
    },

    stripeSessionId: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PropertySearchRequest",
  PropertySearchRequestSchema
);
