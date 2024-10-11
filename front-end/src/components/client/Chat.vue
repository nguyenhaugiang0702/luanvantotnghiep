<template>
  <div>
    <!-- Chat button -->
    <button
      v-if="!isOpen"
      class="btn btn-primary rounded-circle p-3"
      @click="openChat"
    >
      <i class="fa-regular fa-comments fs-4"></i>
    </button>

    <!-- Chat box -->
    <div v-if="isOpen" class="card" style="width: 27rem; height: 25rem">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5 class="mb-0">Customer Support</h5>
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
            :class="[
              'mb-3',
              message.sender === 'user' ? 'text-end' : 'text-start',
            ]"
          >
            <div
              :class="[
                'd-inline-block p-2 rounded',
                message.sender === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-white border',
              ]"
            >
              <p class="mb-0">{{ message.message }}</p>
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
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import ApiUser from "@/service/user/apiUser.service";
import { formatDate } from "@/utils/utils";

const socket = ref(null);
const isOpen = ref(false);
const newMessage = ref("");
const messages = ref([]); // Khởi tạo danh sách tin nhắn rỗng
const chatRoomId = ref(""); // Khởi tạo chatRoomId rỗng
const token = Cookies.get("accessToken");
const isLoggedIn = Cookies.get("isLoggedIn");

const chatContainer = ref(null);
//
const apiUser = new ApiUser();

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
  if (token) {
    const response = await apiUser.get("/chats/checkRoomChat");
    if (response.status === 200) {
      chatRoomId.value = response.data.chatRoomID;
    }
  }
};

// Hàm cuộn tới cuối phần chứa tin nhắn
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

const openChat = async () => {
  isOpen.value = true;
  await scrollToBottom();
};

onMounted(async () => {
  if (token) {
    await checkRoomChat();
    // Kết nối tới server Socket.IO
    socket.value = io("http://localhost:3000");

    // Nhận tin nhắn từ server
    socket.value.on("receiveMessage", (message) => {
      messages.value.push(message);
      scrollToBottom();
    });

    // Tải lịch sử tin nhắn khi tham gia phòng chat
    socket.value.on("loadMessages", (data) => {
      chatRoomId.value = data.chatRoomId;
      messages.value = data.messages;
      scrollToBottom();
    });

    // Gửi thông báo tham gia phòng chat
    socket.value.emit("joinRoom", chatRoomId.value);
  }
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
