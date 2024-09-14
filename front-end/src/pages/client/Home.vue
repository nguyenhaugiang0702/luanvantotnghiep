<template>
  <div class="container">
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
<script>
import Carousel from "../../components/client/Carousel.vue";
export default {
  components: {
    Carousel,
  },
  setup() {
    return {};
  },
};
</script>
<style scoped>
img {
  padding: 0; /* Đảm bảo không có padding */
  margin: 0; /* Đảm bảo không có margin */
  box-sizing: border-box; /* Đảm bảo kích thước tính đúng */
}
</style>
