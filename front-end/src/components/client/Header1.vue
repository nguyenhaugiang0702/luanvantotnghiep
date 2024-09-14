<template>
  <header class="bg-white shadow-sm">
    <div class="container px-4 py-4">
      <div class="d-flex justify-content-between align-items-center">
        <!-- Logo -->
        <router-link
          to="/"
          class="d-flex align-items-center text-decoration-none"
        >
          <i class="bi bi-book h5 me-2"></i>
          <img
            src="../../assets/images/logo.jpg"
            alt=""
            style="width: 150px; height: 80px"
          />
          <span class="fs-4 fw-bold">NHGBookStore</span>
        </router-link>

        <!-- Mobile Menu Button -->
        <button class="btn d-md-none" @click="toggleMenu">
          <i class="fa-solid fa-list"></i>
        </button>

        <!-- Desktop Navigation -->
        <nav class="d-none d-md-flex align-items-center gap-4">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.href"
            class="text-decoration-none text-muted small fw-medium"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Search, Cart and Profile -->
        <div class="d-none d-md-flex align-items-center gap-3">
          <div class="position-relative">
            <input
              type="search"
              class="form-control"
              placeholder="Search books..."
            />
            <i
              class="bi bi-search position-absolute top-50 start-3 translate-middle-y"
            ></i>
          </div>

          <button class="btn position-relative">
            <i class="fa-solid fa-cart-shopping text-dark"></i>
            <span
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
            >
              3
            </span>
          </button>

          <!-- Dropdown Menu -->
          <div class="dropdown">
            <button
              class="btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i class="fa-solid fa-user"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" style="z-index: 1021">
              <li><h6 class="dropdown-header">My Account</h6></li>
              <li><a class="dropdown-item" href="#">Profile</a></li>
              <li><a class="dropdown-item" href="#">Orders</a></li>
              <li><a class="dropdown-item" href="#">Settings</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Log out</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="mt-3 d-md-none">
        <nav class="d-flex flex-column gap-2">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.href"
            class="text-decoration-none text-muted py-2 small fw-medium"
            @click="toggleMenu"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <div class="position-relative">
          <input
            type="search"
            class="form-control ps-5"
            placeholder="Search books..."
          />
          <i
            class="bi bi-search position-absolute top-50 start-3 translate-middle-y"
          ></i>
        </div>

        <button
          class="btn btn-outline-secondary d-flex justify-content-start align-items-center"
        >
          <i class="fa-solid fa-cart-shopping"></i> Cart (3)
        </button>

        <button
          class="btn btn-outline-secondary d-flex justify-content-start align-items-center"
        >
          <i class="fa-solid fa-user"></i>
          Profile
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";

const isMenuOpen = ref(false);

const navItems = [
  { name: "Home", href: "/" },
  { name: "Categories", href: "/categories" },
  { name: "New Releases", href: "/new-releases" },
  { name: "Best Sellers", href: "/best-sellers" },
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style>
/* Add any additional styles if needed */
</style>
