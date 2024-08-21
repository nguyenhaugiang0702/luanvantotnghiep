<template>
  <Carousel
    :value="products"
    :numVisible="1"
    :numScroll="1"
    :responsiveOptions="responsiveOptions"
    circular
    :autoplayInterval="3000"
  >
    <template #item="slotProps">
      <div class="rounded">
        <img
          :src="slotProps.data.image"
          alt="Product Image"
          class="rounded w-100"
        />
      </div>
    </template>
  </Carousel>
</template>

<script setup>
import Carousel from "primevue/carousel";
import { ref } from "vue";
// Import ảnh trực tiếp
import product1 from "@/assets/images/banners/banner1.jpg";
import product2 from "@/assets/images/banners/banner2.jpg";
import product3 from "@/assets/images/banners/banner3.jpg";
// Thêm ảnh từ máy cục bộ
const products = ref([
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

const responsiveOptions = ref([
  {
    breakpoint: "1400px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "1199px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "767px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
    numScroll: 1,
  },
]);
</script>
