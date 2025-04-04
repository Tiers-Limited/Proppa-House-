const { Server } = require("socket.io");

let io;

exports.initWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT"],
    },
  });

  console.log("WebSocket server initialized");

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("registerUser", (userId) => {
      socket.userId = userId;
      console.log(`User registered: ${userId}`);
    });

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation room: ${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

exports.getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};
