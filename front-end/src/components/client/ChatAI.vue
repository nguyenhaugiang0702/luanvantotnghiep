<template>
  <div>
    <button
      v-if="!isOpen"
      class="btn btn-primary rounded-circle p-3"
      @click="openChat"
    >
      <i class="fa-regular fa-comments fs-4"></i>
    </button>

    <!-- Chat box -->
    <div v-if="isOpen" class="card" style="width: 27rem; height: 30rem">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Hỗ trợ khách hàng</h5>
        <button class="btn btn-light btn-sm" @click="isOpen = false">
          <i class="fa-solid fa-x"></i>
        </button>
      </div>
      <div
        ref="chatContainer"
        class="card-body overflow-auto"
        style="max-height: 25rem"
      >
        <div class="flex-grow-1">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[message.sender === 'user' ? 'text-end' : 'text-start']"
          >
            <div
              :class="[
                'd-inline-block p-2 rounded',
                message.sender === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-white border',
              ]"
            >
              <p class="mb-0">{{ message.text }}</p>
              <small
                class="text-white"
                :class="[
                  'd-block mt-1',
                  message.sender === 'user'
                    ? 'text-white opacity-75'
                    : 'text-muted',
                ]"
                >{{ formatDate(message.createdAt) }}</small
              >
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <form @submit.prevent="sendMessage" class="d-flex">
          <input
            v-model="newMessage"
            type="text"
            class="form-control me-2"
            placeholder="Nhập tin nhắn..."
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
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { io } from "socket.io-client";
import { formatDate } from "@/utils/utils";
import { v4 as uuidv4 } from "uuid";

const socket = ref(null);
const isOpen = ref(false);
const newMessage = ref("");
const messages = ref([]); // Danh sách tin nhắn
const chatContainer = ref(null);
const sessionId = ref("");

// Gửi tin nhắn tới Rasa
const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    // Thêm tin nhắn người dùng vào danh sách
    messages.value.push({
      sender: "user",
      text: newMessage.value,
      createdAt: new Date(),
    });

    // Gửi tin nhắn tới Rasa qua WebSocket
    socket.value.emit("user_uttered", {
      message: newMessage.value,
      sender: "user",
      session_id: sessionId.value,
    });

    newMessage.value = ""; // Xóa nội dung nhập
    scrollToBottom();
  }
};

// Cuộn tới cuối phần hiển thị tin nhắn
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

// Mở chat và cuộn tới cuối
const openChat = () => {
  isOpen.value = true;
  scrollToBottom();
};
// Kết nối tới Rasa WebSocket khi component được mount
onMounted(() => {
  // Tạo sessionId nếu chưa có
  sessionId.value = localStorage.getItem("sessionId") || uuidv4();
  localStorage.setItem("sessionId", sessionId.value);

  socket.value = io("http://127.0.0.1:5005", {
    transports: ["websocket"],
  });

  // Lắng nghe tin nhắn từ bot
  socket.value.on("bot_uttered", (message) => {
    console.log('có tin nhan tu bot: '+ message);
    messages.value.push({
      sender: "bot",
      text: message.text,
      createdAt: new Date(),
    });
    scrollToBottom();
  });
});

// Ngắt kết nối WebSocket khi component bị hủy
onBeforeUnmount(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});
</script>

<style>
.card-body {
  max-height: 14rem;
}

button.btn-rounded {
  border-radius: 50%;
}
</style>
