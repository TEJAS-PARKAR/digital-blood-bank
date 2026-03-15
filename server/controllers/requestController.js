const Request = require("../models/Request");

exports.createRequest = async (req, res) => {
  try {

    const request = new Request(req.body);

    await request.save();

    res.status(201).json({
      success: true,
      message: "Blood request created successfully",
      request
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error creating request",
      error: error.message
    });

  }
};

exports.getAllRequests = async (req, res) => {

  try {

    const requests = await Request.find();

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching requests",
      error: error.message
    });

  }

};

exports.updateRequestStatus = async (req, res) => {

  try {

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "fulfilled" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Request marked as fulfilled",
      request
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error updating request",
      error: error.message
    });

  }

};