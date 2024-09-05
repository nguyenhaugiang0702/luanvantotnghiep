<template>
  <div class="sidebar bg-white" style="max-height: 500px">
    <div class="container">
      <h4 class="p-3">TÀI KHOẢN</h4>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link :to="{name: 'profile-infoUser'}" class="nav-link">Thông tin tài khoản</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{name: 'profile-address'}" class="nav-link">Số địa chỉ</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{name: ''}" class="nav-link">Đơn hàng của tôi</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{name: 'profile-password'}" class="nav-link">Đổi mật khẩu</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{name: ''}" class="nav-link">Vi voucher</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{name: ''}" class="nav-link">Sách theo dõi</router-link>
        </li>
        <li class="nav-item pb-2">
          <router-link :to="{name: ''}" class="nav-link">Nhận xét của tôi</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.nav-link {
  color: black;
}

.nav-link:hover {
  color: blue;
}
</style>
