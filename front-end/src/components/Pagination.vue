<template>
  <!-- Phân trang -->
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li
        class="page-item"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <a class="page-link" href="#">Previous</a>
      </li>
      <li class="page-item" v-for="page in totalPages">
        <a
          class="page-link"
          :class="{ active: page === currentPage }"
          href="#"
          @click="changePage(page)"
          >{{ page }}</a
        >
      </li>
      <li
        class="page-item"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        <a class="page-link" href="#">Next</a>
      </li>
    </ul>
  </nav>
</template>
<script setup>
import { ref, defineProps, defineEmits } from "vue";

// Nhận props từ component cha
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

// Gửi sự kiện khi trang thay đổi
const emit = defineEmits(["updatePage"]);
const changePage = (page) => {
  if (page > 0 && page <= props.totalPages) {
    emit("updatePage", page);
  }
};
</script>
