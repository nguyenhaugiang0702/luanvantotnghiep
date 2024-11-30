<template>
  <div>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Tin nhắn</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <div class="row">
          <div class="col-12">
            <div class="container-fluid h-100">
              <div class="row h-100">
                <!-- Conversation List -->
                <SidebarChat />

                <!-- Main Chat Area -->
                <div class="col-md-9 d-flex flex-column p-0">
                  <!-- Chat Header -->
                  <template v-if="selectedConversation">
                    <div
                      class="p-3 border-bottom bg-white d-flex justify-content-between align-items-center"
                    >
                      <div class="d-flex align-items-center">
                        <div v-if="selectedConversation.userID?.avatar">
                          <img
                            :src="
                              `http://localhost:3000/` +
                              selectedConversation.userID?.avatar
                            "
                            :alt="selectedConversation.userID?.name"
                            class="rounded-circle me-3"
                            width="40"
                            height="40"
                          />
                        </div>
                        <div v-else>
                          <i
                            class="fa-solid fa-user fs-4 me-3"
                            style="
                              border: 2px solid #000;
                              border-radius: 50%;
                              padding: 5px;
                            "
                          ></i>
                        </div>

                        <div>
                          <h2 class="h5 mb-0">
                            {{ selectedConversation.userID?.name }}
                          </h2>
                          <div class="mb-0 small text-muted">
                            <p v-if="selectedConversation.userID?.email">
                              {{ selectedConversation.userID?.email }}
                            </p>
                            <p v-else>
                              {{ selectedConversation.userID?.phoneNumber }}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                    </div>

                    <!-- Messages -->
                    <div
                      ref="chatContainer"
                      class="flex-grow-1 p-3 bg-light overflow-auto"
                      style="max-height: 25rem"
                    >
                      <div
                        v-for="(
                          message, index
                        ) in selectedConversation.messages"
                        :key="index"
                        :class="[
                          'mb-3',
                          message.sender === 'admin'
                            ? 'text-end'
                            : 'text-start',
                        ]"
                      >
                        <div
                          :class="[
                            'd-inline-block p-2 rounded',
                            message.sender === 'admin'
                              ? 'bg-primary text-white'
                              : 'bg-white border',
                          ]"
                        >
                          <p class="mb-0">{{ message.message }}</p>
                          <small
                            class="text-white"
                            :class="[
                              'd-block mt-1',
                              message.sender === 'admin'
                                ? 'text-white opacity-75'
                                : 'text-muted',
                            ]"
                            >{{ message.createdAt }}</small
                          >
                        </div>
                      </div>
                    </div>

                    <!-- Message Input -->
                    <form
                      @submit.prevent="sendMessage"
                      class="p-3 bg-white border-top"
                    >
                      <div class="input-group">
                        <input
                          v-model="newMessage"
                          type="text"
                          class="form-control"
                          placeholder="Type your message..."
                        />
                        <button type="submit" class="btn btn-primary">
                          <i class="bi bi-send me-2"></i>
                          Send
                        </button>
                      </div>
                    </form>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-layout-content>
  </div>
</template>
<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";
import { io } from "socket.io-client";
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import moment from "moment";
import { formatDate } from "@/utils/utils";
import { useRoute } from "vue-router";
import SidebarChat from "../../../components/admin/chats/SidebarChat.vue";

//
const apiAdmin = new ApiAdmin();
const selectedConversation = ref({});
const socket = ref(null);
const newMessage = ref("");
const chatContainer = ref(null);
const route = useRoute();
//
watch(
  () => route.params.chatRoomID,
  async (newChatRoomID) => {
    if (newChatRoomID) {
      await loadMessagesConversation(newChatRoomID);
    }
  }
);

watch(
  () => selectedConversation.value,
  (newValue) => {
    if (newValue) {
      scrollToBottom();
    }
  }
);

const loadMessagesConversation = async (chatRoomID) => {
  const response = await apiAdmin.get(`/chats/chatrooms/${chatRoomID}`);
  if (response.status === 200) {
    selectedConversation.value = response.data;
    console.log("Loaded conversation:", response.data);
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

// Gửi tin nhắn từ admin
const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    socket.value.emit("sendMessage", {
      chatRoomId: selectedConversation.value._id,
      sender: "admin",
      message: newMessage.value,
    });

    newMessage.value = "";
  }
};

// Xử lý logic kết nối socket và quản lý tin nhắn
onMounted(async () => {
  const chatRoomID = route.params.chatRoomID;
  if (chatRoomID) {
    await loadMessagesConversation(chatRoomID);
  }
  await apiAdmin.put(`/chats/chatrooms/${chatRoomID}`, { isReaded: true });
  socket.value = io("http://localhost:3000");
  socket.value.emit("joinRoom", chatRoomID);
  // Nhận tin nhắn từ server
  socket.value.on("receiveMessage", async (data) => {
    // Kiểm tra xem tin nhắn có thuộc cuộc trò chuyện hiện tại không
    if (selectedConversation.value && data.chatRoomId === chatRoomID) {
      if (data.sender === "user") {
        await apiAdmin.put(`/chats/chatrooms/${chatRoomID}`, { isReaded: true });
      }
      selectedConversation.value.messages.push({
        sender: data.sender,
        message: data.message,
        createdAt: formatDate(),
      });
      scrollToBottom();
    }
  });

  // Tải tin nhắn khi admin tham gia phòng chat
  socket.value.on("loadMessages", (data) => {
    // Kiểm tra xem có đúng phòng chat hiện tại hay không
    if (selectedConversation.value && data.chatRoomId === chatRoomID) {
      selectedConversation.value.messages = data.messages.map((msg) => ({
        sender: msg.sender,
        message: msg.message,
        createdAt: moment(msg.createdAt).format("DD/MM/YYYY HH:mm:ss"),
      }));
      scrollToBottom();
    }
  });
});

onBeforeUnmount(() => {
  // Ngắt kết nối khi component bị hủy
  if (socket.value) {
    socket.value.disconnect();
  }
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.min-width-0 {
  min-width: 0;
}
</style>
