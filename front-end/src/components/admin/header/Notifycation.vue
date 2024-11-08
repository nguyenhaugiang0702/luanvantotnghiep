<template>
  <a-dropdown placement="bottomRight">
    <a-badge :count="unreadCount" class="mx-3">
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
          <a-button type="link" @click="markAllAsRead"
            >Đánh dấu tất cả đã đọc</a-button
          >
        </div>
        <div class="notification-container">
          <!-- Thông báo đơn hàng mới -->
          <div v-if="newOrders.length > 0">
            <a-menu-item
              v-for="notif in newOrders"
              :key="notif.id"
              class="notification-item"
            >
              <div
                class="d-flex align-items-start py-2"
                :class="{ unread: !notif.read }"
                @click="handleNotificationClick(notif)"
              >
                <div class="notification-icon me-3">
                  <CheckCircleOutlined class="text-success" />
                </div>
                <div class="notification-content flex-grow-1">
                  <div class="fw-bold">{{ notif.title }}</div>
                  <div class="text-muted small">{{ notif.message }}</div>
                  <div class="text-muted smaller">{{ notif.time }}</div>
                </div>
                <div v-if="!notif.read" class="unread-dot"></div>
              </div>
            </a-menu-item>
          </div>

          <!-- Thông báo tin nhắn mới -->
          <div v-if="newMessages.length > 0">
            <a-menu-item
              v-for="notif in newMessages"
              :key="notif.id"
              class="notification-item"
            >
              <div
                class="d-flex align-items-start py-2"
                :class="{ unread: !notif.read }"
                @click="handleNotificationClick(notif)"
              >
                <div class="notification-icon me-3">
                  <WarningOutlined class="text-warning" />
                </div>
                <div class="notification-content flex-grow-1">
                  <div class="fw-bold">{{ notif.title }}</div>
                  <div class="text-muted small">{{ notif.message }}</div>
                  <div class="text-muted smaller">{{ notif.time }}</div>
                </div>
                <div v-if="!notif.read" class="unread-dot"></div>
              </div>
            </a-menu-item>
          </div>
        </div>
        <div
          v-if="newOrders.length === 0 && newMessages.length === 0"
          class="text-center py-3 text-muted"
        >
          Không có thông báo mới
        </div>
        <div class="notification-footer text-center py-2">
          <a-button type="link" @click="viewAllNotifications"
            >Xem tất cả thông báo</a-button
          >
        </div>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { io } from "socket.io-client";
import {
  BellOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons-vue";
import { showSuccessToast, showWarningToast } from "@/utils/toast.util";
import { useNotificationsStore } from "@/stores/notifycation";

const notifications = useNotificationsStore();
const router = useRouter();
const newOrders = computed(() => notifications.notifications.newOrders || []);
const newMessages = computed(() => notifications.notifications.newMessages || []);

// Tải thông báo khi component được mount
onMounted(() => {
  notifications.loadNotifications();
  const socket = io("http://localhost:3000");

  socket.on("hasNewMessage", (data) => {
    // Kiểm tra nếu có đơn hàng mới
    if (data.order && data.order.message) {
      const newOrderNotification = {
        id: Date.now(),
        type: "success",
        title: "Đơn hàng mới",
        message: data.order.message,
        time: new Date().toLocaleTimeString(),
        read: false,
      };
      notifications.addNewOrderNotification(newOrderNotification);
      showSuccessToast(data.order.message);  // Hiển thị toast thông báo đơn hàng
    }

    // Kiểm tra nếu có tin nhắn mới
    else if (data.chat && data.chat.message) {
      const newChatNotification = {
        id: Date.now(),
        type: "warning",
        title: "Tin nhắn mới",
        message: data.chat.message,
        time: new Date().toLocaleTimeString(),
        read: false,
      };
      notifications.addNewMessageNotification(newChatNotification);
      showWarningToast(data.chat.message);  // Hiển thị toast thông báo tin nhắn
    }
  });
});

// Tính số lượng thông báo chưa đọc
const unreadCount = computed(() => {
  return [
    ...(notifications?.notifications?.newOrders || []),
    ...(notifications?.notifications?.newMessages || [])
  ].filter((notif) => !notif.read).length;
});


// Xử lý khi click vào thông báo
const handleNotificationClick = (notification) => {
  notification.read = true;
  notifications.markAllAsRead(); // Cập nhật vào store
  if (notification.type === "success") {
    // Điều hướng đến trang đơn hàng nếu thông báo là đơn hàng mới
    router.push({ name: "admin-orders" });
  } else if (notification.type === "warning") {
    // Điều hướng đến trang tin nhắn nếu thông báo là tin nhắn mới
    router.push({ name: "admin-chats" });
  }
};

// Đánh dấu tất cả đã đọc
const markAllAsRead = () => {
  notifications.markAllAsRead();
};

// Xem tất cả thông báo
const viewAllNotifications = () => {
  router.push({ name: "admin-notifications" });
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
