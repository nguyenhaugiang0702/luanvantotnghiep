<template>
  <div>
    <Header />
    <div class="">
      <router-view></router-view>
    </div>
    <!-- Footer sẽ được hiển thị nếu không phải route "checkOut" -->
    <Footer v-if="!isCheckOutRoute" />
  </div>
</template>

<script>
import { defineComponent, ref, provide, watch } from "vue";
import { useRoute } from "vue-router";
import Header from "../../components/client/Header.vue";
import Footer from "../../components/client/Footer.vue";

export default defineComponent({
  components: {
    Header,
    Footer,
  },
  setup() {
    const updateCart = ref(0); // Biến chia sẻ cho việc theo dõi trạng thái giỏ hàng
    const route = useRoute();

    // Kiểm tra nếu route name là "checkOut"
    const isCheckOutRoute = ref(route.name === "checkout");
    // Cung cấp biến này cho các component con
    watch(route, (newRoute) => {
      isCheckOutRoute.value = newRoute.name === "checkout";
    });
    provide("updateCart", updateCart);

    return {
      updateCart,
      isCheckOutRoute,
    };
  },
});
</script>
