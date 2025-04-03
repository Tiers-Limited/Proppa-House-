const User = require("../../../models/Users");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the input password and compare with stored password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    return res.status(200).json({
      message: "Login successful!",
      user: { _id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
