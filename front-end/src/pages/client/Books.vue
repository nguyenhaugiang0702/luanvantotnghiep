<template>
  <div class="container-fluid bg-primary py-4">
    <div class="container text-white">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex flex-column">
          <div class="fw-bold text-uppercase fs-5">Danh mục cửa hàng</div>
          <div>Hãy lựa chọn sách cho phù hợp với chính mình</div>
        </div>
        <div> <span @click="handleNavigate(router, 'home')">Trang chủ </span> <span>/ Cửa hàng</span></div>
      </div>
    </div>
  </div>

  <div class="container mt-4">
    <!-- <div class="row">
      <div class="d-flex mx-auto">
        <div class="mx-2">
          <router-link :to="{ name: 'home' }">
            <i style="color: black" class="fa-solid fa-house fs-4 my-1"></i>
          </router-link>
        </div>
        <p class="my-2 fw-bold col-12 text-uppercase">/ Tất cả sách</p>
      </div>
    </div> -->
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
