<template>
  <a-layout has-sider>
    <TheMenu />
    <a-layout>
      <a-layout-header
        class="text-uppercase fw-bold sticky-top d-flex justify-content-end align-items-center"
        style="background: #fff; padding: 0 20px"
      >
        <Header />
      </a-layout-header>
      <router-view></router-view>
    </a-layout>
  </a-layout>
</template>

<script setup>
import TheMenu from '../../components/admin/TheMenu.vue';
import Header from '../../components/admin/Header.vue';
</script>
