const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    street1: String,
    street2: String,
    street3: String,
    city: String,
    postCode: String,
    country: String,
  },
  { _id: false }
);

const RepairServiceSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: ["OneTime", "Subscription"],
      required: true,
    },

    // Personal Details
    fullName: String,
    phoneNumber: String,
    email: String,

    propertyAddress: AddressSchema,
    serviceAddress: AddressSchema,

    // Service Details
    serviceDetails: {
      plumbingAndWaterSystem: Object,
      electricalAndLighting: Object,
      structuralRepair: Object,
      heatingCoolingSystem: Object,
      appliancesAndFixtures: Object,
    },

    // For One-Time
    repairConditionUrgency: {
      urgencyLevel: String,
      issue: String,
      troubleshoot: String,
    },

    availability: {
      serviceDate: Date,
      timeSlot: {
        type: String,
        enum: ["Morning", "Afternoon", "Evening"],
      },
      callRequested: Boolean,
      parkingAvailable: Boolean,
      accessInstructions: String,
    },

    urgencyPriority: {
      priorityType: String,
    },

    repairFollowUp: Boolean,

    // Subscription-specific
    subscriptionPlan: {
      type: String,
      enum: ["Monthly", "Quarterly", "Bianually", "Anually"],
    },
    propertyMaintenanceNeeds: {
      propertyType: String,
      areasNeedingAttention: Object,
      recurringIssues: String,
    },
    paymentSubscription: {
      autoRenewal: Boolean,
      paymentMethod: String,
    },

    files: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("RepairService", RepairServiceSchema);
