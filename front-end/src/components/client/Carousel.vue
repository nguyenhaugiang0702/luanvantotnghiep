<template>
  <Carousel :autoplay="3000" :wrap-around="true" ref="carousel">
    <Slide v-for="slide in slides" :key="slide">
      <div class="w-100">
        <div class="rounded">
          <img :src="slide.image" alt="Product Image" class="w-100 img-slide" />
        </div>
      </div>
    </Slide>
    <template #addons>
      <Pagination />
    </template>
  </Carousel>
</template>

<script setup>
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { ref } from "vue";
// Import ảnh trực tiếp
import product1 from "@/assets/images/banners/banner1.jpg";
import product2 from "@/assets/images/banners/banner2.jpg";
import product3 from "@/assets/images/banners/banner3.jpg";
// Thêm ảnh từ máy cục bộ
const slides = ref([
  {
    image: product1,
  },
  {
    image: product2,
  },
  {
    image: product3,
  },
]);
</script>
<style scoped>
.img-slide{
  max-height: 30rem;
}
</style>
