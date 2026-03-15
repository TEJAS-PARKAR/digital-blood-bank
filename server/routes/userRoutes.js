const express = require("express");
const router = express.Router();

const {
  registerUser,
  getDonorsByBloodGroup,
  getAllDonors
} = require("../controllers/userController");

router.post("/register", registerUser);

router.get("/donors", getAllDonors);

router.get("/blood/:group", getDonorsByBloodGroup);

module.exports = router;