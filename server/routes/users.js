const express = require("express");
const Users = require("../models/auth");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

router.get("/all", verifyToken, async (req, res) => {
  try {
    const users = await Users.find({ _id: { $ne: req.uid }, status: "active" }).select("name email _id uid");
    return res.status(200).json({ users, isError: false });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", isError: true });
  }
});

module.exports = router;
