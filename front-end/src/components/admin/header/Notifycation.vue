<!-- components/admin/header/NotificationDropdown.vue -->
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
          <a-menu-item
            v-for="notif in notifications.notifications"
            :key="notif.id"
            class="notification-item"
          >
            <div
              class="d-flex align-items-start py-2"
              :class="{ unread: !notif.read }"
              @click="handleNotificationClick(notif)"
            >
              <!-- Icon thông báo -->
              <div class="notification-icon me-3">
                <CheckCircleOutlined
                  v-if="notif.type === 'success'"
                  class="text-success"
                />
                <WarningOutlined
                  v-else-if="notif.type === 'warning'"
                  class="text-warning"
                />
                <InfoCircleOutlined v-else class="text-primary" />
              </div>
              <!-- Nội dung thông báo -->
              <div class="notification-content flex-grow-1">
                <div class="fw-bold">{{ notif.title }}</div>
                <div class="text-muted small">{{ notif.message }}</div>
                <div class="text-muted smaller">{{ notif.time }}</div>
              </div>
              <!-- Dấu chấm hiển thị trạng thái đã đọc -->
              <div v-if="!notif.read" class="unread-dot"></div>
            </div>
          </a-menu-item>
        </div>
        <div
          v-if="notifications.length === 0"
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
import {useRouter} from 'vue-router';
import { io } from "socket.io-client";
import {
  BellOutlined,
  UserOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { showSuccessToast } from "@/utils/toast.util";
import { useNotificationsStore } from "@/stores/notifycation";
const notifications = useNotificationsStore();
const router = useRouter();
// Notifycation
onMounted(() => {
  notifications.loadNotifications();
  const socket = io("http://localhost:3000");
  socket.on("newOrder", (data) => {
    const newNotification = {
      id: Date.now(),
      type: "success",
      title: "Đơn hàng mới",
      message: data.message,
      time: new Date().toLocaleTimeString(),
      read: false,
    };
    notifications.addNotification(newNotification);
  });
});

// Tính số lượng thông báo chưa đọc
const unreadCount = computed(() => {
  return notifications.notifications.filter((notif) => !notif.read).length;
});

// Xử lý khi click vào thông báo
const handleNotificationClick = (notification) => {
  notification.read = true;
  notifications.markAllAsRead(); // Cập nhật vào store
  router.push({ name: "admin-orders" });
  message.info(`Đã mở thông báo: ${notification.title}`);
};

// Đánh dấu tất cả đã đọc
const markAllAsRead = () => {
  notifications.markAllAsRead();
  message.success("Đã đánh dấu tất cả thông báo là đã đọc");
};

// Xem tất cả thông báo
const viewAllNotifications = () => {
  message.info("Chuyển đến trang xem tất cả thông báo");
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

/* Các styles khác giữ nguyên */
.ant-dropdown-link {
  color: rgba(0, 0, 0, 0.85);
  text-decoration: none;
  cursor: pointer;
}

.ant-layout-header {
  height: 64px;
  line-height: 64px;
}
</style>
