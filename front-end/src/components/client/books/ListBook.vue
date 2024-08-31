<template>
  <!-- Nội dung sản phẩm bên phải -->
  <div class="content">
    <!-- Sắp xếp theo và số sản phẩm trên trang -->
    <div class="py-4 ps-2">
      <select class="form-select w-auto">
        <option value="8">8 sản phẩm</option>
        <option value="12">12 sản phẩm</option>
        <option value="16">16 sản phẩm</option>
      </select>
    </div>

    <!-- Danh sách sản phẩm -->
    <div class="row">
      <div class="col-md-3 mb-4" v-for="book in books" :key="book._id">
        <div class="book-card book card h-100 position-relative">
          <router-link
            :title="book.name"
            :to="{ name: 'book-detail', params: { bookID: book._id } }"
          >
            <img
              :src="`${config.imgUrl}/` + book.images[0].path"
              class="card-img-top w-75" 
              alt="book image"
            />
          </router-link>

          <div class="card-body">
            <router-link
              :title="book.name"
              :to="{ name: 'book-detail', params: { bookID: book._id } }"
              ><p class="card-title text-dark">
                {{ truncateTitle(book.name) }}
              </p></router-link
            >
            <p class="card-text text-danger fw-bold fs-5">
              {{
                formatCurrency(
                  book.detail.originalPrice - book.detail.discountPrice
                )
              }}
            </p>
            <p class="card-text text-decoration-line-through opacity-75">
              {{ formatCurrency(book.detail.originalPrice) }}
            </p>
            <!-- Nút Xem và Add to Cart hiển thị khi hover -->
            <div
              class="hover-buttons position-absolute bottom-0 start-0 end-0 p-3 text-center"
            >
              <button class="btn btn-primary me-2">Xem</button>
              <button class="btn btn-success">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Phân trang -->
    <div class="d-flex justify-content-between align-items-center">
      <button class="btn btn-primary" @click="goToPreviousPage">
        Trang trước
      </button>
      <span>Trang {{ currentPage }} trên {{ totalPages }}</span>
      <button class="btn btn-primary" @click="goToNextPage">Trang sau</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BookService from "@/service/book.service";
import config from "@/config/index";
// Dữ liệu sản phẩm mẫu
const books = ref([]);

const currentPage = ref(1);
const totalPages = ref(5);
const bookService = new BookService();
const getBooks = async () => {
  const response = await bookService.get("/");
  if (response.status === 200) {
    books.value = response.data;
  }
};

// Hàm định dạng tiền
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// Hàm cắt ngắn tên sách nếu quá dài
const truncateTitle = (title) => {
  const maxLength = 40; // Độ dài tối đa trước khi cắt
  return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
};

onMounted(() => {
  getBooks();
});

// Chuyển sang trang trước
const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Chuyển sang trang sau
const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
</script>

<style scoped>
.content {
  background-color: #fff;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
/* Thêm hiệu ứng box-shadow khi hover */
.book {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.book-card {
  overflow: hidden; /* Ngăn chặn việc tràn nội dung ra ngoài card */
}

.book:hover {
  transform: translateY(-10px);
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

/* Đặt các nút ban đầu nằm dưới cùng, ngoài tầm nhìn */
.hover-buttons {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  opacity: 0;
  transition: all 0.3s ease-in-out;
}
/* Khi hover vào thẻ sản phẩm, di chuyển các nút lên */
.book-card:hover .hover-buttons {
  bottom: 10px; /* Đặt vị trí các nút lên phía trên */
  opacity: 1; /* Hiển thị nút */
}

/* Các hiệu ứng chung cho thẻ sách */
.book-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.book-card:hover {
  transform: translateY(-10px);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 10px 20px;
}
</style>
