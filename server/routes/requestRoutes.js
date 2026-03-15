const express = require("express");
const router = express.Router();

const {
  createRequest,
  getAllRequests,
  updateRequestStatus
} = require("../controllers/requestController");

router.post("/", createRequest);

router.get("/", getAllRequests);

router.put("/:id", updateRequestStatus);

module.exports = router;