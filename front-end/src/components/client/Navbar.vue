<template>
  <div class="sticky-top z-4">
    <nav class="navbar navbar-expand-lg bg-secondary">
      <div class="container-fluid">
        <button
          class="navbar-toggler text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon text-white"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <router-link class="text-decoration-none" to="/">
                <a
                  class="nav-link text-white text-uppercase fw-semibold"
                  aria-current="page"
                  href="#"
                  >Trang chủ</a
                >
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="text-decoration-none" :to="{ name: 'books' }">
                <a
                  class="nav-link text-white text-uppercase fw-semibold"
                  aria-current="page"
                  href="#"
                  >Cửa hàng</a
                >
              </router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white text-uppercase fw-semibold" href="#"
                >Mã giảm giá</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link text-white text-uppercase fw-semibold">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>
        <div class="d-lg-none d-block">
          <span class="text-white">Menu</span>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
import ApiService from "@/service/ApiService";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const publishers = ref([]);
    const route = useRoute();
    const apiService = new ApiService();
    const currentPage = computed(() => route.name);

    const getPublishers = async () => {
      const response = await apiService.get("publishers");
      if (response.status === 200) {
        publishers.value = response.data;
      }
    };

    onMounted(() => {
      // getPublishers();
    });

    return {
      publishers,
      currentPage,
      // getPublishers,
    };
  },
};
</script>
<style>
.active {
  border-bottom: 2px solid #fff;
}
</style>
