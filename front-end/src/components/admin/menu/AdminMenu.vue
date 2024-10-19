<template>
  <a-menu-item key="admin-users" @click="navigateTo('admin-users')">
    <img
      class="me-3"
      src="../../../assets/images/admin/users.png"
      alt=""
      style="width: 30px; height: 30px"
    />
    <span>Người dùng</span>
  </a-menu-item>
  <a-menu-item
    key="admin-authors-list"
    @click="navigateTo('admin-authors-list')"
  >
    <img
      class="me-3"
      src="../../../assets/images/admin/authors.png"
      alt=""
      style="width: 30px; height: 30px"
    />
    <span>Tác giả</span>
  </a-menu-item>
  <a-menu-item key="admin-categories" @click="navigateTo('admin-categories')">
    <img
      class="me-3"
      src="../../../assets/images/admin/categories.png"
      alt=""
      style="width: 30px; height: 30px"
    />
    <span>Thể loại</span>
  </a-menu-item>
  

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
  <a-sub-menu key="admin-books-list">
    <template #title>
      <span>
        <img
          class="me-3"
          src="../../../assets/images/admin/books.png"
          alt=""
          style="width: 30px; height: 30px"
        />
        <span>Sản phẩm</span>
      </span>
    </template>
    <a-menu-item key="admin-books-add" @click="navigateTo('admin-books-add')"
      >Thêm</a-menu-item
    >
    <a-menu-item key="admin-books-list" @click="navigateTo('admin-books-list')"
      >Danh sách</a-menu-item
    >
  </a-sub-menu>
  <a-sub-menu key="admin-publishers-list">
    <template #title>
      <span>
        <img
          class="me-3"
          src="../../../assets/images/admin/publishers.png"
          alt=""
          style="width: 30px; height: 30px"
        />
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
  <a-menu-item key="admin-formalities" @click="navigateTo('admin-formalities')">
    <img
      class="me-3"
      src="../../../assets/images/admin/formalities.png"
      alt=""
      style="width: 30px; height: 30px"
    />
    <span>Hình thức</span>
  </a-menu-item>
  <a-menu-item
    key="admin-priceranges-list"
    @click="navigateTo('admin-priceranges-list')"
  >
    <img
      class="me-3"
      src="../../../assets/images/admin/priceranges.png"
      alt=""
      style="
        width: 30px;
        height: 30px;
        background-color: #fff;
        border-radius: 15%;
      "
    />
    <span>Khoản giá</span>
  </a-menu-item>
  <!-- Quản lý Tin nhắn -->
  <a-menu-item key="admin-chats" @click="navigateTo('admin-chats')">
    <i class="fa-solid fa-comments fs-4 me-3"></i>
    <span>Tin nhắn</span>
  </a-menu-item>
  
  <a-sub-menu key="admin-stockProduct-list">
    <template #title>
      <span>
        <img
          class="me-3"
          src="../../../assets/images/admin/statistical.png"
          alt=""
          style="width: 30px; height: 30px"
        />
        <span>Thống kê</span>
      </span>
    </template>
    <a-menu-item
      key="admin-stockProduct-list"
      @click="navigateTo('admin-stockProduct-list')"
      >Danh sách tồn kho</a-menu-item
    >
  </a-sub-menu>
  <a-menu-item
    key="admin-comments-list"
    @click="navigateTo('admin-comments-list')"
  >
    <img
      class="me-3"
      src="../../../assets/images/admin/rating.png"
      alt=""
      style="width: 30px; height: 30px"
    />
    <span>Đánh giá</span>
  </a-menu-item>
  <a-sub-menu key="admin-vouchers-list">
    <template #title>
      <span>
        <img
          class="me-3"
          src="../../../assets/images/admin/vouchers.png"
          alt=""
          style="width: 30px; height: 30px"
        />
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
  <a-sub-menu key="admin-role-management-employee">
    <template #title>
      <span>
        <img
          class="me-3"
          src="../../../assets/images/admin/privacy.png"
          alt=""
          style="width: 30px; height: 30px"
        />
        <span>Phân quyền</span>
      </span>
    </template>
    <a-menu-item
      key="admin-role-management-employee"
      @click="navigateTo('admin-role-management-employee')"
      >Nhân viên</a-menu-item
    >
    <a-menu-item
      key="admin-role-management-list"
      @click="navigateTo('admin-role-management-list')"
      >Danh sách quyền</a-menu-item
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

    const admin = ref({});
    const getAdmin = async () => {
      const response = await apiAdmin.get("/admins/infoAdmin");
      if (response.status === 200) {
        admin.value = response.data;
        if (admin.value.role === "admin") {
          navigateTo("admin-home");
        }
      }
    };

    onMounted(() => {
      getAdmin();
    });
    return { navigateTo, selectedKeys };
  },
});
</script>
