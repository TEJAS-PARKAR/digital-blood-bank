const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose")

const app = express(); // Initialize Express

// Connect to Database
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Database Connected"))
.catch(err => console.log("Database Error:", err))

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Test Route
app.get("/", (req, res) => {
  res.send("Blood Bank API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

