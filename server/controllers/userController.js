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