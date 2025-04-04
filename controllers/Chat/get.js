const Chat = require("../../models/Chat");
const User = require("../../models/Users");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const formatRelativeTime = (date) => {
  return dayjs(date).fromNow();
};

exports.getContacts = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }

    const messages = await Chat.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ timeStamp: -1 });

    const contactsMap = new Map();

    messages.forEach((msg) => {
      let contactId;
      if (msg.senderId.toString() === userId) {
        contactId = msg.receiverId.toString();
      } else {
        contactId = msg.senderId.toString();
      }

      if (!contactsMap.has(contactId)) {
        contactsMap.set(contactId, {
          lastMessage: msg.messageContent,
          lastMessageTimeStamp: msg.timeStamp,
          unreadMessageCount: 0,
          jobType: msg.jobType,
          referenceNumber: msg.referenceNumber,
        });
      }

      const current = contactsMap.get(contactId);
      if (msg.timeStamp > current.lastMessageTimeStamp) {
        current.lastMessage = msg.messageContent;
        current.lastMessageTimeStamp = msg.timeStamp;
        current.jobType = msg.jobType;
        current.referenceNumber = msg.referenceNumber;
      }

      if (msg.receiverId.toString() === userId && msg.status !== "Read") {
        current.unreadMessageCount = (current.unreadMessageCount || 0) + 1;
      }
      contactsMap.set(contactId, current);
    });

    const contactIds = Array.from(contactsMap.keys());

    const users = await User.find({ _id: { $in: contactIds } });

    let contacts = users.map((user) => {
      const contactData = contactsMap.get(user._id.toString());

      const lastMessageTimeFormatted = formatRelativeTime(
        contactData.lastMessageTimeStamp
      );

      let isOnline = "Offline";
      if (user.online) {
        isOnline = "Online";
      } else if (user.lastSeen) {
        isOnline = formatRelativeTime(user.lastSeen);
      }

      return {
        userId: user._id,
        name: user.name,
        profilePic: user.profilePic || "",
        jobType: contactData.jobType || "",
        referenceNumber: contactData.referenceNumber || "",
        lastMessage: contactData.lastMessage,
        lastMessageTimeStamp: lastMessageTimeFormatted,
        unreadMessageCount: contactData.unreadMessageCount,
        isOnline: isOnline,
        _rawTimeStamp: contactData.lastMessageTimeStamp,
      };
    });

    contacts.sort(
      (a, b) => new Date(b._rawTimeStamp) - new Date(a._rawTimeStamp)
    );

    contacts = contacts.map(({ _rawTimeStamp, ...rest }) => rest);

    return res.status(200).json({ success: true, contacts });
  } catch (error) {
    console.error("Error retrieving contacts:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve contacts",
      error: error.message,
    });
  }
};

exports.getSpecificChat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Both senderId and receiverId are required",
      });
    }

    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ timeStamp: 1 });

    const groupedChats = {};

    messages.forEach((msg) => {
      const dateKey = dayjs(msg.timeStamp).format("DD-MM-YYYY");

      const formattedTime = dayjs(msg.timeStamp).format("HH:mm");

      if (!groupedChats[dateKey]) {
        groupedChats[dateKey] = [];
      }

      groupedChats[dateKey].push({
        messageContent: msg.messageContent,
        timeStamp: formattedTime,
        Files: msg.Files,
        Status: msg.Status,
        VoiceURL: msg.VoiceURL,
        SenderId: msg.senderId,
        ReceiverId: msg.receiverId,
      });
    });

    return res.status(200).json({ success: true, chat: groupedChats });
  } catch (error) {
    console.error("Error retrieving chat:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve chat",
      error: error.message,
    });
  }
};
