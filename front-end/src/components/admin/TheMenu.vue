<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    collapsible
    style="min-height: 100vh; overflow: auto"
  >
    <div class="text-white py-4 px-4 sticky-top">Trang Quản trị</div>
    <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
      <a-menu-item key="admin-home" @click="navigateTo('admin-home')">
        <i class="fa-solid fa-house fs-4 me-3"></i>
        <span>Trang chủ</span>
      </a-menu-item>
      <AdminMenu v-if="admin?.roleID?.name === 'admin'" />
      <SaleMenu v-else-if="admin?.roleID?.name === 'sale'" />
      <a-menu-item @click="logOut">
        <img
          class="me-3"
          src="../../assets/images/admin/logout.png"
          alt=""
          style="width: 30px; height: 30px"
        />
        <span>Đẵng xuất</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>
<script>
import { ref, onMounted, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useMenu } from "../../stores/use-menu.js";
import { showConfirmation } from "@/utils/swalUtils.js";
import Cookies from "js-cookie";
import AdminMenu from "../../components/admin/menu/AdminMenu.vue";
import SaleMenu from "../../components/admin/menu/SaleMenu.vue";
import ApiAdminService from "@/service/admin/apiAdmin.service.js";

export default defineComponent({
  components: {
    AdminMenu,
    SaleMenu,
  },
  setup(_, { emit }) {
    const collapsed = ref(false);
    const router = useRouter();
    const store = useMenu();
    const admin = ref({});
    const apiAdmin = new ApiAdminService();

    const { selectedKeys, openKeys } = storeToRefs(store);
    const navigateTo = (routeName) => {
      selectedKeys.value = [routeName];
      emit("update:selectedKeys", selectedKeys.value);
      router.push({ name: routeName });
    };

    const getAdmin = async () => {
      const response = await apiAdmin.get("/admins/infoAdmin");
      if (response.status === 200) {
        admin.value = response.data;
        console.log(admin.value);
      }
    };

    onMounted(() => {
      getAdmin();
    });

    const logOut = async () => {
      const isConfirm = await showConfirmation({
        title: "Bạn có muốn đăng xuất?",
      });
      if (isConfirm.isConfirmed) {
        Cookies.remove("accessToken");
        Cookies.remove("isLoggedIn");
        Cookies.remove("refreshToken");
        window.location.reload();
      }
    };
    return { collapsed, navigateTo, selectedKeys, logOut, admin };
  },
});
</script>
