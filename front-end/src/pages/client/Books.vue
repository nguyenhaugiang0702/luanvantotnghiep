<template>
  <div class="row">
    <div class="d-flex mx-auto">
      <div class="mx-2">
        <router-link :to="{ name: 'home' }">
          <i style="color: black" class="fa-solid fa-house fs-4 my-1"></i>
        </router-link>
      </div>
      <p class="my-2 fw-bold col-12 text-uppercase">/ Tất cả sách</p>
    </div>
  </div>
  <div class="row">
    <div class="col-md-3">
      <Sidebar
        :filteredTagsDelete="filteredTagsDelete"
        @filteredBooks="handleFilteredBooks"
        @filteredTags="handleFilteredTags"
        @selected-ids="handleSelectedIds"
      />
    </div>
    <div class="col-md-9">
      <ListBook
        :selectedIds="selectedIds"
        :books="filteredBooks"
        :filteredTags="filteredTags"
        @filteredTagsDelete="handleFilteredTagsDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "../../components/client/books/Sidebar.vue";
import ListBook from "../../components/client/books/ListBook.vue";

const filteredBooks = ref([]);
const filteredTags = ref([]);
const filteredTagsDelete = ref({});
const selectedIds = ref([]);
const emit = defineEmits(["cartUpdated"]);

const handleFilteredBooks = (books) => {
  filteredBooks.value = books;
};

const handleFilteredTags = (tags) => {
  filteredTags.value = tags;
};

const handleFilteredTagsDelete = (tags) => {
  filteredTagsDelete.value = tags;
};

const handleSelectedIds = (ids) => {
  selectedIds.value = ids;
};
</script>
<style scoped></style>
