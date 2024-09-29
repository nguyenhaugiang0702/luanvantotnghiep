<template>
  <div class="sidebar bg-white" style="max-height: 500px">
    <div class="container">
      <h4 class="p-3">TÀI KHOẢN</h4>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link
            :to="{ name: 'profile-infoUser' }"
            class="nav-link"
            :class="{
              active: currentPage === 'profile-infoUser',
            }"
            >Thông tin tài khoản</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'profile-address' }"
            class="nav-link"
            :class="{
              active:
                currentPage === 'profile-address-list' ||
                currentPage === 'profile-address-add' ||
                currentPage === 'profile-address-edit',
            }"
            >Số địa chỉ</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'profile-orders' }"
            class="nav-link"
            :class="{
              active:
                currentPage === 'profile-orders-list' ||
                currentPage === 'profile-orders-detail',
            }"
            >Đơn hàng của tôi</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'profile-password' }"
            class="nav-link"
            :class="{
              active: currentPage === 'profile-password',
            }"
            >Đổi mật khẩu</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: '' }"
            class="nav-link"
            :class="{
              active: currentPage === '',
            }"
            >Vi voucher</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: '' }"
            class="nav-link"
            :class="{
              active: currentPage === '',
            }"
            >Sách theo dõi</router-link
          >
        </li>
        <li class="nav-item pb-2">
          <router-link
            :to="{ name: '' }"
            class="nav-link"
            :class="{
              active: currentPage === '',
            }"
            >Nhận xét của tôi</router-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const currentPage = computed(() => route.name);
</script>

<style scoped>
/* Hover and active */
.nav-link {
  position: relative; /* Đặt vị trí của phần tử cha */
  overflow: hidden; /* Đảm bảo hiệu ứng không vượt ra ngoài phần tử */
  padding-bottom: 5px; /* Khoảng cách giữa văn bản và gạch dưới */
  color: #000;
  transition: color 0.3s ease;
}

.nav-link::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0; /* Đặt bắt đầu từ trái của phần tử */
  height: 2px; /* Độ dày của gạch dưới */
  width: 100%; /* Độ rộng của gạch dưới */
  background-color: var(
    --bs-primary
  ); /* Màu gạch dưới, sử dụng màu primary của Bootstrap */
  transition: transform 0.3s ease, width 0.3s ease; /* Hiệu ứng chuyển động */
  transform: scaleX(0); /* Gạch dưới ban đầu sẽ có chiều rộng bằng 0 */
  transform-origin: left; /* Bắt đầu từ trái khi mở rộng */
}

.nav-link:hover {
  color: var(--bs-primary); /* Đổi màu chữ khi hover thành màu xanh Bootstrap */
}

.nav-link:hover::before {
  transform: scaleX(1); /* Hiển thị gạch dưới khi hover */
}

.nav-link.active {
  color: var(--bs-primary); /* Màu xanh khi mục được chọn */
}

.nav-link.active::before {
  transform: scaleX(1); /* Gạch dưới sẽ hiện đầy đủ khi mục được chọn */
}
</style>
