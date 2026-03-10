const express = require("express");
const router = express.Router();

const {
  registerUser,
  getDonorsByBloodGroup
} = require("../controllers/userController");

router.post("/register", registerUser);

router.get("/blood/:group", getDonorsByBloodGroup);

module.exports = router;