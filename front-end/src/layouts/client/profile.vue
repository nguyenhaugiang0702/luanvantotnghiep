<template>
  <div class="row">
    <div class="d-flex mx-auto">
      <div class="mx-2">
        <router-link :to="{ name: 'home' }">
          <i style="color: black" class="fa-solid fa-house fs-4 my-1"></i>
        </router-link>
      </div>
      <p class="my-2 fw-bold col-12 text-uppercase">/ Thông tin cá nhân</p>
    </div>
    <!-- Sidebar Component -->
    <div class="col-md-3">
      <Sidebar />
    </div>
    <!-- Content Component -->
    <div class="col-md-9 content">
      <router-view></router-view>
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
