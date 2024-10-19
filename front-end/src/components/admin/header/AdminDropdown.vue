<!-- components/admin/header/UserDropdown.vue -->
<template>
  <!-- User Dropdown -->
  <a-dropdown placement="bottomRight" :trigger="['click']">
    <div class="user-dropdown-trigger d-flex align-items-center">
      <div class="user-info me-1 d-none d-sm-block">
        <div class="user-name" style="line-height: 1.2">
          {{ admin ? admin.firstName + " " + admin.lastName : "Chưa biết" }}
        </div>
        <div class="user-role small text-muted" style="line-height: 1.2">
          {{ admin ? admin.role : "Chưa biết" }}
        </div>
      </div>
      <DownOutlined />
    </div>

    <template #overlay>
      <a-menu class="user-dropdown-menu">
        <!-- User Profile Section -->
        <div class="p-3 border-bottom">
          <div class="d-flex align-items-center mb-3">
            <a-avatar :size="50" class="me-3">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <div>
              <div class="fw-bold">
                {{
                  admin ? admin.firstName + " " + admin.lastName : "Chưa biết"
                }}
              </div>
              <div class="text-muted small">
                {{ admin ? admin.email : "Chưa biết" }}
              </div>
            </div>
          </div>
          <a-button type="primary" block>
            <template #icon><UserOutlined /></template>
            Xem hồ sơ
          </a-button>
        </div>

        <!-- Account Settings -->
        <a-menu-item key="account">
          <template #icon><UserOutlined /></template>
          Tài khoản của tôi
        </a-menu-item>

        <a-menu-item key="security">
          <template #icon><SafetyCertificateOutlined /></template>
          Bảo mật
        </a-menu-item>

        <a-menu-item key="settings">
          <template #icon><SettingOutlined /></template>
          Cài đặt
        </a-menu-item>

        <!-- Theme Switch -->
        <a-menu-item key="theme">
          <div class="d-flex justify-content-between align-items-center">
            <span>
              <BulbOutlined class="me-2" />
              Giao diện tối
            </span>
            <a-switch
              v-model:checked="isDarkMode"
              size="small"
              @change="toggleTheme"
            />
          </div>
        </a-menu-item>

        <a-menu-divider />

        <!-- Help & Support -->
        <a-sub-menu key="help">
          <template #icon><QuestionCircleOutlined /></template>
          <template #title>Trợ giúp & Hỗ trợ</template>
          <a-menu-item key="documentation">
            <template #icon><FileTextOutlined /></template>
            Tài liệu hướng dẫn
          </a-menu-item>
          <a-menu-item key="faq">
            <template #icon><QuestionOutlined /></template>
            FAQ
          </a-menu-item>
          <a-menu-item key="support">
            <template #icon><CustomerServiceOutlined /></template>
            Liên hệ hỗ trợ
          </a-menu-item>
        </a-sub-menu>

        <a-menu-divider />

        <!-- Status & Version -->
        <div class="px-3 py-2 border-bottom">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="text-muted">Trạng thái</span>
            <a-tag color="success">Online</a-tag>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <span class="text-muted">Phiên bản</span>
            <span>v1</span>
          </div>
        </div>

        <!-- Logout -->
        <a-menu-item key="logout" @click="handleLogout" danger>
          <template #icon><LogoutOutlined /></template>
          Đăng xuất
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Cookies from "js-cookie";
import {
  BellOutlined,
  UserOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  BulbOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  QuestionOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { showConfirmation } from "@/utils/swalUtils";
import ApiAdminService from "@/service/admin/apiAdmin.service";

// Dark mode state
const isDarkMode = ref(false);
const apiAdmin = new ApiAdminService();
// Toggle theme function
const toggleTheme = (checked) => {
  message.success(`Đã chuyển sang giao diện ${checked ? "tối" : "sáng"}`);
  // Thêm logic chuyển đổi theme ở đây
};

const admin = ref({});
const getAdmin = async () => {
  const response = await apiAdmin.get("/admins/infoAdmin");
  if (response.status === 200) {
    admin.value = response.data;
  }
};

onMounted(() => {
  getAdmin();
});

// Logout handler
const handleLogout = async () => {
  const isConfirmed = await showConfirmation({
    text: "Bạn sẽ đăng xuất khỏi hệ thống",
  });
  if (isConfirmed.isConfirmed) {
    Cookies.remove("accessToken");
    Cookies.remove("isLoggedIn");
    Cookies.remove("refreshToken");
    window.location.reload();
  }
};
</script>

<style scoped>
.user-dropdown-trigger {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.user-dropdown-trigger:hover {
  background: rgba(0, 0, 0, 0.025);
}

.user-dropdown-menu {
  width: 280px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.user-role {
  font-size: 12px;
}

/* Dark mode styles */
:deep(.ant-switch-checked) {
  background-color: #1890ff;
}

/* Responsive styles */
@media (max-width: 576px) {
  .user-dropdown-menu {
    width: 250px;
  }
}
</style>
