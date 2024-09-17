<template>
  <div>
    <!-- Chat button -->
    <button
      v-if="!isOpen"
      class="btn btn-primary rounded-circle p-3"
      @click="isOpen = true"
    >
      <i class="fa-regular fa-comments fs-4"></i>
    </button>

    <!-- Chat box -->
    <div v-if="isOpen" class="card" style="width: 27rem">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5 class="mb-0">Customer Support</h5>
        <button class="btn btn-light btn-sm" @click="isOpen = false">
          <i class="fa-solid fa-x"></i>
        </button>
      </div>
      <div class="card-body p-3 overflow-auto" style="max-height: 25rem">
        <div v-for="(message, index) in messages" :key="index" class="mb-3">
          <div
            style="max-width: 75%"
            :class="[
              'p-2 rounded',
              message.sender === 'user'
                ? 'bg-primary text-white text-end ms-auto'
                : 'bg-light text-start',
            ]"
          >
            {{ message.message }}
          </div>
        </div>
      </div>
      <div class="card-footer">
        <form @submit.prevent="sendMessage" class="d-flex">
          <input
            v-model="newMessage"
            type="text"
            class="form-control me-2"
            placeholder="Type your message..."
          />
          <button type="submit" class="btn btn-primary">
            <i class="fa-regular fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import ChatsService from "@/service/chat.service";

const socket = ref(null);
const isOpen = ref(false);
const newMessage = ref("");
const messages = ref([]); // Khởi tạo danh sách tin nhắn rỗng
const chatRoomId = ref(""); // Khởi tạo chatRoomId rỗng
const token = Cookies.get("accessToken");
const chatsService = new ChatsService();
const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    // Gửi tin nhắn lên server
    socket.value.emit("sendMessage", {
      chatRoomId: chatRoomId.value,
      sender: "user",
      message: newMessage.value,
      token: token,
    });

    newMessage.value = ""; // Xóa nội dung sau khi gửi
  }
};

const checkRoomChat = async () => {
  const response = await chatsService.get("/checkRoomChat", token);
  if (response.status === 200) {
    chatRoomId.value = response.data.chatRoomID;
  }
};

onMounted(async () => {
  await checkRoomChat();
  // Kết nối tới server Socket.IO
  socket.value = io("http://localhost:3000");

  // Nhận tin nhắn từ server
  socket.value.on("receiveMessage", (message) => {
    messages.value.push(message);
  });

  // Tải lịch sử tin nhắn khi tham gia phòng chat
  socket.value.on("loadMessages", (data) => {
    console.log(data);
    chatRoomId.value = data.chatRoomId;
    messages.value = data.messages;
  });

  // Gửi thông báo tham gia phòng chat
  socket.value.emit("joinRoom", chatRoomId.value);
});

onBeforeUnmount(() => {
  // Đóng kết nối khi component bị hủy
  if (socket.value) {
    socket.value.disconnect();
  }
});
</script>

<style>
/* Optional: Style overrides */
.card-body {
  max-height: 14rem;
}

button.btn-rounded {
  border-radius: 50%;
}
</style>
