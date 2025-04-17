const Property = require("../../models/Property");

// Add new property
exports.addProperty = async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
    });
    await property.save();
    res.status(201).json({ message: "Property added successfully", property });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add property", error: error.message });
  }
};

// Update property
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ message: "Property updated", property });
  } catch (error) {
    res.status(500).json({ message: "Failed to update", error: error.message });
  }
};

// Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const result = await Property.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete", error: error.message });
  }
};

exports.duplicateProperty = async (req, res) => {
  try {
    const original = await Property.findById(req.params.id);
    if (!original)
      return res.status(404).json({ message: "Original property not found" });

    const duplicatedData = original.toObject();
    delete duplicatedData._id;
    const duplicated = new Property(duplicatedData);
    await duplicated.save();

    res.status(201).json({ message: "Property duplicated", duplicated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to duplicate", error: error.message });
  }
};

exports.acceptOrRejectProperty = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({
      message: `Property has been ${status.toLowerCase()}`,
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update property status",
      error: error.message,
    });
  }
};
