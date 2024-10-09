<template>
  <header class="bg-white shadow-sm py-2">
    <div class="container">
      <nav class="navbar navbar-expand-md navbar-light">
        <div class="d-flex justify-content-between align-items-center w-100">
          <!-- Left: Logo (desktop) / Menu Icon (mobile) -->
          <div class="d-flex align-items-center">
            <button
              class="navbar-toggler d-md-none me-2"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#mobileMenu"
            >
              <i class="fas fa-bars"></i>
            </button>
            <a class="navbar-brand" href="/">
              <div class="d-none d-md-flex align-items-center">
                <img
                  class="img-fluid"
                  style="width: 150px; object-fit: contain"
                  src="../../assets/images/logo1.png"
                  alt=""
                />
                <span class="ms-2 fw-bold text-primary">NHG Bookstore</span>
              </div>
            </a>
          </div>

          <!-- Center: Desktop Navigation -->
          <div class="d-none d-md-block">
            <ul class="navbar-nav text-uppercase fw-semibold">
              <li class="nav-item me-2">
                <a
                  class="nav-link"
                  :class="{ active: currentPage === 'home' }"
                  href="/"
                  >Trang chủ</a
                >
              </li>
              <li class="nav-item me-2">
                <a
                  class="nav-link"
                  :class="{ active: currentPage === 'book-list' }"
                  href="/books"
                  >Cửa hàng</a
                >
              </li>
              <li class="nav-item me-2">
                <a
                  class="nav-link"
                  :class="{ active: currentPage === 'discountCode' }"
                  href="/discountCode"
                  >Mã giảm giá</a
                >
              </li>
              <li class="nav-item me-2">
                <a class="nav-link" href="/about">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/contact">Contact</a>
              </li>
            </ul>
          </div>

          <!-- Right: Search, Cart, User Account -->
          <div class="d-flex align-items-center">
            <!-- cart -->
            <div class="dropdown">
              <button
                @click="handleNavigateRoute('cart')"
                class="btn dropdown-toggle position-relative me-2"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="fa-solid fa-cart-shopping fs-5"></i>
                <span
                  class="badge-cart translate-middle badge rounded-pill bg-danger"
                >
                  {{ booksInCart.totalQuantity }}
                  <span class="visually-hidden">unread messages</span>
                </span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end dropdown-menu-cart">
                <li class="my-2 ms-3">
                  <i class="fa-solid fa-cart-shopping"></i>
                  <span class="fw-bold ms-2"
                    >Giỏ hàng ({{ booksInCart.totalQuantity }})</span
                  >
                </li>
                <hr />
                <div v-if="booksInCart.books.length !== 0">
                  <div class="books-list">
                    <li
                      v-for="book in booksInCart.books"
                      :key="book.bookID._id"
                    >
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <div class="text-center">
                          <router-link
                            :to="{
                              name: 'book-detail',
                              params: { bookID: book.bookID._id },
                            }"
                          >
                            <img
                              v-if="
                                book.bookID.images &&
                                book.bookID.images.length > 0
                              "
                              class="ms-2"
                              style="width: 80px; height: 80px"
                              :src="
                                `${config.imgUrl}/` +
                                book.bookID?.images[0]?.path
                              "
                              alt=""
                          /></router-link>
                        </div>
                        <div class="flex-grow-1 ms-3">
                          <div class="text-break fw-bold">
                            <router-link
                              class="text-decoration-none text-dark"
                              :to="{
                                name: 'book-detail',
                                params: { bookID: book.bookID._id },
                              }"
                            >
                              <div class="col-12">
                                {{ book.bookID.name }}
                              </div></router-link
                            >
                          </div>
                          <div class="col-12">
                            <span class="text-danger fw-bold">{{
                              formatPrice(book.price)
                            }}</span>
                            x
                            <span>{{ book.quantity }}</span>
                          </div>
                        </div>
                      </div>
                      <hr />
                    </li>
                  </div>

                  <div class="d-flex justify-content-around align-items-center">
                    <div class="d-flex flex-column">
                      <span>Tổng cộng:</span>
                      <span class="text-danger fw-bold">{{
                        formatPrice(booksInCart.totalPrice)
                      }}</span>
                    </div>
                    <div class="text-center">
                      <router-link
                        class="btn btn-primary"
                        :to="{ name: 'cart' }"
                        >Xem giỏ hàng</router-link
                      >
                    </div>
                  </div>
                </div>
                <div v-else>
                  <EmptyCart />
                </div>
              </ul>
            </div>

            <!-- Desktop: User Account Dropdown -->
            <div class="dropdown d-none d-md-block d-sm-none">
              <div
                v-if="isLoggedIn && token"
                class="my-4"
                style="z-index: 1021"
              >
                <div class="dropdown">
                  <a
                    class="nav-link dropdown-toggle d-flex align-items-center"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div v-if="userInfo.avatar">
                      <img
                        style="width: 40px; border-radius: 50%"
                        :src="`http://localhost:3000/` + userInfo.avatar"
                        alt=""
                      />
                      <span class="ms-2">{{
                        userInfo.firstName + " " + userInfo.lastName
                      }}</span>
                    </div>
                    <div v-else>
                      <i class="fa-solid fa-user fs-4 mt-1"></i
                      ><span class="ms-2">{{
                        userInfo.firstName + " " + userInfo.lastName
                      }}</span>
                    </div>
                  </a>
                  <ul class="dropdown-menu">
                    <li>
                      <router-link
                        class="dropdown-item text-decoration-none"
                        :to="{ name: 'profile' }"
                        >Tài khoản</router-link
                      >
                    </li>
                    <li>
                      <router-link
                        class="dropdown-item"
                        :to="{ name: 'profile-orders' }"
                        >Đơn hàng</router-link
                      >
                    </li>
                    <li>
                      <hr class="dropdown-divider" />
                    </li>
                    <li>
                      <a class="dropdown-item" @click="logOut" href="#"
                        >Đăng xuất</a
                      >
                    </li>
                  </ul>
                </div>
              </div>

              <div v-else class="dropdown my-4">
                <button
                  class="btn dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="fa-solid fa-user mt-auto fs-5"></i> Tài Khoản
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <router-link to="/login" class="dropdown-item">
                      Đăng Nhập
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/register" class="dropdown-item">
                      Đăng Ký
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
            <!-- Mobile: User Account Icon -->
            <div class="d-md-none d-sm-block">
              <div v-if="token && isLoggedIn">
                <img
                  style="width: 40px; border-radius: 50%"
                  :src="`http://localhost:3000/` + userInfo.avatar"
                  alt=""
                  data-bs-toggle="offcanvas"
                  data-bs-target="#userMenu"
                />
              </div>
              <div v-else>
                <button
                  class="btn btn-link text-dark d-md-none"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#userMenu"
                >
                  <i class="fas fa-user fs-5"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Mobile Menu (Offcanvas) -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="mobileMenu">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">Menu</h5>
        <button
          type="button"
          class="btn-close text-reset"
          data-bs-dismiss="offcanvas"
        ></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav">
          <li class="nav-item"><a class="nav-link" href="/books">Books</a></li>
          <li class="nav-item">
            <a class="nav-link" href="/categories">Categories</a>
          </li>
          <li class="nav-item"><a class="nav-link" href="/about">About</a></li>
          <li class="nav-item">
            <a class="nav-link" href="/contact">Contact</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Mobile User Account Menu (Offcanvas) -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="userMenu">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">Your Account</h5>
        <button
          type="button"
          class="btn-close text-reset"
          data-bs-dismiss="offcanvas"
        ></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="/account">My Account</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/orders">My Orders</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/wishlist">Wishlist</a>
          </li>
          <li class="nav-item">
            <button class="nav-link btn btn-link" @click="signOut">
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import ApiUser from "@/service/user/apiUser.service";
import { formatPrice, handleNavigate } from "@/utils/utils";
import config from "@/config/index";
import EmptyCart from "./carts/EmptyCart.vue";
import Cookies from "js-cookie";
import { showConfirmation } from "@/utils/swalUtils";

