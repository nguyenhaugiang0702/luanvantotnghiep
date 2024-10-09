<template>
  <!-- Nội dung sản phẩm bên phải -->
  <div class="content">
    <!-- Filters Tag -->
    <div
      v-if="hasFilteredTags"
      class="filter-section p-3 mb-4 bg-light rounded-3"
    >
      <div class="d-flex flex-wrap gap-3">
        <!-- Filter label -->
        <div class="filter-label d-flex align-items-center">
          <i class="fas fa-filter me-2"></i>
          <span class="fw-medium">Lọc theo:</span>
        </div>

        <!-- Filter tags container -->
        <div class="filter-tags-container d-flex flex-wrap gap-2 flex-grow-1">
          <div
            v-for="filter in filterMessages"
            :key="filter.id"
            class="filter-tag d-inline-flex align-items-center bg-white rounded-pill px-3 py-2"
          >
            <span class="filter-text me-2">{{ filter.message }}</span>
            <button
              @click="clearFilter(filter.id)"
              class="btn-clear d-flex align-items-center justify-content-center"
              title="Xóa filter"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Clear all button -->
          <button
            v-if="filterMessages.length > 1"
            @click="handleClearFilters"
            class="btn-clear-all d-inline-flex align-items-center rounded-pill px-3 py-2"
          >
            <i class="fas fa-times-circle me-2"></i>
            Xóa tất cả
          </button>
        </div>
      </div>
    </div>

    <div class="d-flex flex-wrap align-items-center gap-2">
      <!-- Số sản phẩm trên trang -->
      <div class="ps-2">
        <select class="form-select w-auto" v-model="itemsPerPage">
          <option value="8">8 sản phẩm</option>
          <option value="12">12 sản phẩm</option>
          <option value="24">24 sản phẩm</option>
        </select>
      </div>

      <!-- Sắp xếp theo giá -->
      <div class="py-2 ps-2">
        <select class="form-select w-auto" v-model="sortBy">
          <option selected value="">Sắp xếp theo</option>
          <option value="asc">Giá tăng</option>
          <option value="desc">Giá giảm</option>
        </select>
      </div>

      <!-- Tìm kiếm -->
      <div class="py-4 ps-2" style="flex-grow: 1">
        <div class="d-flex align-items-center">
          <input
            type="search"
            v-model="searchQuery"
            class="form-control me-2"
            placeholder="Search..."
            @keyup.enter="handleSearch"
            style="flex-grow: 1"
          />
          <button class="btn btn-primary me-2">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Danh sách sản phẩm -->
    <div class="row" v-if="books.length !== 0">
      <div class="col-md-3 mb-4" v-for="book in books" :key="book._id">
        <div class="book-card book card h-100 position-relative">
          <div class="image-container">
            <router-link
              @click="updateView(book._id)"
              :title="book.name"
              :to="{ name: 'book-detail', params: { bookID: book._id } }"
            >
              <img
                :src="`${config.imgUrl}/` + book.images[0].path"
                class="card-img-top w-75 mx-4"
                alt="book image"
              />
            </router-link>
            <!-- Nút Xem và Add to Cart hiển thị khi hover -->
            <div class="hover-overlay">
              <div class="hover-buttons">
                <router-link
                  @click="updateView(book._id)"
                  :to="{ name: 'book-detail', params: { bookID: book._id } }"
                  class="btn btn-outline-primary me-2"
                  ><i class="fa-solid fa-eye"></i
                ></router-link>
                <button v-if="book.quantityImported !== 0" class="btn btn-primary" @click="addToCart(book)">
                  <i class="fa fa-cart-plus" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="card-body">
            <router-link
              @click="updateView(book._id)"
              class="text-decoration-none"
              :title="book.name"
              :to="{ name: 'book-detail', params: { bookID: book._id } }"
            >
              <p class="card-title text-dark">
                {{ truncateTitle(book.name) }}
              </p>
            </router-link>
            <div class="card-text">
              <span class="text-danger fw-bold fs-5">
                {{
                  formatPrice(
                    book.detail.originalPrice - book.detail.discountPrice
                  )
                }}</span
              >

              <div class="text-decoration-line-through opacity-75">
                {{ formatPrice(book.detail.originalPrice) }}
              </div>
              <div v-if="book.quantityImported !== 0">
                Còn lại: ({{ book.quantityImported - book.quantitySold }}) quyển
              </div>
              <div v-else>
                Đang nhập hàng
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Phân trang -->
    <div class="d-flex justify-content-center align-items-center">
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPreviousPage">
              Previous
            </button>
          </li>

          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="handlePage(page)">
              {{ page }}
            </button>
          </li>

          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button class="page-link" @click="goToNextPage">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, inject } from "vue";
