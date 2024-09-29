<template>
  <div class="bg-white" style="padding: 2rem 0">
    <div class="d-flex flex-column justify-content-between align-items-center">
      <img src="../../../assets/images/cart/carrtnull.svg" alt="" />
      <div class="mt-4">Chưa có sản phẩm trong giỏ hàng của bạn.</div>
      <router-link to="/books" class="text-decoration-none text-white btn btn-primary text-uppercase mt-4">Mua ngay</router-link>
    </div>
  </div>
</template>

<script> 
import { defineComponent } from "vue";

export default defineComponent({
  name: "EmptyCart",
});
</script>

<style scoped></style>
