<template>
  <div class="dropdown">
    <!-- Notification Bell Button -->
    <button
      class="btn position-relative me-2"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <i class="fa-solid fa-bell fs-5 text-gray-700"></i>
      <span
        v-if="
          vouchers.sameDayExpiredVouchers?.length !== 0 ||
          vouchers.upcomingExpiredVouchers?.length !== 0
        "
        class="badge-cart translate-middle badge rounded-pill bg-danger"
        style="position: absolute; top: 5px; right: 5px"
      >
        {{
          vouchers.sameDayExpiredVouchers?.length +
            vouchers.upcomingExpiredVouchers?.length || 0
        }}
        <span class="visually-hidden">unread messages</span>
      </span>
    </button>

    <!-- Dropdown Menu -->
    <ul
      class="dropdown-menu dropdown-menu-end dropdown-menu-cart shadow-lg"
      style="min-width: 320px; max-width: 400px"
    >
      <!-- Header -->
      <li class="px-3 py-2 bg-light border-bottom">
        <div class="d-flex align-items-center">
          <i class="fa-solid fa-bell-exclamation me-2 text-warning"></i>
          <span class="fw-bold">Thông báo Voucher sắp hết hạn</span>
        </div>
      </li>

      <!-- Same-Day Expired Vouchers -->
      <div v-if="vouchers.sameDayExpiredVouchers?.length !== 0">
        <div
          class="px-3 py-2 bg-light d-flex justify-content-between"
          data-bs-toggle="collapse"
          href="#sameDayExpiredVouchers"
          role="button"
          aria-expanded="false"
          aria-controls="sameDayExpiredVouchers"
          @click="handleCollapse('sameDay')"
        >
          <span class="badge text-bg-danger p-2">Hết hạn trong ngày</span>
          <i
            class="fa-solid"
            :class="{
              'fa-chevron-up': collapseSameDay,
              'fa-chevron-down': !collapseSameDay,
            }"
          ></i>
        </div>
        <div
          id="sameDayExpiredVouchers"
          class="collapse vouchers-list"
          style="max-height: 250px; overflow-y: auto"
          :class="{ show: collapseSameDay }"
        >
          <li
            v-for="voucher in vouchers.sameDayExpiredVouchers"
            :key="voucher._id"
            class="notification-item px-3 py-2 border-bottom hover-bg-light cursor-pointer"
          >
            <div class="d-flex align-items-center">
              <!-- Icon Container -->
              <div class="icon-container me-3">
                <div class="rounded-circle bg-danger bg-opacity-10 p-2">
                  <i class="fa-solid fa-clock text-danger fs-5"></i>
                </div>
              </div>

              <!-- Content -->
              <div @click="handleNavigate(router, 'profile-vouchers')" class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="mb-1 fw-bold text-danger">
                      Voucher sắp hết hạn!
                    </h6>
                    <p class="mb-1 text-muted small">
                      Mã: {{ voucher.voucherID.code }}
                    </p>
                    <p class="mb-0 small">
                      <i class="fa-solid fa-calendar-days me-1"></i>
                      Hết hạn:
                      {{
                        formatDate(voucher.voucherID.endDate, (time = false))
                      }}
                    </p>
                  </div>
                  <i class="fa-solid fa-chevron-right text-muted"></i>
                </div>
              </div>
            </div>
          </li>
        </div>
      </div>

      <!-- Upcoming Expired Vouchers -->
      <div v-if="vouchers.upcomingExpiredVouchers?.length !== 0">
        <div
          class="px-3 py-2 bg-light d-flex justify-content-between"
          data-bs-toggle="collapse"
          href="#upcomingExpiredVouchers"
          role="button"
          aria-expanded="false"
          aria-controls="upcomingExpiredVouchers"
          @click="handleCollapse('upComing')"
        >
          <span class="badge text-bg-warning p-2">Sắp hết hạn</span>
          <i
            class="fa-solid"
            :class="{
              'fa-chevron-up': collapseUpcoming,
              'fa-chevron-down': !collapseUpcoming,
            }"
          ></i>
        </div>
        <div
          id="upcomingExpiredVouchers"
          class="collapse vouchers-list"
          style="max-height: 250px; overflow-y: auto"
          :class="{ show: collapseUpcoming }"
        >
          <li
            v-for="voucher in vouchers.upcomingExpiredVouchers"
            :key="voucher._id"
            class="notification-item px-3 py-2 border-bottom hover-bg-light cursor-pointer"
          >
            <div class="d-flex align-items-center">
              <!-- Icon Container -->
              <div class="icon-container me-3">
                <div class="rounded-circle bg-warning bg-opacity-10 p-2">
                  <i class="fa-solid fa-clock text-warning fs-5"></i>
                </div>
              </div>

              <!-- Content -->
              <div @click="handleNavigate(router, 'profile-vouchers')" class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                  <div >
                    <h6 class="mb-1 fw-bold text-warning">
                      Voucher sắp hết hạn!
                    </h6>
                    <p class="mb-1 text-muted small">
                      Mã: {{ voucher.voucherID.code }}
                    </p>
                    <p class="mb-0 small">
                      <i class="fa-solid fa-calendar-days me-1"></i>
                      Hết hạn:
                      {{
                        formatDate(voucher.voucherID.endDate, (time = false))
                      }}
                    </p>
                  </div>
                  <i class="fa-solid fa-chevron-right text-muted"></i>
                </div>
              </div>
            </div>
          </li>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="
          vouchers.sameDayExpiredVouchers.length === 0 &&
          vouchers.upcomingExpiredVouchers.length === 0
        "
        class="text-center py-3 text-muted"
      >
        <i class="fa-solid fa-bell-slash fs-4 mb-2"></i>
        <p class="mb-0">Chưa có thông báo</p>
      </div>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import ApiUser from "@/service/user/apiUser.service";
