<template>
  <a-layout has-sider>
    <TheMenu />
    <a-layout>
      <router-view></router-view>
    </a-layout>
  </a-layout>
</template>
<script setup>
import TheMenu from "../../components/admin/TheMenu.vue";
</script>
<style scoped>
/* @import '../../assets/css/index.css'; */
</style>
