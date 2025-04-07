const UserProfile = require("../../../models/UserProfile");
const User = require("../../../models/Users");
const crypto = require("crypto");

exports.registerForRole = async (req, res) => {
  try {
    const {
      email,
      password,
      phoneNumber,
      gender,
      dob,
      firstName,
      lastName,
      profilePicture,
      experienceLevel,
      availability,
      role,
      cv,
    } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      user = new User({
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        phoneNumber,
        gender,
        dob,
      });

      await user.save();
    } else {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const alreadyRegistered = await UserProfile.findOne({ userId: user._id });
    if (alreadyRegistered) {
      return res
        .status(400)
        .json({ message: "User already registered for a role" });
    }

    const registration = new UserProfile({
      userId: user._id,
      firstName,
      lastName,
      profilePicture,
      experienceLevel,
      availability,
      role,
      cv,
    });

    await registration.save();

    return res.status(201).json({
      message: "User and role registration successful",
      registration,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
