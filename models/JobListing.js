const mongoose = require("mongoose");

const JobListingSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true },
    address: { type: String },
    postalCode: { type: String },
    role: { type: String, required: true },
    status: { type: String, default: "Inactive" },

    companyName: { type: String, default: null },
    companyRegistrationCode: { type: String, default: null },
    position: { type: String, default: null },

    landlordDetails: {
      type: [String],
      default: undefined,
    },

    propertyOwnerDetails: {
      type: [String],
      default: undefined,
    },

    listingPackage: { type: String, required: true },
    stripeSessionId: { type: String, default: null },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const JobListing = mongoose.model("JobListing", JobListingSchema);
module.exports = JobListing;
