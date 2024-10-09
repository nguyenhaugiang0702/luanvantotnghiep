<template>
  <a-layout-sider v-model:collapsed="collapsed" collapsible>
    <div class="text-white py-4 px-4">Trang Quản trị</div>
    <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
      <a-menu-item key="admin-users" @click="navigateTo('admin-users')">
        <pie-chart-outlined />
        <span>Người dùng</span>
      </a-menu-item>
      <a-menu-item
        key="admin-authors-list"
        @click="navigateTo('admin-authors-list')"
      >
        <desktop-outlined />
        <span>Tác giả</span>
      </a-menu-item>
      <a-menu-item
        key="admin-categories"
        @click="navigateTo('admin-categories')"
      >
        <desktop-outlined />
        <span>Thể loại</span>
      </a-menu-item>
      <a-menu-item
        key="admin-orders-list"
        @click="navigateTo('admin-orders-list')"
      >
        <desktop-outlined />
        <span>Đơn hàng</span>
      </a-menu-item>
      <a-menu-item
        key="admin-formalities"
        @click="navigateTo('admin-formalities')"
      >
        <desktop-outlined />
        <span>Hình thức</span>
      </a-menu-item>
      <a-menu-item
        key="admin-priceranges-list"
        @click="navigateTo('admin-priceranges-list')"
      >
        <desktop-outlined />
        <span>Khoản giá</span>
      </a-menu-item>
      <a-sub-menu key="admin-books-list">
        <template #title>
          <span>
            <user-outlined />
            <span>Sản phẩm</span>
          </span>
        </template>
        <a-menu-item
          key="admin-books-add"
          @click="navigateTo('admin-books-add')"
          >Thêm</a-menu-item
        >
        <a-menu-item
          key="admin-books-list"
          @click="navigateTo('admin-books-list')"
          >Danh sách</a-menu-item
        >
      </a-sub-menu>
      <a-sub-menu key="admin-suppliers-list">
        <template #title>
          <span>
            <user-outlined />
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
      <a-sub-menu key="admin-publishers-list">
        <template #title>
          <span>
            <team-outlined />
            <span>Nhà xuất bản</span>
          </span>
        </template>
        <a-menu-item
          key="admin-publishers-add"
          @click="navigateTo('admin-publishers-add')"
          >Thêm</a-menu-item
        >
        <a-menu-item
          key="admin-publishers-list"
          @click="navigateTo('admin-publishers-list')"
          >Danh sách</a-menu-item
        >
      </a-sub-menu>
      <a-sub-menu key="admin-receipts-list">
        <template #title>
          <span>
            <team-outlined />
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
      <a-sub-menu key="admin-stockProduct-list">
        <template #title>
          <span>
            <team-outlined />
            <span>Thống kê</span>
          </span>
        </template>
        <a-menu-item
          key="admin-publishers-add"
          @click="navigateTo('admin-publishers-add')"
          >Thêm</a-menu-item
        >
        <a-menu-item
          key="admin-stockProduct-list"
          @click="navigateTo('admin-stockProduct-list')"
          >Danh sách tồn kho</a-menu-item
        >
      </a-sub-menu>
      <a-menu-item key="admin-chats" @click="navigateTo('admin-chats')">
        <pie-chart-outlined />
        <span>Tin nhắn</span>
      </a-menu-item>
      <a-menu-item
        key="admin-comments-list"
        @click="navigateTo('admin-comments-list')"
      >
        <desktop-outlined />
        <span>Đánh giá</span>
      </a-menu-item>
      <a-sub-menu key="admin-vouchers-list">
        <template #title>
          <span>
            <team-outlined />
            <span>Mã giảm giá</span>
          </span>
        </template>
        <a-menu-item
          key="admin-vouchers-list"
          @click="navigateTo('admin-vouchers-list')"
          >Danh sách</a-menu-item
        >
        <a-menu-item
          key="admin-vouchers-voucherCategory-list"
          @click="navigateTo('admin-vouchers-voucherCategory-list')"
          >Loại giảm giá</a-menu-item
        >
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>
<script>
import { ref, onMounted, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useMenu } from "../../stores/use-menu.js";

export default defineComponent({
  setup(_, { emit }) {
    const collapsed = ref(false);
    const router = useRouter();
    const store = useMenu();

    const { selectedKeys, openKeys } = storeToRefs(store);
    const navigateTo = (routeName) => {
      selectedKeys.value = [routeName];
      emit("update:selectedKeys", selectedKeys.value);
      router.push({ name: routeName });
    };
    // onMounted(() => {
    //   if (!selectedKeys.value.length) {
    //     navigateTo("admin-users");
    //   }
    // });
    return { collapsed, navigateTo, selectedKeys };
  },
});
</script>
