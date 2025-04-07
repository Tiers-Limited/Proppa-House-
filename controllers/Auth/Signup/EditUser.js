const User = require("../../../models/Users");

exports.EditUser = async (req, res) => {
  const { userId } = req.params;
  const { phoneNumber, gender, dob } = req.body;

  try {
    if (!phoneNumber && !gender && !dob) {
      return res.status(400).json({
        message:
          "At least one field (phoneNumber, gender, or dob) must be provided.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (gender !== undefined) user.gender = gender;
    if (dob !== undefined) user.dob = dob;
    // Save the updated user
    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
