const BillsConsolidation = require("../../../models/BillConsolidation");

exports.submitBillsConsolidation = async (req, res) => {
  try {
    const data = new BillsConsolidation(req.body);
    await data.save();
    res
      .status(201)
      .json({ message: "Bills Consolidation request submitted", data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting request", error: error.message });
  }
};
