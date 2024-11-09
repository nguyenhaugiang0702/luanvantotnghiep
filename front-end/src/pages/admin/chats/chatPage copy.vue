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
                <div class="col-md-3 bg-white border-end p-0">
                  <div class="p-3 border-bottom">
                    <!-- <h2 class="h5 mb-3">Conversations</h2> -->
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fa-solid fa-magnifying-glass"></i>
                      </span>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Search conversations..."
                        v-model="searchTerm"
                      />
                    </div>
                  </div>
                  <div
                    class="overflow-auto"
                    style="max-height: 35rem; height: 35rem"
                  >
                    <div
                      v-for="conv in filteredConversations"
                      :key="conv.id"
                      class="p-3 border-bottom cursor-pointer"
                      :class="{
                        'bg-light': selectedConversation?.id === conv.id,
                      }"
                      @click="selectConversation(conv)"
                    >
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <div v-if="conv.user.avatar">
                          <img
                            :src="`http://localhost:3000/` + conv.user.avatar"
                            :alt="conv.user.phoneNumber"
                            class="rounded-circle me-3"
                            width="40"
                            height="40"
                            :style="{
                              border: conv.hasNewMessage
                                ? '3px solid red'
                                : '3px solid transparent',
                            }"
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

                        <div class="flex-grow-1">
                          <p class="mb-0 font-weight-medium text-truncate">
                            {{ conv.user.name }}
                          </p>
                          <p class="mb-0 small text-muted text-truncate">
                            {{ conv.lastMessage }}
                          </p>
                        </div>

                        <small class="text-muted text-center">{{
                          conv.updatedAt
                        }}</small>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Main Chat Area -->
                <div class="col-md-9 d-flex flex-column p-0">
                  <template v-if="selectedConversation">
                    <!-- Chat Header -->
                    <div
                      class="p-3 border-bottom bg-white d-flex justify-content-between align-items-center"
                    >
                      <div class="d-flex align-items-center">
                        <div v-if="selectedConversation.user.avatar">
                          <img
                            :src="
                              `http://localhost:3000/` +
                              selectedConversation.user.avatar
                            "
                            :alt="selectedConversation.user.name"
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
                            {{ selectedConversation.user.name }}
                          </h2>
                          <div class="mb-0 small text-muted">
                            <p v-if="selectedConversation.user.email">
                              {{ selectedConversation.user.email }}
                            </p>
                            <p v-else>
                              {{ selectedConversation.user.phoneNumber }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button class="btn btn-outline-secondary me-2">
                          <i class="fa-solid fa-phone"></i>
                        </button>
                        <button class="btn btn-outline-secondary">
                          <i class="fa-solid fa-video"></i>
                        </button>
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
                  <div
                    v-else
                    class="flex-grow-1 d-flex align-items-center justify-content-center bg-light"
                  >
                    <p class="text-muted">
                      Chọn một cuộc trò chuyện để bắt đầu
                    </p>
                  </div>
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { io } from "socket.io-client";
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import moment from "moment";
import { formatDate } from "@/utils/utils";
import { useRoute } from "vue-router";
//
const apiAdmin = new ApiAdmin();
const conversations = ref([]);
const socket = ref(null);
const selectedConversation = ref(null);
const newMessage = ref("");
const searchTerm = ref("");
const chatContainer = ref(null);
const route = useRoute();
const chatRoomID = ref(route.params.chatRoomID);
//
const loadConversations = async () => {
  try {
    const response = await apiAdmin.get("/chats/chatrooms");
    if (response.status === 200) {
      conversations.value = response.data.map((room) => {
        // LastMessage
        const lastMessageObj = room.messages[room.messages.length - 1] || {};
        const lastMessage = lastMessageObj.message || "";
        const lastSender = lastMessageObj.sender || "";
        const hasNewMessage = room.messages.some(
          (msg) => !msg.isReaded && msg.sender === "user"
        );
        return {
          id: room._id,
          user: {
            name:
              room.userID?.firstName + " " + room.userID?.lastName ||
              "Unknown User",
            email: room.userID?.email || "",
            phoneNumber: room.userID?.phoneNumber,
            avatar: room.userID?.avatar,
          },
          lastMessage: lastMessage,
          hasNewMessage: hasNewMessage,
          messages: room.messages.map((msg) => ({
            sender: msg.sender,
            message: msg.message,
            isReaded: msg.isReaded,
            createdAt: formatDate(msg.createdAt),
            updatedAt: formatDate(msg.updatedAt),
          })),
          createdAt: formatDate(room.createdAt),
          updatedAt: formatDate(room.updatedA),
        };
      });
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phòng chat:", error);
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

// Lọc các cuộc trò chuyện theo từ khóa tìm kiếm
const filteredConversations = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return conversations.value.filter((conv) =>
    conv.user.name.toLowerCase().includes(term)
  );
});

// Chọn cuộc trò chuyện
const selectConversation = async (conversation) => {
  await apiAdmin.put(`/chats/chatrooms/${conversation.id}`, { isReaded: true });
  await loadConversations();
  selectedConversation.value = conversation;
  scrollToBottom();
  socket.value.emit("joinRoom", conversation.id);
};

// Gửi tin nhắn từ admin
const sendMessage = () => {
  if (newMessage.value.trim() !== "" && selectedConversation.value) {
    socket.value.emit("sendMessage", {
      chatRoomId: selectedConversation.value.id,
      sender: "admin",
      message: newMessage.value,
    });

    newMessage.value = "";
  }
};

// Xử lý logic kết nối socket và quản lý tin nhắn
onMounted(async () => {
  await loadConversations(); // Tải danh sách phòng chat
  socket.value = io("http://localhost:3000");

  // Nhận tin nhắn từ server
  socket.value.on("receiveMessage", (data) => {
    // Kiểm tra xem tin nhắn có thuộc cuộc trò chuyện hiện tại không
    if (
      selectedConversation.value &&
      data.chatRoomId === selectedConversation.value.id
    ) {
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
    if (
      selectedConversation.value &&
      data.chatRoomId === selectedConversation.value.id
    ) {
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
