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
              <router-link
                class="text-decoration-none nav-link text-white text-uppercase fw-semibold"
                to="/"
                :class="{ active: currentPage === 'home' }"
              >
                Trang chủ
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="text-decoration-none nav-link text-white text-uppercase fw-semibold"
                :to="{ name: 'books' }"
                :class="{ active: currentPage === 'book-list' }"
              >
                Cửa hàng
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
<style scoped>
/* .active {
  border-bottom: 2px solid #fff;
} */
.nav-link {
  position: relative; /* Đặt vị trí của phần tử cha */
  overflow: hidden; /* Đảm bảo hiệu ứng không vượt ra ngoài phần tử */
  padding-bottom: 5px; /* Khoảng cách giữa văn bản và gạch dưới */
}

.nav-link::before {
  content: ""; /* Tạo pseudo-element trước nội dung của phần tử */
  position: absolute; /* Đặt vị trí của pseudo-element */
  bottom: 0; /* Đặt pseudo-element ở đáy của phần tử */
  left: 5px; /* Đặt pseudo-element bắt đầu từ trái của phần tử */
  height: 2px; /* Chiều cao của gạch dưới */
  width: 90%; /* Chiều rộng của gạch dưới */
  background-color: #fff; /* Màu sắc của gạch dưới */
  transition: transform 0.3s ease, width 0.3s ease; /* Hiệu ứng chuyển động */
  transform: scaleX(0); /* Bắt đầu từ chiều rộng bằng 0 */
  transform-origin: left; /* Đặt điểm gốc của transform tại trái */
}

.nav-link:hover::before {
  transform: scaleX(1); /* Mở rộng chiều rộng khi hover */
}

.nav-link.active::before {
  transform: scaleX(1); /* Đảm bảo gạch dưới luôn hiển thị đầy đủ khi đang hoạt động */
  background-color: #fff; /* Màu sắc của gạch dưới khi đang hoạt động */
}
</style>
