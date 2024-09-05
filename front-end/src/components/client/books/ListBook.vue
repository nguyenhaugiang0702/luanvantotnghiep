<template>
  <!-- Nội dung sản phẩm bên phải -->
  <div class="content">
    <!-- Filters Tag -->
    <div v-if="hasFilteredTags" class="row ms-4 pt-4">
      <span class="col-sm-2 text-center">Lọc theo : </span>

      <div class="col-sm-9 float-start">
        <div class="row">
          <div
            class="col-sm-5 mb-3"
            v-for="filter in filterMessages"
            :key="filter.id"
          >
            <button class="btn btn-outline-secondary">
              {{ filter.message }}
            </button>
            <button @click="clearFilter(filter.id)" class="btn-tag">Xóa</button>
          </div>
          <!-- Nút xóa tất cả bộ lọc -->
          <div class="col-sm-12 mt-3">
            <button @click="handleClearFilters" class="btn btn-outline-danger">
              Xóa tất cả
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Sắp xếp theo và số sản phẩm trên trang -->
    <div class="py-4 ps-2">
      <select class="form-select w-auto">
        <option value="8">8 sản phẩm</option>
        <option value="12">12 sản phẩm</option>
        <option value="16">16 sản phẩm</option>
      </select>
    </div>

    <!-- Danh sách sản phẩm -->
    <div class="row" v-if="books.length > 0">
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
            <router-link class="text-decoration-none"
              :title="book.name"
              :to="{ name: 'book-detail', params: { bookID: book._id } }"
              ><p class="card-title text-dark ">
                {{ truncateTitle(book.name) }}
              </p></router-link
            >
            <p class="card-text">
            <span class="text-danger fw-bold fs-5">
            {{
                formatPrice(
                  book.detail.originalPrice - book.detail.discountPrice
                )
              }}</span>
              
              <div class=" text-decoration-line-through opacity-75">
              {{ formatPrice(book.detail.originalPrice) }}
            </div>
            </p>
            
            <!-- Nút Xem và Add to Cart hiển thị khi hover -->
            <div
              class="hover-buttons position-absolute bottom-0 start-0 end-0 p-3 text-center"
            >
              <router-link :to="{name: 'book-detail', params: { bookID: book._id }}" class="btn btn-primary me-2">Xem</router-link>
              <button class="btn btn-success" @click="addToCart(book)">
                Add to Cart
              </button>
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
import { ref, onMounted, watch, computed, inject  } from "vue";
import BookService from "@/service/book.service";
import config from "@/config/index";
import Cookies from "js-cookie";
import { toast } from "vue3-toastify";
import CartService from "@/service/cart.service";
import { formatPrice } from "@/utils/utils";

// Dữ liệu sản phẩm mẫu
const books = ref([]);
const currentPage = ref(1);
const totalPages = ref(5);
const bookService = new BookService();
const cartService = new CartService();
const tags = ref({});
const token = Cookies.get("accessToken");
const isLoggedIn = Cookies.get("isLoggedIn");
const updateCart = inject('updateCart');
// Nhận props từ component cha
const props = defineProps({
  books: {
    type: Array,
    default: () => [],
  },
  filteredTags: {
    type: Object,
    default: () => ({
      author: [],
      category: [],
      formality: [],
      price: [],
      publisher: [],
      supplier: [],
    }),
  },
});
const emit = defineEmits(["filteredTagsDelete","cartUpdated"]);

const getBooks = async () => {
  const response = await bookService.get("/");
  if (response.status === 200) {
    books.value = response.data;
  }
};

// Hàm cắt ngắn tên sách nếu quá dài
const truncateTitle = (title) => {
  const maxLength = 40; // Độ dài tối đa trước khi cắt
  return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
};

const hasFilteredTags = computed(() => {
  // Kiểm tra xem có bất kỳ mảng nào trong filteredTags không rỗng
  return Object.values(props.filteredTags).some((arr) => arr.length > 0);
});

// Tạo danh sách các thông điệp riêng biệt cho từng mục
const filterMessages = computed(() => {
  const messages = [];

  for (const [key, values] of Object.entries(props.filteredTags)) {
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
          case "supplier":
            message = `Nhà cung cấp: ${item.name}`;
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
    const updatedItems = props.filteredTags[key].filter(
      (item) => item.id !== id
    );
    const updatedIds = updatedItems.map((item) => item.id);
    const updatedTags = { ...props.filteredTags, [key]: updatedIds };
    emit("filteredTagsDelete", updatedTags);
  }
};

const getKeyById = (id) => {
  for (const [key, values] of Object.entries(props.filteredTags)) {
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
    return ;
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

    const response = await cartService.post("/", data, token);
    if (response.status === 200) {
      toast(response.data.message, {
        theme: "auto",
        type: "success",
        dangerouslyHTMLString: true,
      });
      updateCart.value += 1;  // Cập nhật giỏ hàng
    }
  } catch (error) {
    toast(error.response?.data?.message, {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
  }
};

onMounted(() => {
  getBooks();
  if (props.filteredTags) {
    tags.value = props.filteredTags;
  }
});

watch(
  () => props.books,
  (newBooks) => {
    if (newBooks && newBooks.length > 0) {
      books.value = newBooks;
    } else {
      books.value = []; // Clear books if no data
    }
  }
);

// Theo dõi sự thay đổi của `filteredTags`
watch(
  () => props.filteredTags,
  (newFilteredTags) => {
    if (newFilteredTags) {
      tags.value = newFilteredTags;
    }
  },
  { deep: true } // Sử dụng deep nếu bạn muốn theo dõi sự thay đổi sâu trong đối tượng `filteredTags`
);

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

.btn-tag {
  outline: none;
  border: none;
  background-color: red;
  color: #fff;
}
</style>
