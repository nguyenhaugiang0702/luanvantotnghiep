<template>
  <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline">
    <a-menu-item key="admin-subjects">
      <router-link :to="{ name: 'admin-subjects' }">
        <i class="fa-solid fa-user-gear me-2"></i>
        <span class="text-uppercase">{{ admin.admin_name }}</span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="admin-subjects">
      <router-link
        :to="{ name: 'admin-subjects' }"
        :class="{
          active:
            isActive('admin-subjects') ||
            isActive('admin-questions') ||
            isActive('admin-questions-radndom'),
        }"
      >
        <div class="ms-4">
          <i class="fas fa-list me-2"></i>
          <span class="">Môn Học</span>
        </div>
      </router-link>
    </a-menu-item>
    <a-menu-item key="admin-teachers">
      <router-link
        v-if="admin.admin_role == 'admin'"
        :to="{ name: 'admin-teachers' }"
        :class="{ active: isActive('admin-teachers') }"
      >
        <div class="ms-4">
          <i class="fas fa-user-tie me-2"></i>
          <span class="">Giảng Viên</span>
        </div>
      </router-link>
    </a-menu-item>
    <a-menu-item>
      <div class="ms-4">
        <a @click="logout" class="logout">
          <i class="fas fa-sign-out-alt me-2"></i>
          <span class="">Đăng xuất</span>
        </a>
      </div>
    </a-menu-item>
  </a-menu>
</template>
<script>
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useMenu } from "../../store/use-menu.js";
import { defineComponent, toRefs, onMounted, ref } from "vue";
import { showConfirmation } from "@/utils/swalUtils.js";
import axios from "axios";
import Cookies from "js-cookie";
import ApiService from "@/service/ApiService";

export default defineComponent({
  setup() {
    const store = useMenu();
    const route = useRoute();
    const router = useRouter();
    const isActive = (name) => route.name === name;
    const admin = ref({});
    const api = new ApiService();

    const logout = async () => {
      const result = await showConfirmation({
        title: "Bạn có chắc chắn muốn thoát không?",
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      });
      if (result.isConfirmed) {
        document.cookie = "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
        document.cookie = "user_name=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
        delete axios.defaults.headers.common["Authorization"];
        router.push({ name: "login" });
      }
    };

    onMounted(async () => {
      const token = Cookies.get("accessToken");
      const apiCall = await api.get(`admin/${token}`);
      const delay = new Promise((resolve) => setTimeout(resolve, 300));
      const [response] = await Promise.all([apiCall, delay]);
      if (response.status == 200) {
        admin.value = response.data;
      }
    });

    const { selectedKeys, openKeys } = store;
    return {
      logout,
      isActive,
      ...storeToRefs(store),
      admin,
    };
  },
});
</script>

<style scoped>
.active {
  color: blue;
  font-weight: bold;
}

.sidebar {
  background-color: #f4f4f4;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
