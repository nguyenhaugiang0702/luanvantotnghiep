<template>
  <!-- Phân trang -->
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <!-- Nút Previous -->
      <li
        class="page-item"
        :class="{ disabled: currentPage === 1 }"
        @click="changePage(currentPage - 1)"
      >
        <a class="page-link" href="#">Previous</a>
      </li>

      <!-- Hiển thị danh sách các trang -->
      <li
        v-for="(page, index) in visiblePages"
        :key="index"
        class="page-item"
        :class="{ active: page === currentPage, disabled: page === '...' }"
        @click="page !== '...' && changePage(page)"
      >
        <a class="page-link" href="#">{{ page }}</a>
      </li>

      <!-- Nút Next -->
      <li
        class="page-item"
        :class="{ disabled: currentPage === totalPages }"
        @click="changePage(currentPage + 1)"
      >
        <a class="page-link" href="#">Next</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";

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

// Tính toán các trang hiển thị
const visiblePages = computed(() => {
  const { currentPage, totalPages } = props;
  const maxVisiblePages = 5; // Số lượng trang tối đa hiển thị (bao gồm ...)
  const pages = [];

  if (totalPages <= maxVisiblePages) {
    // Nếu tổng số trang nhỏ hơn maxVisiblePages, hiển thị tất cả
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Thêm trang đầu tiên
    pages.push(1);

    // Thêm dấu chấm nếu cần
    if (currentPage > 3) {
      pages.push("...");
    }

    // Hiển thị các trang xung quanh currentPage
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Thêm dấu chấm nếu cần
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Thêm trang cuối cùng
    pages.push(totalPages);
  }

  return pages;
});
</script>
