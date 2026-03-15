const User = require("../models/User");

exports.loginUser = async (req, res) => {

  try {

    const { phone } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Login error",
      error: error.message
    });

  }

};