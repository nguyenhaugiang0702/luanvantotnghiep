<template>
  <a-sub-menu key="admin-suppliers-list">
    <template #title>
      <span>
        <img
          class="me-3"
          src="../../../assets/images/admin/suppliers.png"
          alt=""
          style="width: 30px; height: 30px"
        />
        <span>Nhà cung cấp</span>
      </span>
    </template>
    <a-menu-item
      key="admin-suppliers-add"
      @click="navigateTo('admin-suppliers-add')"
      >Thêm</a-menu-item
    >
    <a-menu-item
      key="admin-suppliers-list"
      @click="navigateTo('admin-suppliers-list')"
      >Danh sách</a-menu-item
    >
  </a-sub-menu>

  <!-- Quản lý Đơn hàng -->
  <a-menu-item key="admin-orders-list" @click="navigateTo('admin-orders-list')">
    <img
      class="me-3"
      src="../../../assets/images/admin/orders.png"
      alt=""
      style="width: 30px; height: 30px"
    />
    <span>Đơn hàng</span>
  </a-menu-item>

  <!-- Quản lý Tin nhắn -->
  <a-menu-item key="admin-chats" @click="navigateTo('admin-chats')">
    <i class="fa-solid fa-comments fs-4 me-3"></i>
    <span>Tin nhắn</span>
  </a-menu-item>

  <!-- Quản lý Nhập hàng -->
  <a-sub-menu key="admin-receipts-list">
    <template #title>
      <span>
        <img
          class="me-3"
          src="../../../assets/images/admin/importation.png"
          alt=""
          style="width: 30px; height: 30px"
        />
        <span>Nhập hàng</span>
      </span>
    </template>
    <a-menu-item
      key="admin-receipts-add"
      @click="navigateTo('admin-receipts-add')"
      >Thêm</a-menu-item
    >
    <a-menu-item
      key="admin-receipts-list"
      @click="navigateTo('admin-receipts-list')"
      >Danh sách</a-menu-item
    >
  </a-sub-menu>
</template>
<script>
import { ref, onMounted, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useMenu } from "../../../stores/use-menu.js";
import { showConfirmation } from "@/utils/swalUtils.js";
import Cookies from "js-cookie";

export default defineComponent({
  setup(_, { emit }) {
    const router = useRouter();
    const store = useMenu();

    const { selectedKeys, openKeys } = storeToRefs(store);
    const navigateTo = (routeName) => {
      selectedKeys.value = [routeName];
      emit("update:selectedKeys", selectedKeys.value);
      router.push({ name: routeName });
    };

    return { navigateTo, selectedKeys };
  },
});
</script>
