const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },

  bloodGroup: {
    type: String,
    required: true
  },

  hospital: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  contact: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "fulfilled"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Request", requestSchema);