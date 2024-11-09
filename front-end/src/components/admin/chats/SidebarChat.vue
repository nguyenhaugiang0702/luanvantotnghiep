<template>
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
    <div class="overflow-auto" style="max-height: 35rem; height: 35rem">
      <div
        v-for="conv in filteredConversations"
        :key="conv.id"
        class="p-3 border-bottom cursor-pointer"
        :class="{
          'bg-light': selectedConversation?.id === conv.id,
        }"
        @click="selectConversation(conv)"
      >
        <div class="d-flex justify-content-between align-items-center">
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
              style="border: 2px solid #000; border-radius: 50%; padding: 5px"
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

          <small class="text-muted text-center">{{ conv.updatedAt }}</small>
        </div>
      </div>
    </div>
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
  inject,
} from "vue";
import { io } from "socket.io-client";
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import moment from "moment";
import { formatDate } from "@/utils/utils";
import { useRouter } from "vue-router";
//
const apiAdmin = new ApiAdmin();
const conversations = ref([]);
const socket = ref(null);
const selectedConversation = ref(null);
const newMessage = ref("");
const searchTerm = ref("");
const chatContainer = ref(null);
const router = useRouter();
const updateNotification = inject("updateNotification");
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
          updatedAt: formatDate(room.updatedAt),
        };
      });
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phòng chat:", error);
  }
};

watch(conversations, async (newValue) => {
  if (newValue) {
    await loadConversations();
  }
});

// Lọc các cuộc trò chuyện theo từ khóa tìm kiếm
const filteredConversations = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return conversations.value.filter((conv) =>
    conv.user.name.toLowerCase().includes(term)
  );
});

// Chọn cuộc trò chuyện
const selectConversation = async (conversation) => {
  updateNotification.value += 1;
  await apiAdmin.put(`/chats/chatrooms/${conversation.id}`, { isReaded: true });
  router.push({
    name: "admin-chats-room",
    params: { chatRoomID: conversation.id },
  });
};

onMounted(async () => {
  await loadConversations();
  socket.value = io("http://localhost:3000");
  // Nhận tin nhắn từ server
  socket.value.on("receiveMessage", async (data) => {
    // Kiểm tra xem tin nhắn có thuộc cuộc trò chuyện hiện tại không
    if (selectedConversation.value && data.chatRoomId === chatRoomID) {
      if (data.sender === "user") {
        await apiAdmin.put(`/chats/chatrooms/${chatRoomID}`, {
          isReaded: true,
        });
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
