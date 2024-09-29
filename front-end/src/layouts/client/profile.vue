<template>
  <div class="container-fluid bg-primary py-4">
    <div class="container text-white">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start">
        <div class="d-flex flex-column mb-3 mb-md-0">
          <div class="fw-bold text-uppercase fs-5">Quản lý tài khoản</div>
          <div>Hãy quản lý thông tin cá nhân cẩn thận</div>
        </div>
        <div class="align-self-md-center">
          <span @click="handleNavigate(router, 'home')">Tài khoản </span>
          <span>/ Thông tin cá nhân</span>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row py-4">
      <!-- Sidebar Component -->
      <div class="col-md-3">
        <Sidebar />
      </div>
      <!-- Content Component -->
      <div class="col-md-9 content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import Sidebar from "@/components/client/profile/Sidebar.vue";
export default {
  components: {
    Sidebar,
  },
  setup() {
    return {};
  },
};
</script>
