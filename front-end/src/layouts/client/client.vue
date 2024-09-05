<template>
  <div>
    <Header />
    <Navbar />
    <div class="bg-secondary-subtle">
      <div class="container py-3"><router-view></router-view></div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { defineComponent, ref, provide } from "vue";
import Header from "../../components/client/Header.vue";
import Footer from "../../components/client/Footer.vue";
import Navbar from "../../components/client/Navbar.vue";

export default defineComponent({
  components: {
    Header,
    Footer,
    Navbar,
  },
  setup() {
    const updateCart = ref(0); // Biến chia sẻ cho việc theo dõi trạng thái giỏ hàng

    // Cung cấp biến này cho các component con
    provide("updateCart", updateCart);

    return {
      updateCart,
    };
  },
});
</script>
