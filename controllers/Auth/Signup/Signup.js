const User = require("../../../models/Users");
const crypto = require("crypto");

exports.Signup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, gender, dob } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password using SHA-256
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // Create new user with optional fields
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber || null,
      gender: gender || null,
      dob: dob || null,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully!",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
