const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    messageContent: {
      type: String,
      required: true,
    },
    timeStamp: {
      type: Date,
      default: Date.now,
    },
    jobType: {
      type: String,
      required: true,
    },
    referenceNumber: {
      type: String,
      required: true,
    },
    files: {
      type: [String],
      default: [],
    },
    voiceURL: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["Sent", "Delivered", "Read"],
      default: "Sent",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
