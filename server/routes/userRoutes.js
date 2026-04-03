const express = require("express");
const router = express.Router();

const {
  registerUser,
  getDonorsByBloodGroup,
  getAllDonors,
  updateUser
} = require("../controllers/userController");

const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.put("/update", authenticateToken, updateUser);

router.get("/donors", getAllDonors);

router.get("/blood/:group", getDonorsByBloodGroup);

module.exports = router;