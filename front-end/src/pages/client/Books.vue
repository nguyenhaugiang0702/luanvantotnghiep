<template>
  <div class="bg-secondary-subtle py-5">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <Sidebar />
        </div>
        <div class="col-md-9">
          <ListBook />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "../../components/client/books/Sidebar.vue";
import ListBook from "../../components/client/books/ListBook.vue";
</script>

<style scoped></style>
