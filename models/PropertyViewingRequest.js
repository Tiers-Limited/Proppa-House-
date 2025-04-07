const mongoose = require("mongoose");

const PropertyViewingRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    howFound: {
      type: String,
      enum: ["Online", "I know the address"],
      required: true,
    },

    // Online property
    url: { type: String, default: null },
    city: { type: String, default: null },
    postalCode: { type: String, default: null },

    // Known address fields
    street1: { type: String, default: null },
    street2: { type: String, default: null },
    street3: { type: String, default: null },
    country: { type: String, default: null },

    nameOfAgencyOrOwner: { type: String },
    contactDetails: { type: String },

    communicatedBefore: { type: Boolean, default: false },
    communicationExplanation: { type: String, default: null },

    hasConcerns: { type: Boolean, default: false },
    concernExplanation: { type: String, default: null },

    preferredLanguage: { type: String },
    requestEarlyInspection: { type: Boolean, default: false },
    preferredDate: { type: Date, default: null },

    wantsOtherCommunication: { type: Boolean, default: false },
    communicationEmail: { type: String, default: null },

    promoCode: { type: String, default: null },

    viewingPackage: { type: String, enum: ["Basic", "Pro"], required: true },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
    stripeSessionId: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PropertyViewingRequest",
  PropertyViewingRequestSchema
);