import { formatPrice, handleNavigate, formatDate } from "@/utils/utils";
import config from "@/config/index";
import EmptyCart from "./carts/EmptyCart.vue";
import Cookies from "js-cookie";
import { showConfirmation } from "@/utils/swalUtils";

const apiUser = new ApiUser();
const collapseSameDay = ref(true);
const collapseUpcoming = ref(true);
const token = Cookies.get("accessToken");
const vouchers = ref({
  sameDayExpiredVouchers: [],
  upcomingExpiredVouchers: [],
  message: "",
});
const router = useRouter();
const checkExpireVoucher = async () => {
  if (token) {
    const response = await apiUser.get("/vouchers/voucherUseds/checkExpire");
    if (response.status === 200) {
      vouchers.value = response.data;
      console.log(vouchers.value);
    }
  }
};

const handleCollapse = (section) => {
  if (section === "sameDay") {
    collapseSameDay.value = !collapseSameDay.value;
  } else if (section === "upComing") {
    collapseUpcoming.value = !collapseUpcoming.value;
  }
};
watch(
  collapseSameDay,
  (newValue) => {
    collapseSameDay.value = newValue;
  },
  { deep: true }
);

watch(
  collapseUpcoming,
  (newValue) => {
    collapseUpcoming.value = newValue;
  },
  { deep: true }
);
onMounted(async () => {
  await checkExpireVoucher();
});

setInterval(() => {
  checkExpireVoucher();
}, 21600000);
</script>

<style scoped>
.dropdown-menu {
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.dropdown-menu-cart{
  position: absolute;
  right: 0px;
}

.notification-item {
  transition: background-color 0.2s ease;
}

.notification-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.cursor-pointer {
  cursor: pointer;
}

.icon-container {
  min-width: 40px;
}

/* Custom scrollbar */
.vouchers-list::-webkit-scrollbar {
  width: 5px;
}

.vouchers-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.vouchers-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

.vouchers-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Badge positioning */
.badge-cart {
  transform: translate(25%, -50%) !important;
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
</style>
