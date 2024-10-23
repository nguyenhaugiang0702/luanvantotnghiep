<template>
  <div class="container-fluid bg-primary py-4">
    <div class="container text-white">
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-start"
      >
        <div class="d-flex flex-column mb-3 mb-md-0">
          <div class="fw-bold text-uppercase fs-5">Mã giảm giá</div>
          <div>Nhanh tay săn đón những mã giảm giá đi nào</div>
        </div>
        <div class="align-self-md-center">
          <span @click="handleNavigate(router, 'home')">Trang chủ </span>
          <span>/ Mã giảm giá</span>
        </div>
      </div>
    </div>
  </div>
  <div class="voucher-wrapper my-4">
    <div
      class="voucher-container"
      v-for="voucher in vouchers"
      :key="voucher._id"
    >
      <div class="d-flex">
        <!-- Left side - Navy blue gradient -->
        <div class="voucher-left">
          <div class="logo-container">
            <img
              src="../../assets/images/logo.jpg"
              alt="logo"
              class="store-logo"
            />
          </div>
          <h2 class="store-name">NHG BOOKSTORE</h2>
        </div>

        <!-- Right side - White -->
        <div class="voucher-right">
          <div>
            <h3 class="discount">
              Giảm
              <span
                v-if="voucher.voucherCategoryID?.discountType === 'percent'"
              >
                {{ voucher.voucherCategoryID?.value }}%
              </span>
              <span v-else>
                {{ formatPrice(voucher.voucherCategoryID?.value) }}</span
              >
            </h3>
            <div class="code">Mã: {{ voucher.code }}</div>
            <div class="order-range">
              Thời hạn sử dụng đến :
              <span>{{ formatDate(voucher.endDate, (time = false)) }}</span>
            </div>
            <div class="order-range">
              Đơn từ:
              <span>{{
                formatPrice(voucher.voucherCategoryID?.minValue)
              }}</span>
            </div>
            <div class="order-range">
              <span v-if="voucher.voucherCategoryID?.discountType === 'percent'"
                >Giảm tối đa:
                {{ formatPrice(voucher.voucherCategoryID?.maxValue) }}</span
              >
            </div>
          </div>
          <div class="usage-section">
            <div class="usage-text">
              <span>Đã sử dụng:</span>
            </div>
            <a-progress
              class="process"
              :stroke-color="{
                from: '#2563eb',
                to: '#1e40af',
              }"
              :percent="voucher.usedPercentage"
            />
          </div>
          <button
            :class="getVoucherButtonState(voucher).class"
            :disabled="getVoucherButtonState(voucher).disabled"
            @click="getVoucherButtonState(voucher).action"
          >
            {{ getVoucherButtonState(voucher).text }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Phân trang -->
  <Pagination
    :currentPage="currentPage"
    :totalPages="totalPages"
    @updatePage="handlePageChange"
  />
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import ApiUser from "@/service/user/apiUser.service";
import { formatPrice, formatDate } from "@/utils/utils";
import Cookies from "js-cookie";
import moment from "moment";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import Pagination from "../../components/Pagination.vue";

const apiUser = new ApiUser();
const vouchers = ref([]);
const voucherUseds = ref([]);
const token = Cookies.get("accessToken");
const isLoggedIn = Cookies.get("isLoggedIn");
const router = useRouter();
// Pagination
const currentPage = ref(1);
const limit = ref(6);
const totalPages = ref(1);

const getAllVouchers = async (page, limit) => {
  const response = await apiUser.get(`/vouchers?page=${page}&limit=${limit}`);
  if (response.status === 200) {
    vouchers.value = response.data.vouchers;
    currentPage.value = response.data.currentPage;
    totalPages.value = response.data.totalPages;
    console.log(response.data);
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
  getAllVouchers(currentPage.value, limit.value);
};

const collectVoucher = async (voucherID) => {
  if (!isLoggedIn || !token) {
    return showErrorToast("Vui lòng đăng nhập");
  }
  try {
    const response = await apiUser.post("/vouchers/voucherUseds", {
      voucherID: voucherID,
    });
    if (response?.status === 200) {
      showSuccessToast(response?.data?.message);
      await getAllVouchers();
    }
  } catch (error) {
    console.log(error);
    showErrorToast(error.response?.data?.message);
  }
};

const useVoucher = () => {
  router.push({ name: "cart" });
};

const getVoucherButtonState = (voucher) => {
  if (!voucher.isCollected) {
    // Mã chưa được thu thập
    if (voucher.usedPercentage === 100) {
      // Nếu mã đã được sử dụng hết
      return {
        text: "Đã hết",
        class: "save-button save-button-used",
        disabled: true,
        action: null,
      };
    }
    return {
      text: "Lưu voucher",
      class: "save-button",
      disabled: false,
      action: () => collectVoucher(voucher._id), // Gọi hàm thu thập voucher
    };
  }
  if (voucher.usedPercentage === 100) {
    // Nếu mã đã được sử dụng hết
    return {
      text: "Đã hết",
      class: "save-button save-button-used",
      disabled: true,
      action: null,
    };
  }

  if (voucher.isExpired) {
    // Mã hết hạn
    return {
      text: "Hết hạn",
      class: "save-button save-button-used",
      disabled: true,
      action: null,
    };
  }

  if (voucher.isUsed) {
    // Mã đã được sử dụng hoặc đã hết mã
    return {
      text: "Đã sử dụng",
      class: "save-button save-button-used",
      disabled: true,
      action: null,
    };
  }

  return {
    // Sử dụng mã
    text: "Sử dụng ngay",
    class: "save-button",
    disabled: false,
    action: () => useVoucher(voucher._id), // Gọi hàm sử dụng voucher
  };
};

onMounted(async () => {
  await getAllVouchers(currentPage.value, limit.value);
});
</script>

<style scoped>
@import "../../assets/css/client/vouchers/vouchers.css";
</style>
