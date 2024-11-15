<template>
  <a-dropdown placement="bottomRight">
    <a-badge :count="messages.data?.length" class="mx-3">
      <a-button type="text">
        <template #icon><BellOutlined /></template>
      </a-button>
    </a-badge>
    <template #overlay>
      <a-menu class="notification-menu">
        <div
          class="notification-header px-3 py-2 d-flex justify-content-between align-items-center"
        >
          <span class="fw-bold">Thông báo</span>
        </div>
        <div class="notification-container py-2">
          <!-- Thông báo tin nhắn mới -->
          <div v-if="messages.data?.length !== 0">
            <a-menu-item
              v-for="(msg, index) in messages.data"
              :key="index"
              class="notification-item"
            >
              <div
                class="d-flex align-items-start py-2"
                @click="handleNotificationClick(msg)"
              >
                <div class="notification-icon me-3">
                  <WarningOutlined class="text-warning" />
                </div>
                <div class="notification-content flex-grow-1">
                  <div class="fw-bold">{{ messages.title }}</div>
                  <div class="text-muted small">
                    {{ messages.message + " - " + msg.user }}
                  </div>
                  <div class="text-muted smaller">
                    {{ formatDate(msg.createdAt) }}
                  </div>
                </div>
              </div>
            </a-menu-item>
          </div>
        </div>
        <div
          v-if="messages.data?.length === 0"
          class="text-center py-3 text-muted"
        >
          Không có thông báo mới
        </div>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
import { onMounted, ref, computed, inject, watch } from "vue";
import { useRouter } from "vue-router";
import { io } from "socket.io-client";
import {
  BellOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons-vue";
import { showSuccessToast, showWarningToast } from "@/utils/toast.util";
import { useNotificationsStore } from "@/stores/notifycation";
import ApiAdminService from "@/service/admin/apiAdmin.service";
import { formatDate } from "@/utils/utils";

//
const apiAdmin = new ApiAdminService();
const notifications = useNotificationsStore();
const router = useRouter();
const messages = ref({});
const socket = ref(null);
const updateNotification = inject("updateNotification");
const checkMessagesNotification = async () => {
  const response = await apiAdmin.get("/chats/checkMessages");
  if (response.status === 200) {
    messages.value = response.data;
  }
};

watch(messages, async (newValue) => {
  if (newValue) {
    await checkMessagesNotification();
  }
});

// Tải thông báo khi component được mount
onMounted(async () => {
  await checkMessagesNotification();
  socket.value = io("http://localhost:3000");
  socket.value.on("hasNewMessage", async (data) => {
    if (data.chat) {
      await checkMessagesNotification(); // Gọi lại để cập nhật danh sách thông báo
    }
  });
});

// Xử lý khi click vào thông báo
const handleNotificationClick = async (msg) => {
  await apiAdmin.put(`/chats/chatrooms/${msg.chatRoomID}`, { isReaded: true });
  await checkMessagesNotification();
  router.push({
    name: "admin-chats-room",
    params: { chatRoomID: msg.chatRoomID },
  });
};
</script>

<style scoped>
.notification-menu {
  width: 350px;
}

.notification-header {
  border-bottom: 1px solid #f0f0f0;
}

.notification-container {
  max-height: 20rem;
  overflow: auto;
}

.notification-item {
  padding: 0;
}

.notification-item:hover {
  background-color: #f5f5f5;
}

.notification-content {
  font-size: 14px;
}

.unread {
  background-color: #f0f7ff;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #1890ff;
  margin-top: 6px;
}

.smaller {
  font-size: 12px;
}

.notification-footer {
  border-top: 1px solid #f0f0f0;
}
</style>