import ApiUser from "@/service/user/apiUser.service";
import config from "@/config/index";
import Cookies from "js-cookie";
import { toast } from "vue3-toastify";
import { formatPrice } from "@/utils/utils";
import { useRouter } from "vue-router";

const books = ref([]);
const apiUser = new ApiUser();

const token = Cookies.get("accessToken");
const isLoggedIn = Cookies.get("isLoggedIn");
const updateCart = inject("updateCart");
const currentPage = ref(1);
const itemsPerPage = ref(8);
const totalPages = ref();
const filters = ref({});
const updatedItems = ref({});
const sortBy = ref("");
const searchQuery = ref("");
const router = useRouter();
const props = defineProps({
  selectedIds: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(["filteredTagsDelete"]);

// Hàm cắt ngắn tên sách nếu quá dài
const truncateTitle = (title) => {
  const maxLength = 40; // Độ dài tối đa trước khi cắt
  return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
};

const hasFilteredTags = computed(() => {
  // Kiểm tra xem có bất kỳ mảng nào trong filteredTags không rỗng
  return Object.values(props.selectedIds).some((arr) => arr.length > 0);
});

const updateView = async (bookID) => {
  try {
    const response = await apiUser.put(`/books/view/${bookID}`, { view: 1 });
    if (response.status === 200) {
      // router.push({ name: "book-detail", params: { bookID: bookID } });
    }
  } catch (error) {
    console.log(error);
  }
};

// Tạo danh sách các thông điệp riêng biệt cho từng mục
const filterMessages = computed(() => {
  const messages = [];

  for (const [key, values] of Object.entries(props.selectedIds)) {
    if (values.length > 0) {
      values.forEach((item) => {
        let message;
        switch (key) {
          case "price":
            message = `Giá: ${item.name}`;
            break;
          case "category":
            message = `Thể loại: ${item.name}`;
            break;
          case "author":
            message = `Tác giả: ${item.name}`;
            break;
          case "formality":
            message = `Hình thức: ${item.name}`;
            break;
          case "publisher":
            message = `Nhà xuất bản: ${item.name}`;
            break;
          default:
            message = "";
        }
        messages.push({ id: item.id, message });
      });
    }
  }

  return messages;
});

const clearFilter = (id) => {
  const key = getKeyById(id); // Tạo hàm getKeyById để tìm kiếm key dựa trên id
  if (key) {
    updatedItems.value = props.selectedIds[key].filter(
      (item) => item.id !== id
    );

    const updatedTags = { ...props.filteredTags, [key]: updatedItems.value };
    emit("filteredTagsDelete", updatedTags);
    // Cập nhật danh sách sách theo bộ lọc mới
    const filtersWithIds = Object.entries(updatedTags).reduce(
      (acc, [key, arr]) => {
        const ids = arr.map((item) => item.id).filter((id) => id !== undefined);
        if (ids.length > 0) {
          acc[key] = ids;
        }
        return acc;
      },
      {}
    );
    getBooks(
      filtersWithIds,
      currentPage.value,
      itemsPerPage.value,
      sortBy.value
    );
  }
};

const handleClearFilters = async () => {
  const updatedTags = {};
  emit("filteredTagsDelete", updatedTags);
  await getBooks({}, currentPage.value, itemsPerPage.value, sortBy.value);
};

const getKeyById = (id) => {
  for (const [key, values] of Object.entries(props.selectedIds)) {
    if (values.some((item) => item.id === id)) {
      return key;
    }
  }
  return null;
};

const addToCart = async (book) => {
  if (!token || !isLoggedIn) {
    toast("Vui lòng đăng nhập", {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
    return;
  }
  try {
    const data = {
      books: [
        {
          bookID: book._id,
          quantity: 1,
          price: book.detail.originalPrice - book.detail.discountPrice,
        },
      ],
    };

    const response = await apiUser.post("/cart", data);
    if (response.status === 200) {
      toast(response.data.message, {
        theme: "auto",
        type: "success",
        dangerouslyHTMLString: true,
      });
      updateCart.value += 1; // Cập nhật giỏ hàng
    }
  } catch (error) {
    toast(error.response?.data?.message, {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
  }
};

const getBooks = async (filters, page, limit, sortBy, searchQuery = "") => {
  const filtersString = JSON.stringify(filters);
  const response = await apiUser.get(
    `/books/filters?filters=${filtersString}&page=${page}&limit=${limit}&sortBy=${sortBy}&searchQuery=${searchQuery}`
  );
  if (response.status === 200) {
    books.value = response.data.books;
    totalPages.value = response.data.totalPages;
    currentPage.value = response.data.currentPage;
  }
};

onMounted(() => {
  getBooks({}, currentPage.value, itemsPerPage.value, sortBy.value);
});

watch(
  [() => props.selectedIds, () => itemsPerPage.value, () => sortBy.value],
  async ([newSelectedIds, newItemsPerPage, newSortBy]) => {
    if (newItemsPerPage) {
      currentPage.value = 1;
    }
    filters.value = newSelectedIds;
    // Chuyển đổi newSelectedIds thành dạng {key: [id1, id2, ...]}
    const filtersWithIds = Object.entries(newSelectedIds).reduce(
      (acc, [key, arr]) => {
        const ids = arr.map((item) => item.id).filter((id) => id !== undefined);
        if (ids.length > 0) {
          acc[key] = ids;
        }
        return acc;
      },
      {}
    );

    // Gọi API để lấy sách mới
    await getBooks(
      filtersWithIds,
      currentPage.value,
      newItemsPerPage,
      newSortBy
    );
  },
  { deep: true }
);

// Search
const handleSearch = async () => {
  try {
    const filtersString = JSON.stringify(filters.value);
    await getBooks(
      filtersString,
      currentPage.value,
      itemsPerPage.value,
      sortBy.value,
      searchQuery.value
    );
  } catch (error) {
    toast("Error fetching data", {
      type: "error",
    });
  }
};

const handlePage = async (page) => {
  currentPage.value = page;
  const filtersString = JSON.stringify(filters.value);
  await getBooks(
    filtersString,
    currentPage.value,
    itemsPerPage.value,
    sortBy.value,
    searchQuery.value
  );
};

// Chuyển sang trang trước
const goToPreviousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    const filtersString = JSON.stringify(filters.value);
    await getBooks(
      filtersString,
      currentPage.value,
      itemsPerPage.value,
      sortBy.value,
      searchQuery.value
    );
  }
};

// Chuyển sang trang sau
const goToNextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    const filtersString = JSON.stringify(filters.value);
    await getBooks(
      filtersString,
      currentPage.value,
      itemsPerPage.value,
      sortBy.value,
      searchQuery.value
    );
  }
};
</script>

<style scoped>
.content {
  background-color: #fff;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.book-card {
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.book-card:hover {
  transform: translateY(-10px);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 10px 20px;
}

.image-container {
  position: relative;
  overflow: hidden;
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7); /* Màu trắng với độ trong suốt */
  opacity: 0; /* Ẩn lớp overlay ban đầu */
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease; /* Hiệu ứng chuyển đổi khi hover */
}

.book-card:hover .hover-overlay {
  opacity: 1;
  pointer-events: auto;
}

.hover-buttons {
  text-align: center;
}

.hover-buttons .btn {
  margin: 5px;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.book-card:hover .hover-buttons .btn {
  transform: translateY(0);
}

.btn-tag {
  outline: none;
  border: none;
  background-color: red;
  color: #fff;
}

/* Tags */
.filter-section {
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.filter-label {
  color: #6c757d;
  white-space: nowrap;
}

.filter-tag {
  border: 1px solid #dee2e6;
  transition: all 0.2s ease;
}

.filter-tag:hover {
  border-color: #6c757d;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-text {
  color: #495057;
  font-size: 0.9rem;
}

.btn-clear {
  background: none;
  border: none;
  color: #dc3545;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  background-color: #dc3545;
  color: white;
}

.btn-clear-all {
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.btn-clear-all:hover {
  background-color: #dc3545;
  color: white;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filter-section {
    padding: 0.75rem !important;
  }

  .filter-label {
    margin-bottom: 0.5rem;
    width: 100%;
  }

  .filter-tags-container {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .filter-tag {
    width: 100%;
    justify-content: space-between;
  }

  .btn-clear-all {
    width: 100%;
    justify-content: center;
  }
}
</style>
