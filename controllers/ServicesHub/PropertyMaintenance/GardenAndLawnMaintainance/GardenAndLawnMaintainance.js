const GardenLawnService = require("../../../../models/GardenLawnService");

exports.submitGardenLawnService = async (req, res) => {
  try {
    const service = new GardenLawnService(req.body);
    await service.save();
    res
      .status(201)
      .json({ message: "Garden & Lawn Service Submitted", data: service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
