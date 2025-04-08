const CleaningService = require("../../../../models/CleaningService");

exports.submitCleaningServiceRequest = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      email,
      address,
      typeOfCleaning,
      propertyType,
      specificAreasToClean,
      additionalPropertyDetails,
      locationAndAvailability,
      serviceAddress,
      preferredCleaningDate,
      preferredTimeSlot,
      willBePresentDuringCleaning,
      isParkingAvailable,
      specialInstruction,
      conditionAndSpecialRequests,
      currentSituationDescription,
      specificAreaOrItem,
      havePets,
      additionalRequest,
      urgencyAndPriority,
      urgencyOfServiceRequest,
      files,
    } = req.body;

    const newRequest = new CleaningService({
      fullName,
      phoneNumber,
      email,
      address,
      typeOfCleaning,
      propertyType,
      specificAreasToClean,
      additionalPropertyDetails,
      locationAndAvailability,
      serviceAddress,
      preferredCleaningDate,
      preferredTimeSlot,
      willBePresentDuringCleaning,
      isParkingAvailable,
      specialInstruction,
      conditionAndSpecialRequests,
      currentSituationDescription,
      specificAreaOrItem,
      havePets,
      additionalRequest,
      urgencyAndPriority,
      urgencyOfServiceRequest,
      files,
    });

    await newRequest.save();

    return res.status(201).json({
      message: "Cleaning service request submitted successfully",
      request: newRequest,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
