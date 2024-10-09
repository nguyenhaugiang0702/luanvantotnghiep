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

            <!-- <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${123}%` }"></div>
          </div> -->
          </div>
          <button
            class="save-button"
            v-if="!voucher.isCollected"
            @click="collectVoucher(voucher._id)"
          >
            Lưu voucher
          </button>
          <button class="save-button save-button-used" v-else-if="voucher.isUsed">
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

const getVouchersUseds = async () => {
  const response = await apiUser.get("/vouchers/vouhersWithLogin");
  if (response.status === 200) {
    vouchers.value = response.data;
  }
};

const getVouchers = async () => {
  if (token) {
    await getVouchersUseds();
  } else {
    await getAllVouchers();
  }
};

const collectVoucher = async (voucherID) => {
  if (!isLoggedIn || !token) {
    toast("Vui lòng đăng nhập", {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
    return;
  }
  try {
    const response = await apiUser.post("/vouchers/voucherUseds", {
      voucherID: voucherID,
    });
    if (response.status === 200) {
      toast(response.data.message, {
        theme: "auto",
        type: "success",
        dangerouslyHTMLString: true,
      });
      await getVouchers();
    }
  } catch (error) {
    console.log(error);
    toast(error.response?.data?.message, {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
  }
};

const useVoucher = () => {
  router.push({ name: "cart" });
};

onMounted(async () => {
  await getVouchers();
});
</script>

<style scoped>
.voucher-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: baseline;
  gap: 1rem;
}

.voucher-container {
  display: flex;
  flex-wrap: wrap;
  max-width: 30rem;
  max-height: 15rem;
  margin: 10px auto;
  overflow: hidden;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background: linear-gradient(to bottom right, #2563eb, #1e40af);
}

.voucher-left {
  width: 100%;
  max-width: 30%;
  max-height: 15rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  background-color: white;
  padding: 0.5rem;
  border-radius: 9999px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.store-logo {
  width: 80px;
  height: 80px;
  border-radius: 9999px;
  object-fit: cover;
}

.store-name {
  color: white;
  text-align: center;
  font-weight: 700;
  margin-top: 1rem;
  font-size: 1.125rem;
}

.voucher-right {
  width: 100%;
  max-width: 70%;
  max-height: 15rem;
  background-color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
}

.discount {
  font-size: 1.875rem;
  font-weight: 800;
  color: #1e3a8a;
  margin-bottom: 0.5rem;
}

.code {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e40af;
  background-color: #dbeafe;
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.order-range {
  font-size: 0.875rem;
  color: #4b5563;
  /* margin-top: 0.5rem; */
}

.order-range span {
  font-weight: 600;
  color: #1e3a8a;
}

/* .usage-section {
  margin-top: rem;
} */

.usage-text {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
  display: flex;
  justify-content: space-between;
}

.usage-text span:last-child {
  font-weight: 600;
  color: #1e3a8a;
}

.progress-bar {
  width: 100%;
  height: 0.5rem;
  background-color: #dbeafe;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #2563eb, #1e40af);
  transition: width 0.3s ease;
}

.save-button {
  margin-top: 0rem;
  background: linear-gradient(to right, #2563eb, #1e40af);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.save-button-used {
  opacity: 0.6;
}

.save-button:hover {
  background: linear-gradient(to right, #1d4ed8, #1e3a8a);
  transform: translateY(-1px);
}
</style>
