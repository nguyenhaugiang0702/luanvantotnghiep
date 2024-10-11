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
  <div class="voucher-wrapper">
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
              Thời hạn:
              <span>{{ moment(voucher.startDate).format("DD/MM/YYYY") }}</span>
              -
              <span>{{ moment(voucher.endDate).format("DD/MM/YYYY") }}</span>
            </div>
            <div class="order-range">
              Đơn từ:
              <span>{{
                formatPrice(voucher.voucherCategoryID?.minValue)
              }}</span>
              -
              <span>{{
                formatPrice(voucher.voucherCategoryID?.maxValue)
              }}</span>
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
              :percent="30"
            />
          </div>
          <button
            class="save-button"
            v-if="!voucher.isCollected"
            @click="collectVoucher(voucher._id)"
          >
            Lưu voucher
          </button>
          <button
            class="save-button save-button-used"
            v-else-if="voucher.isUsed"
          >
            Đã sử dụng
          </button>
          <button class="save-button" v-else @click="useVoucher(voucher.id)">
            Sử dụng ngay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import ApiUser from "@/service/user/apiUser.service";
import { formatPrice } from "@/utils/utils";
import Cookies from "js-cookie";
import moment from "moment";
import { toast } from "vue3-toastify";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

const apiUser = new ApiUser();
const vouchers = ref([]);
const voucherUseds = ref([]);
const token = Cookies.get("accessToken");
const isLoggedIn = Cookies.get("isLoggedIn");
const router = useRouter();

const getAllVouchers = async () => {
  const response = await apiUser.get("/vouchers");
  if (response.status === 200) {
    vouchers.value = response.data;
  }
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

onMounted(async () => {
  await getAllVouchers();
});
</script>

<style scoped>
@import "../../assets/css/client/vouchers/vouchers.css";
</style>
