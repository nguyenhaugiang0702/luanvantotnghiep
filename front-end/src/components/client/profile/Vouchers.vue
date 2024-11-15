<template>
  <div class="container bg-white pb-3">
    <h4 class="p-3">MÃ GIẢM GIÁ</h4>
    <div v-if="vouchers.length !== 0">
      <div class="voucher-wrapper">
        <div
          class="voucher-container"
          v-for="voucher in vouchers"
          :key="voucher._id"
        >
          <div class="d-flex">
            <!-- Left side -->
            <div class="voucher-left">
              <div class="logo-container">
                <img
                  src="../../../assets/images/logo.jpg"
                  alt="logo"
                  class="store-logo"
                />
              </div>
              <h2 class="store-name">NHG BOOKSTORE</h2>
            </div>

            <!-- Right side -->
            <div class="voucher-right">
              <div class="voucher-content">
                <div class="discount-section">
                  <h3 class="discount">
                    Giảm
                    <span
                      v-if="
                        voucher.voucherID?.voucherCategoryID?.discountType ===
                        'percent'
                      "
                    >
                      {{ voucher.voucherID?.voucherCategoryID?.value }}%
                    </span>
                    <span v-else>
                      {{
                        formatPrice(voucher.voucherID?.voucherCategoryID?.value)
                      }}
                    </span>
                  </h3>
                  <div
                    class="code"
                    :class="{
                      'code-apply': voucher.voucherID?.usedPercentage === 100,
                    }"
                  >
                    {{
                      voucher.voucherID?.usedPercentage === 100
                        ? "Đã hết"
                        : "Dùng ngay"
                    }}
                  </div>
                </div>

                <div class="details">
                  <div class="detail-item">
                    <span class="label">HSD:</span>
                    {{
                      moment(voucher.voucherID?.endDate).format("DD/MM/YYYY")
                    }}
                  </div>
                  <div class="code code-apply">
                    {{ voucher.voucherID?.code }}
                  </div>
                  <div class="detail-item">
                    <span class="label">Đơn tối thiểu:</span>
                    {{
                      formatPrice(
                        voucher.voucherID?.voucherCategoryID?.minValue
                      )
                    }}
                  </div>
                </div>

                <div class="usage-section">
                  <a-progress
                    class="process"
                    :stroke-color="{
                      from: '#2563eb',
                      to: '#1e40af',
                    }"
                    size="small"
                    :percent="voucher.voucherID?.usedPercentage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <Pagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          @updatePage="handlePageChange"
        />
      </div>
    </div>
    <div v-else class="d-flex justify-content-center">
      Không có mã giảm giá
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ApiUser from "@/service/user/apiUser.service";
import { formatPrice } from "@/utils/utils";
import moment from "moment";
import Pagination from "../../Pagination.vue";

const apiUser = new ApiUser();
const vouchers = ref([]);
const currentPage = ref(1);
const limit = ref(4);
const totalPages = ref(1);
const getVouchers = async (page, limit) => {
  const response = await apiUser.get(
    `/vouchers/voucherUseds?page=${page}&limit=${limit}`
  );
  if (response.status === 200) {
    vouchers.value = response.data.vouchers;
    totalPages.value = response.data.totalPages;
    currentPage.value = response.data.currentPage;
    console.log(response.data);
  }
};

onMounted(() => {
  getVouchers(currentPage.value, limit.value);
});

const handlePageChange = (page) => {
  currentPage.value = page;
  getVouchers(currentPage.value, limit.value);
};
</script>

<style scoped>
.voucher-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: space-evenly;
}

.voucher-container {
  width: 100%;
  max-width: 20rem;
  height: 8rem;
  margin: 5px;
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: linear-gradient(to bottom right, #2563eb, #1e40af);
}

.voucher-left {
  width: 30%;
  height: 100%;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.logo-container {
  background-color: white;
  padding: 0.25rem;
  border-radius: 50%;
}

.store-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.store-name {
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 20px;
  text-align: center;
}

.voucher-right {
  width: 70%;
  height: 100%;
  background-color: white;
  padding: 0.75rem;
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

.voucher-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.discount-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.discount {
  font-size: 1rem;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0;
}

.code {
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e40af;
  background-color: #dbeafe;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  max-width: 100px;
  cursor: pointer;
}

.details {
  font-size: 0.75rem;
  color: #4b5563;
}

.detail-item {
  margin: 0.125rem 0;
}

.label {
  font-weight: 500;
  color: #6b7280;
  margin-right: 0.25rem;
}

.usage-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.process {
  margin: 0;
}

.save-button {
  background: linear-gradient(to right, #2563eb, #1e40af);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.save-button:hover {
  background: linear-gradient(to right, #1d4ed8, #1e3a8a);
  transform: translateY(-1px);
}

.code-apply {
  cursor: text;
}
</style>
