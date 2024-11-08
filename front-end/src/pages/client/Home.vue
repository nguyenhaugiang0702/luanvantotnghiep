<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Main Content -->
    <main class="flex-grow-1">
      <div class="mb-5"><Carousel /></div>

      <!-- Hero Section -->
      <section class="text-center py-5">
        <div class="container" v-motion-pop-visible-once >
          <h2 class="h1 mb-3">
            Khám phá cuốn sách tuyệt vời tiếp theo của bạn
          </h2>
          <p class="lead mb-4">
            Khám phá bộ sưu tập sách khổng lồ của chúng tôi dành cho mọi độc giả
          </p>
          <button
            @click="handleNavigate(router, 'books')"
            class="btn btn-lg btn-outline-primary"
          >
            Mua ngay nào
          </button>
        </div>
      </section>

      <!-- Featured Categories -->
      <section class="py-5 bg-light" >
        <div class="container" >
          <h2 class="h3 mb-4 text-center">Cam Kết Của Chúng Tôi</h2>
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            <!-- Đổi trả miễn phí -->
            <div class="col"  v-motion-slide-visible-once-bottom>
              <div class="feature-card card border-0 text-center h-100">
                <div class="card-body">
                  <div class="feature-icon mb-3">
                    <i class="fas fa-sync-alt fa-2x text-primary"></i>
                  </div>
                  <h5 class="card-title">Đổi Trả 100%</h5>
                  <p class="card-text">
                    Đổi trả miễn phí trong vòng 7 ngày nếu sách có lỗi từ nhà
                    sản xuất
                  </p>
                </div>
              </div>
            </div>

            <!-- Hỗ trợ 24/7 -->
            <div class="col"  v-motion-slide-visible-once-bottom>
              <div class="feature-card card border-0 text-center h-100">
                <div class="card-body">
                  <div class="feature-icon mb-3">
                    <i class="fas fa-headset fa-2x text-primary"></i>
                  </div>
                  <h5 class="card-title">Hỗ Trợ 24/7</h5>
                  <p class="card-text">
                    Hotline: 1900-xxxx luôn sẵn sàng hỗ trợ mọi thắc mắc của bạn
                  </p>
                </div>
              </div>
            </div>

            <!-- Giao hàng nhanh -->
            <div class="col"  v-motion-slide-visible-once-bottom>
              <div class="feature-card card border-0 text-center h-100">
                <div class="card-body">
                  <div class="feature-icon mb-3">
                    <i class="fas fa-shipping-fast fa-2x text-primary"></i>
                  </div>
                  <h5 class="card-title">Giao Hàng Nhanh</h5>
                  <p class="card-text">
                    Giao hàng nhanh chóng trong vòng 2-3 ngày trên toàn quốc
                  </p>
                </div>
              </div>
            </div>

            <!-- Thanh toán an toàn -->
            <div class="col"  v-motion-slide-visible-once-bottom>
              <div class="feature-card card border-0 text-center h-100">
                <div class="card-body">
                  <div class="feature-icon mb-3">
                    <i class="fas fa-shield-alt fa-2x text-primary"></i>
                  </div>
                  <h5 class="card-title">Thanh Toán An Toàn</h5>
                  <p class="card-text">
                    Đa dạng phương thức thanh toán với bảo mật tuyệt đối
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Products -->
      <div class="container mt-5 mb-2" v-motion-slide-visible-once-left>
        <h2 class="h3 mb-4 text-center">Các Sách Nổi Bật</h2>
        <div class="row" v-if="books.length !== 0">
          <div class="col-md-3 mb-4" v-for="book in books" :key="book._id">
            <div class="book-card book card h-100 position-relative">
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
                </div>

                <!-- Nút Xem và Add to Cart hiển thị khi hover -->
                <div
                  class="hover-buttons position-absolute bottom-0 start-0 end-0 p-3 text-end"
                >
                  <router-link
                    @click="updateView(book._id)"
                    :to="{ name: 'book-detail', params: { bookID: book._id } }"
                    class="btn btn-outline-primary me-2"
                    ><i class="fa-solid fa-eye"></i
                  ></router-link>
                  <button class="btn btn-primary" @click="addToCart(book)">
                    <i class="fa fa-cart-plus" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import Carousel from "../../components/client/Carousel.vue";
import ApiUser from "@/service/user/apiUser.service";
import { formatPrice, handleNavigate } from "@/utils/utils";
import config from "@/config/index";
import Cookies from "js-cookie";
import { useRoute, useRouter } from "vue-router";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

const books = ref([]);
const router = useRouter();
const token = Cookies.get("accessToken");
const isLoggedIn = Cookies.get("isLoggedIn");
const updateCart = inject("updateCart");
const apiUser = new ApiUser();
const getBooksAtHome = async () => {
  const response = await apiUser.get("/books/topViewedBooks");
  if (response.status === 200) {
    books.value = response.data;
  }
};

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

const addToCart = async (book) => {
  if (!token || !isLoggedIn) {
    return showErrorToast("Vui lòng đăng nhập");
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

    const response = await apiUser.post("/cart", data, token);
    if (response.status === 200) {
      showSuccessToast(response.data.message);
      updateCart.value += 1; // Cập nhật giỏ hàng
    }
  } catch (error) {
    console.log(error);
    showErrorToast(error.response?.data?.message);
  }
};

// Hàm cắt ngắn tên sách nếu quá dài
const truncateTitle = (title) => {
  const maxLength = 40; // Độ dài tối đa trước khi cắt
  return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
};

onMounted(() => {
  getBooksAtHome();
});

const categories = ref([
  "Fiction",
  "Non-Fiction",
  "Children's",
  "Sci-Fi & Fantasy",
]);
</script>

<style scoped>
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

.feature-card {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  background-color: white;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-text {
  color: #6c757d;
  font-size: 0.9rem;
}
</style>
