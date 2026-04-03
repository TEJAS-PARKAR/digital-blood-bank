const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, bloodGroup, phone, state, city, institutionName, role } = req.body;

    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    const user = new User({
      name: role === "recipient" ? institutionName : name,
      email,
      bloodGroup: role === "donor" ? bloodGroup : undefined,
      phone,
      state,
      city,
      institutionName: role === "recipient" ? institutionName : undefined,
      role: role || "donor",
      isProfileComplete: true
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set token cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Clear googleProfile cookie
    res.clearCookie("googleProfile");

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration error",
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, bloodGroup, phone, state, city, institutionName, role } = req.body;
    const userId = req.user.id; // assuming auth middleware sets req.user

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        bloodGroup: role === "donor" ? bloodGroup : undefined,
        phone,
        state,
        city,
        institutionName: role === "recipient" ? institutionName : undefined,
        role,
        isProfileComplete: true
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message
    });
  }
};

exports.getDonorsByBloodGroup = async (req, res) => {
  try {

    const bloodGroup = req.params.group;

    const donors = await User.find({
      bloodGroup: bloodGroup,
      role: "donor"
    });

    res.status(200).json({
      success: true,
      count: donors.length,
      donors
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching donors",
      error: error.message
    });

  }
};

exports.getAllDonors = async (req, res) => {

  try {

    const donors = await User.find({ role: "donor" });

    res.status(200).json({
      success: true,
      count: donors.length,
      donors
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching donors",
      error: error.message
    });

  }

};