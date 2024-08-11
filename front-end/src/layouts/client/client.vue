<template>
  <div>
    <Header />
    <div class="bg-primary py-4"></div>
    <Login_SignUp />
    <router-view></router-view>
    <!-- <Footer /> -->
  </div>
</template>
<script>

import Header from "../../components/client/Header.vue";
import Footer from "../../components/client/Footer.vue";
import Login_SignUp from "../../components/client/Login_SignUp.vue";

export default {
  components: {
    Header,
    Footer,
    Login_SignUp,
  },
  setup() {
    return {};
  },
};
</script>
