const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    const { name, bloodGroup, phone, city, role } = req.body;

    const user = new User({
      name,
      bloodGroup,
      phone,
      city,
      role
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message
    });

  }
};