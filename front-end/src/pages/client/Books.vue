<template>
  <div class="container-fluid bg-primary py-4">
    <div class="container text-white">
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-start"
      >
        <div class="d-flex flex-column mb-3 mb-md-0">
          <div class="fw-bold text-uppercase fs-5">Danh mục cửa hàng</div>
          <div>Hãy lựa chọn sách cho phù hợp với chính mình</div>
        </div>
        <div class="align-self-md-center">
          <div>
            <span @click="handleNavigate(router, 'home')">Trang chủ </span>
            <span>/ Cửa hàng</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container py-4 ">
    <div class="row">
      <div class="col-md-3">
        <Sidebar
          :filteredTagsDelete="filteredTagsDelete"
          @selected-ids="handleSelectedIds"
        />
      </div>
      <div class="col-md-9">
        <ListBook
          :selectedIds="selectedIds"
          @filteredTagsDelete="handleFilteredTagsDelete"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "../../components/client/books/Sidebar.vue";
import ListBook from "../../components/client/books/ListBook.vue";
import { handleNavigate } from "@/utils/utils";
const router = useRouter();
const filteredTagsDelete = ref({});
const selectedIds = ref([]);

const handleFilteredTagsDelete = (tags) => {
  filteredTagsDelete.value = tags;
};

const handleSelectedIds = (ids) => {
  selectedIds.value = ids;
};
</script>
<style scoped></style>
