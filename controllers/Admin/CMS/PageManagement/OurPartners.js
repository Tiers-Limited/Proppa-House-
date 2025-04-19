const Partner = require("../../../../models/Partner");

exports.addPartner = async (req, res) => {
  try {
    const { organizationName, logo, websiteUrl } = req.body;

    const newPartner = new Partner({ organizationName, logo, websiteUrl });
    await newPartner.save();

    res
      .status(201)
      .json({ message: "Partner added successfully", partner: newPartner });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding partner", error: err.message });
  }
};

exports.editPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationName, logo, websiteUrl } = req.body;

    const updatedPartner = await Partner.findByIdAndUpdate(
      id,
      { organizationName, logo, websiteUrl },
      { new: true }
    );

    if (!updatedPartner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res
      .status(200)
      .json({ message: "Partner updated", partner: updatedPartner });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating partner", error: err.message });
  }
};

exports.deletePartner = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Partner.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.status(200).json({ message: "Partner deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting partner", error: err.message });
  }
};

exports.getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.status(200).json({ partners });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching partners", error: err.message });
  }
};
