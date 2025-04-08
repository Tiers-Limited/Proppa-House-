const mongoose = require("mongoose");

const GardenLawnServiceSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: ["OneTime", "Subscription"],
      required: true,
    },
    personalDetails: {
      fullName: String,
      email: String,
      phoneNumber: String,
      street1: String,
      street2: String,
      street3: String,
      city: String,
      postCode: String,
      country: String,
    },
    subscriptionPlan: {
      type: String,
      enum: ["Monthly", "Quarterly", "Biannually", "Annually"],
      required: function () {
        return this.serviceType === "Subscription";
      },
    },
    serviceDetails: {
      serviceRequired: String,
      lawnSize: String,
      gardenArea: String,
      additionalRequirements: String,
    },
    propertyDetails: {
      propertyType: String,
      description: String,
    },
    locationAvailability: {
      serviceAddress: {
        street1: String,
        street2: String,
        street3: String,
        city: String,
        postCode: String,
        country: String,
      },
      serviceDate: Date, // for OneTime
      preferredDates: [Date], // for Subscription
      timeSlot: String,
      callRequested: Boolean,
    },
    urgencyPriority: {
      priorityType: String,
    },
    specialInstructions: {
      currentCondition: String,
      text: String,
    },
    files: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("GardenLawnService", GardenLawnServiceSchema);