const route = useRoute();
const router = useRouter();
const currentPage = computed(() => route.name);
const updateCart = inject("updateCart");
const apiUser = new ApiUser();
const token = Cookies.get("accessToken");
const isLoggedIn = Cookies.get("isLoggedIn");
const userInfo = ref({});
const booksInCart = ref({
  books: [],
  totalPrice: 0,
  totalQuantity: 0,
});

const getUser = async () => {
  if (token) {
    const response = await apiUser.get("/profile/getInfoUser");
    if (response.status === 200) {
      userInfo.value = response.data;
    }
  }
};

const logOut = async () => {
  const isConfirm = await showConfirmation({
    title: "Bạn có muốn đăng xuất?",
  });
  if (isConfirm.isConfirmed) {
    Cookies.remove("accessToken");
    Cookies.remove("isLoggedIn");
    Cookies.remove("refreshToken");
    window.location.reload();
  }
};

const handleNavigateRoute = (routeName) => {
  $(".dropdown-menu").removeClass("show");
  handleNavigate(router, routeName);
};

const signOut = () => {
  // Implement sign out functionality
  console.log("Signing out");
};

const getCarts = async () => {
  if (token) {
    const response = await apiUser.get("/cart");
    if (response.status === 200) {
      booksInCart.value = response.data;
    }
  }
};

