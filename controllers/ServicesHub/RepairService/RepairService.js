const RepairService = require("../../../models/RepairSerice");

exports.submitRepairService = async (req, res) => {
  try {
    const service = new RepairService(req.body);
    await service.save();
    res.status(201).json({
      message: "Repair Service Submitted Successfully",
      data: service,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
