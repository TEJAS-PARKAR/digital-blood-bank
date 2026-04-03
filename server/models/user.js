const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  bloodGroup: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true,
    unique: true,
    sparse: true
  },

  state: {
    type: String
  },

  district: {
    type: String
  },

  city: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["donor", "recipient", "admin"],
    default: "donor"
  },

  institutionName: {
    type: String
  },

  isProfileComplete: {
    type: Boolean,
    default: false
  }}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);