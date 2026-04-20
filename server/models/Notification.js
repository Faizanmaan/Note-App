const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    noteId: {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
    message: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ["shared", "edited", "locked", "removed"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
