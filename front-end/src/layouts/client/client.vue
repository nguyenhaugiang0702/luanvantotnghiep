<template>
  <div>
    <Header />
    <Navbar />
    <router-view></router-view>
    <Footer />
  </div>
</template>
<script>
import Header from "../../components/client/Header.vue";
import Footer from "../../components/client/Footer.vue";
import Navbar from "../../components/client/Navbar.vue";

export default {
  components: {
    Header,
    Footer,
    Navbar,
  },
  setup() {
    return {};
  },
};
</script>
<style>
@import '../../assets/css/index.css';
</style>