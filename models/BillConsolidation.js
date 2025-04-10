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

const BillsConsolidationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
    },
    address: AddressSchema,
    estateAgentName: {
      type: String,
      required: true,
    },
    tenancyStartDate: {
      type: Date,
      required: true,
    },
    baselinePackage: {
      type: [String],
      required: true,
    },
    additionalBills: {
      type: Map,
      of: String,
      default: {},
    },
    consolidationStartDate: {
      type: Date,
      required: true,
    },
    requireAssistance: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BillsConsolidation", BillsConsolidationSchema);
