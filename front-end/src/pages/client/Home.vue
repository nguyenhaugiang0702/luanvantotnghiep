<template>
  <div class="container-fluid bg-primary py-4">
    <div class="container text-white">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex flex-column">
          <div class="fw-bold text-uppercase fs-5">Trang chủ</div>
          <div>Hãy lựa chọn sách cho phù hợp với chính mình</div>
        </div>
        <div> <span>Trang chủ </span></div>
      </div>
    </div>
  </div>
  <div class="container mt-4">
    <div class="row">
      <div class="col-sm-8"><Carousel /></div>
      <div class="col-sm-4">
        <div class="row mb-1">
          <img
            src="../../assets/images/banners/banner1.jpg"
            class="rounded"
            alt=""
            srcset=""
          />
        </div>
        <div class="row">
          <img
            src="../../assets/images/banners/banner2.jpg"
            class="rounded"
            alt=""
            srcset=""
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Carousel from "../../components/client/Carousel.vue";
</script>
<style scoped>
img {
  padding: 0; /* Đảm bảo không có padding */
  margin: 0; /* Đảm bảo không có margin */
  box-sizing: border-box; /* Đảm bảo kích thước tính đúng */
}
</style>
