const Branch = require("../../../../models/Branch");

exports.addBranch = async (req, res) => {
  try {
    const { branchName, city, country, contact, branchImage } = req.body;

    const newBranch = new Branch({
      branchName,
      city,
      country,
      contact,
      branchImage,
    });

    await newBranch.save();

    res
      .status(201)
      .json({ message: "Branch added successfully", branch: newBranch });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding branch", error: err.message });
  }
};

exports.editBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { branchName, city, country, contact, branchImage } = req.body;

    const updatedBranch = await Branch.findByIdAndUpdate(
      id,
      { branchName, city, country, contact, branchImage },
      { new: true }
    );

    if (!updatedBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json({ message: "Branch updated", branch: updatedBranch });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating branch", error: err.message });
  }
};

exports.deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBranch = await Branch.findByIdAndDelete(id);
    if (!deletedBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json({ message: "Branch deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting branch", error: err.message });
  }
};

exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 });
    res.status(200).json({ branches });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching branches", error: err.message });
  }
};
