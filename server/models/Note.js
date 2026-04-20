const mongoose = require("mongoose");
const { Schema } = mongoose;

const sharingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    permission: {
      type: String,
      enum: ["viewer", "editor"],
      default: "viewer",
    },
  },
  { timestamps: true }
);

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    sharedWith: [sharingSchema],
    isLocked: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
      },
    ],
    isFavoriteBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
