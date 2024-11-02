const app = require("./app");
const config = require("./app/config");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const http = require("http"); // Thêm module http
const chatRoomService = require("./app/services/chatRoom.service");
// Tạo server HTTP từ ứng dụng Express
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*", // Cấu hình cho phép client kết nối từ bất kỳ nguồn nào
    methods: ["GET", "POST"],
  },
});

// Lưu io vào app để các route API khác có thể truy cập
app.set("socketIo", io);

async function startServer() {
  try {
    // Connect to DB
    await mongoose.connect(config.db.uri);
    console.log("Connected to the database!");

    // Lắng nghe kết nối từ client thông qua Socket.IO
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // Lắng nghe khi client join vào một phòng chat
      socket.on("joinRoom", async (chatRoomId) => {
        socket.join(chatRoomId); // Tham gia vào phòng chat
        console.log(`User with ID: ${socket.id} joined room: ${chatRoomId}`);

        // Tải lịch sử tin nhắn từ cơ sở dữ liệu
        const chatRoom = await chatRoomService.getMessageByChatRoomID(
          chatRoomId
        );
        if (chatRoom) {
          // Gửi dữ liệu phòng chat và tin nhắn đến client
          socket.emit("loadMessages", {
            chatRoomId: chatRoom._id,
            messages: chatRoom.messages,
          });
        }
      });

      // Lắng nghe khi client gửi tin nhắn
      socket.on("sendMessage", async (data) => {
        const { chatRoomId, sender, message } = data;

        // Cập nhật tin nhắn vào cơ sở dữ liệu
        await chatRoomService.updateMessage(chatRoomId, sender, message);

        // Phát tin nhắn mới tới tất cả các client trong phòng chat
        io.to(chatRoomId).emit("receiveMessage", {
          chatRoomId,
          sender,
          message,
        });
      });

      // Lắng nghe khi client ngắt kết nối
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    // Khởi động server HTTP
    const PORT = config.app.port;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Can not connect to the database!", error);
    process.exit();
  }
}

startServer();
