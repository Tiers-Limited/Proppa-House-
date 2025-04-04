const Chat = require("../../models/Chat");
const { getIO } = require("../../utils/socket");

exports.sendMessage = async (req, res) => {
  try {
    const {
      senderId,
      receiverId,
      messageContent,
      jobType,
      referenceNumber,
      files,
      voiceURL,
      status,
    } = req.body;

    const roomId = [senderId, receiverId].sort().join("_");

    const newMessage = new Chat({
      messageContent,
      timeStamp: new Date(),
      jobType,
      referenceNumber,
      files,
      voiceURL,
      status,
      senderId,
      receiverId,
    });

    await newMessage.save();

    getIO().to(roomId).emit("messageReceived", newMessage);

    console.log(`New message sent to room ${roomId}:`, newMessage);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};
