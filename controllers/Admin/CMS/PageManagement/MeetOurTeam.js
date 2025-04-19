const TeamMember = require("../../../../models/TeamMember");

exports.addTeamMember = async (req, res) => {
  try {
    const { fullName, role, bio, profileImage } = req.body;

    const newMember = new TeamMember({ fullName, role, bio, profileImage });
    await newMember.save();

    res.status(201).json({ message: "Team member added", member: newMember });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding member", error: err.message });
  }
};

exports.editTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, role, bio, profileImage } = req.body;

    const updatedMember = await TeamMember.findByIdAndUpdate(
      id,
      { fullName, role, bio, profileImage },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.status(200).json({ message: "Member updated", member: updatedMember });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating member", error: err.message });
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await TeamMember.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.status(200).json({ message: "Member deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting member", error: err.message });
  }
};

exports.getAllTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ createdAt: -1 });
    res.status(200).json({ members });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching team members", error: err.message });
  }
};
