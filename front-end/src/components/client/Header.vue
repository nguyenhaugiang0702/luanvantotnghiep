<template>
  <div class="container-fluid">
    <div class="row mx-auto">
      <div class="col-sm-3 text-center">
        <router-link to="/">
          <img
            src="../../assets/images/logo1.png"
            alt="Logo"
            style="width: 200px; height: 100px"
          />
        </router-link>
      </div>
      <!-- Tìm Kiếm -->
      <Search />
      <!-- End Tìm Kiếm -->

      <!-- Giỏ Hàng -->
      <div class="col-auto dropdown my-4">
        <button
          @click="handleNavigateRoute('cart')"
          class="btn btn-outline-secondary dropdown-toggle position-relative"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="fa-solid fa-cart-shopping"></i> Giỏ Hàng
          <span
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          >
            {{ booksInCart.totalQuantity }}
            <span class="visually-hidden">unread messages</span>
          </span>
        </button>
        <ul class="dropdown-menu dropdown-menu-cart">
          <li class="my-2 ms-3">
            <i class="fa-solid fa-cart-shopping"></i>
            <span class="fw-bold ms-2"
              >Giỏ hàng ({{ booksInCart.totalQuantity }})</span
            >
          </li>
          <hr />
          <div class="books-list">
            <li v-for="book in booksInCart.books" :key="book.bookID._id">
              <div class="d-flex align-items-center">
                <div class="text-center">
                  <router-link
                    :to="{
                      name: 'book-detail',
                      params: { bookID: book.bookID._id },
                    }"
                  >
                    <img
                      v-if="book.bookID.images && book.bookID.images.length > 0"
                      class="ms-2"
                      style="width: 80px; height: 80px"
                      :src="`${config.imgUrl}/` + book.bookID?.images[0]?.path"
                      alt=""
                  /></router-link>
                </div>
                <div class="col-sm-9">
                  <div class="row text-break fw-bold">
                    <router-link
                      class="text-decoration-none text-dark"
                      :to="{
                        name: 'book-detail',
                        params: { bookID: book.bookID._id },
                      }"
                    >
                      <div class="col-sm-12">
                        {{ book.bookID.name }}
                      </div></router-link
                    >
                  </div>
                  <div class="row">
                    <div class="col-sm-12">
                      <span class="text-danger fw-bold">{{
                        formatPrice(book.price)
                      }}</span>
                      x
                      <span>{{ book.quantity }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </li>
          </div>

          <div class="row" v-if="isLoggedIn && token">
            <div class="col-sm-6 text-start mx-4">
              Tổng cộng:
              <span class="text-danger fw-bold">{{
                formatPrice(booksInCart.totalPrice)
              }}</span>
            </div>
            <div class="col-sm-3 text-center">
              <router-link class="btn btn-warning" :to="{ name: 'cart' }"
                >Giỏ hàng</router-link
              >
            </div>
          </div>
        </ul>
      </div>
      <!-- End Giỏ Hàng -->

      <!-- Tài Khoản -->
      <div class="col-sm-2 dropdown">
        <div v-if="isLoggedIn && token" class="my-4" style="z-index: 1021">
          <div class="dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fa-solid fa-user fs-3 mt-1"></i>
              {{ userInfo.user_name }}
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
                <router-link class="dropdown-item" :to="{name: 'profile-orders'}"
                  >Đơn hàng</router-link
                >
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <a class="dropdown-item" @click="logOut" href="#">Đăng xuất</a>
              </li>
            </ul>
          </div>
        </div>

        <div v-else class="dropdown my-4">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="fa-solid fa-user mt-auto"></i> Tài Khoản
          </button>
          <ul class="dropdown-menu">
            <li>
              <router-link to="login" class="dropdown-item" @click="setLogin">
                Đăng Nhập
              </router-link>
            </li>
            <li>
              <router-link to="login" class="dropdown-item" @click="setSignUp">
                Đăng Ký
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <!-- End Tài Khoản -->
    </div>
  </div>
</template>
<script setup>
import Search from "./Search.vue";
import {
  computed,
  onMounted,
  ref,
  inject,
  watch,
  nextTick,
  watchEffect,
} from "vue";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import ApiService from "../../service/ApiService";
import CartService from "@/service/cart.service";
import { useRouter } from "vue-router";
import config from "@/config/index";
import { formatPrice, handleNavigate } from "@/utils/utils";

const userInfo = ref({});
const router = useRouter();
const apiService = new ApiService();
const cartService = new CartService();
const token = Cookies.get("accessToken");
const isLoggedIn = Cookies.get("isLoggedIn");
const updateCart = inject("updateCart");
const isDropdownOpen = ref(false);
const booksInCart = ref({
  books: [],
  totalPrice: 0,
  totalQuantity: 0,
});

const getUser = async () => {
  try {
    if (token) {
      const response = await apiService.get(`users/${token}`);
      if (response.status === 200) {
        userInfo.value = response.data;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const handleNavigateRoute = (routeName) => {
  $(".dropdown-menu").removeClass("show");
  handleNavigate(router, routeName);
};

const logOut = () => {
  Swal.fire({
    title: "Xác nhận đăng xuất",
    text: "Bạn có chắc chắn muốn đăng xuất?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Hủy bỏ",
  }).then((result) => {
    if (result.isConfirmed) {
      sessionStorage.clear();
      document.cookie =
        "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
      document.cookie =
        "user_name=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
      delete axios.defaults.headers.common["Authorization"];
      window.location.reload();
    }
  });
};

const getCarts = async () => {
  if (token) {
    const response = await cartService.get("/", token);
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
});

const setLogin = () => {
  localStorage.setItem("isSignInActive", true);
  router.push({ name: "login" });
  //   window.location.reload();
};

const setSignUp = () => {
  localStorage.setItem("isSignInActive", false);
  router.push({ name: "login" });
  //   window.location.reload();
};
</script>
<style scoped>
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
  width: 500px;
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
</style>
