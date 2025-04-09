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

const SecurityMeasuresSchema = new mongoose.Schema(
  {
    alarms: String,
    locks: String,
    cctv: String,
    other: String,
  },
  { _id: false }
);

const PropertyInsuranceSchema = new mongoose.Schema(
  {
    fullName: String,
    contactNumber: String,
    email: String,

    propertyAddress: AddressSchema,
    ownershipStatus: String,
    yearOfConstruction: String,
    propertyCondition: String,
    propertyUsage: String,
    hasFloodingExperience: Boolean,

    insurancePolicy: {
      type: String,
      enum: ["Property", "Rent"],
      required: true,
    },

    propertyDetails: {
      typeOfCoverage: String,
      estimatedRebuildCost: Number,
      contentValueToBeInsured: Number,
      securityMeasures: SecurityMeasuresSchema,
      accidentalDamageCover: Boolean,
    },

    rentDetails: {
      tenantType: String,
      tenantReferenceCompleted: Boolean,
      rentAgreementType: String,
      leaseLength: String,
      monthlyRentalIncome: Number,
      unpaidRentCoverageMonths: Number,
      includeLegalExpenseCover: Boolean,
    },

    additionalDetails: {
      startDate: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PropertyInsurance", PropertyInsuranceSchema);
