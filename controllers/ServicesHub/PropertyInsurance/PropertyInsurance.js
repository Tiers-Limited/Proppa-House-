const PropertyInsurance = require("../../../models/PropertyInsurance");

exports.submitPropertyInsurance = async (req, res) => {
  try {
    const insurance = new PropertyInsurance(req.body);
    await insurance.save();
    res
      .status(201)
      .json({
        message: "Property Insurance Request Submitted",
        data: insurance,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
