<template>
  <div class="col-sm-5">
    <div class="input-group my-4 w-100 border border-dark rounded-2">
      <input
        name="search_key"
        v-model="search_key"
        type="text"
        class="form-control border-0"
        placeholder="Nhập để tìm kiếm"
      />
      <button type="button" @click="searchBook" class="rounded-end border px-2">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
    <div class="position-relative">
      <ul
        v-if="books.length > 0"
        class="list-group position-absolute w-100 p-0 border border-dark"
        style="z-index: 1021; max-height: 500px; overflow: auto"
      >
        <li class="list-group-item pe-4">
          <div class="row" v-for="book in books" :key="book._id">
            <div class="col-1">
              <router-link
                :to="{ name: 'book-detail', params: { bookID: book._id } }"
              >
                <img
                  style="height: 5em"
                  :src="`http://localhost:3000/${book.images[0].path}`"
                />
              </router-link>
            </div>
            <div class="col-8 ms-5">
              <router-link
                class="text-decoration-none text-dark"
                :to="{ name: 'book-detail', params: { bookID: book._id } }"
              >
                {{ book.name }}
              </router-link>
            </div>

            <hr class="row my-2" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import BookService from "@/service/book.service";
import { formatPrice } from "@/utils/utils";
import { useDebounce } from "@/composables/useDebounce";
export default {
  setup() {
    const search_key = ref("");
    const books = ref([]);
    const router = useRouter();
    const bookService = new BookService();
    const debouncedSearchKey = useDebounce(search_key, 300);
    // Hàm tìm kiếm sách
    const searchBook = async () => {
      if (debouncedSearchKey.value.trim() !== "") {
        try {
          const response = await bookService.get(
            `/?searchKey=${debouncedSearchKey.value}`
          );
          if (response.status === 200) {
            books.value = response.data;
          }
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      } else {
        books.value = []; // Nếu từ khóa tìm kiếm rỗng thì xóa danh sách sách
      }
    };

    // Theo dõi thay đổi của debouncedSearchKey để kích hoạt tìm kiếm
    watch(debouncedSearchKey, () => {
      searchBook();
    });

    return {
      search_key,
      books,
      searchBook,
      formatPrice,
    };
  },
};
</script>
