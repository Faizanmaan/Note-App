const express = require("express");
const Notification = require("../models/Notification");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

router.get("/my-notifications", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.uid })
      .populate("sender", "name email")
      .sort({ createdAt: -1 })
      .limit(50);
    return res.status(200).json({ notifications, isError: false });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", isError: true });
  }
});

router.patch("/read/:id", verifyToken, async (req, res) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.uid }, { isRead: true });
    return res.status(200).json({ message: "Marked as read", isError: false });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", isError: true });
  }
});

module.exports = router;