// Quan sát sự thay đổi của updateCart và gọi getCarts mỗi khi nó thay đổi
watch(updateCart, (newValue) => {
  if (newValue) {
    getCarts();
  }
});

onMounted(() => {
  getCarts();
  getUser();
});
</script>

<style scoped>
@media (min-width: 768px) {
  .navbar-nav {
    display: flex;
    justify-content: center;
  }

  .books-list {
    overflow-y: auto;
    max-height: 450px;
  }
  .dropdown:hover .dropdown-menu {
    display: block;
    animation: fadeInUp 0.35s ease-in-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .dropdown-menu-cart {
    position: absolute;
    top: 30px;
    width: 400px;
    left: -15rem;
  }

  .dropdown-menu {
    z-index: 1021;
  }

  /* Đảm bảo các li bên trong không làm dropdown menu bị kéo dài */
  .dropdown-menu .books-list {
    list-style: none; /* Loại bỏ dấu gạch đầu dòng của li */
    padding: 0; /* Xóa padding của ul */
    margin: 0; /* Xóa margin của ul */
  }
}

@media (max-width: 768px) {
  .dropdown:hover .dropdown-menu {
    display: none; /* Ngăn không cho dropdown hiển thị khi hover */
    opacity: 0; /* Tùy chọn: ẩn opacity */
  }

  /* Hoặc nếu bạn muốn tắt hoàn toàn hiệu ứng dropdown */
  .dropdown .dropdown-menu {
    display: none; /* Đảm bảo dropdown không hiển thị trên màn hình nhỏ */
  }
}
/* Hover and active */
.nav-link {
  position: relative; /* Đặt vị trí của phần tử cha */
  overflow: hidden; /* Đảm bảo hiệu ứng không vượt ra ngoài phần tử */
  padding-bottom: 5px; /* Khoảng cách giữa văn bản và gạch dưới */
  color: #000;
  transition: color 0.3s ease;
}

.nav-link::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0; /* Đặt bắt đầu từ trái của phần tử */
  height: 2px; /* Độ dày của gạch dưới */
  width: 100%; /* Độ rộng của gạch dưới */
  background-color: var(
    --bs-primary
  ); /* Màu gạch dưới, sử dụng màu primary của Bootstrap */
  transition: transform 0.3s ease, width 0.3s ease; /* Hiệu ứng chuyển động */
  transform: scaleX(0); /* Gạch dưới ban đầu sẽ có chiều rộng bằng 0 */
  transform-origin: left; /* Bắt đầu từ trái khi mở rộng */
}

.nav-link:hover {
  color: var(--bs-primary); /* Đổi màu chữ khi hover thành màu xanh Bootstrap */
}

.nav-link:hover::before {
  transform: scaleX(1); /* Hiển thị gạch dưới khi hover */
}

.nav-link.active {
  color: var(--bs-primary); /* Màu xanh khi mục được chọn */
}

.nav-link.active::before {
  transform: scaleX(1); /* Gạch dưới sẽ hiện đầy đủ khi mục được chọn */
}

.dropdown .dropdown-toggle .ms-2 {
  max-width: 150px; /* Đặt chiều rộng tối đa cho phần tên */
  white-space: nowrap; /* Không cho văn bản xuống dòng */
  overflow: hidden; /* Ẩn phần văn bản vượt quá chiều rộng */
  text-overflow: ellipsis; /* Thêm dấu chấm lửng nếu tên bị cắt */
  display: inline-block;
  vertical-align: middle;
}

.dropdown-toggle::after {
  display: none;
}

.badge-cart {
  position: absolute;
  top: 5px;
  right: -15px;
}
</style>
