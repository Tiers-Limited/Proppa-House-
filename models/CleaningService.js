const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  street1: String,
  street2: String,
  street3: String,
  city: String,
  postCode: String,
  country: String,
});

const AreaSchema = new mongoose.Schema({
  category: String, // e.g., "Apartment & houses", "Office"
  areas: [
    {
      areaType: String,
      amount: String,
      area: String,
    },
  ],
});

const CleaningServiceSchema = new mongoose.Schema(
  {
    fullName: String,
    phoneNumber: String,
    email: String,
    address: AddressSchema,
    typeOfCleaning: String,
    propertyType: String,
    specificAreasToClean: [AreaSchema],
    additionalPropertyDetails: [{}],
    locationAndAvailability: [{}],
    serviceAddress: String,
    preferredCleaningDate: Date,
    preferredTimeSlot: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening"],
    },
    willBePresentDuringCleaning: Boolean,
    isParkingAvailable: Boolean,
    specialInstruction: String,
    conditionAndSpecialRequests: [{}],
    currentSituationDescription: String,
    specificAreaOrItem: String,
    havePets: Boolean,
    additionalRequest: {
      type: String,
      default: null,
    },
    urgencyAndPriority: [{}],
    urgencyOfServiceRequest: String,
    files: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CleaningService", CleaningServiceSchema);
