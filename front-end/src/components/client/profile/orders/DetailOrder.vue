<template>
  <div class="container bg-white">
    <h4 class="p-3">CHI TIẾT ĐƠN HÀNG</h4>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="card-title mb-0">Thông tin khách hàng</h5>
            </div>
            <div class="card-body">
              <p class="mb-1">
                <i class="fa-solid fa-user me-2"></i>
                {{
                  orderDetail.addressID.firstName +
                  " " +
                  orderDetail.addressID.lastName
                }}
              </p>
              <p>
                <i class="fa-solid fa-phone me-2"></i>
                {{ orderDetail.addressID.phoneNumber }}
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="card-title mb-0">Địa chỉ giao hàng</h5>
            </div>
            <div class="card-body">
              <p>
                <i class="fa-solid fa-location-dot me-2"></i>
                {{
                  orderDetail.addressID?.detailAddress +
                  ", " +
                  orderDetail.addressID?.ward?.name +
                  ", " +
                  orderDetail.addressID?.district?.name +
                  ", " +
                  orderDetail.addressID?.province?.name
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header">
          <h5 class="card-title mb-0">Chi tiết</h5>
        </div>
        <div class="card-body mh-100">
          <div
            v-for="book in orderDetail.detail"
            :key="book.bookID._id"
            class="border-bottom pb-3 mb-3"
          >
            <div class="d-flex align-items-start">
              <img
                v-if="book.bookID.images && book.bookID.images.length !== 0"
                :src="`http://localhost:3000/` + book.bookID?.images[0]?.path"
                class="me-3 rounded"
                width="80"
                height="80"
              />
              <div class="flex-grow-1">
                <h6 class="mb-1">{{ book.bookID.name }}</h6>
                <p class="mb-0 text-muted">Số lượng: {{ book.quantity }}</p>
              </div>
              <div class="text-end">
                <p
                  class="text-muted text-decoration-line-through mb-1 opacity-75"
                >
                  {{ formatPrice(book.bookID?.detail?.originalPrice) }}
                </p>
                <p class="mb-1 text-danger fw-bold">
                  {{ formatPrice(book.realPrice) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">Tóm tắt đơn hàng</h5>
        </div>
        <div class="card-body">
          <div class="summary-content">
            <p class="d-flex justify-content-between mb-3">
              <span
                ><i class="fa-solid fa-calendar-days me-2"></i>Ngày đặt
                hàng:</span
              >
              <span>{{
                moment(orderDetail.createdAt).format("DD/MM/YYYY HH:mm:ss")
              }}</span>
            </p>
            <p class="d-flex justify-content-between mb-3">
              <span>Trạng thái thanh toán:</span>
              <span
                class="badge"
                :class="orderDetail.wasPaided ? 'bg-success' : 'bg-danger'"
              >
                {{
                  orderDetail.wasPaided ? "Đã thanh toán" : "Chưa thanh toán"
                }}
              </span>
            </p>

            <!-- Price Section -->
            <div class="price-section">
              <!-- Main Price Row - Always Visible -->
              <div
                class="price-row"
                @click="togglePriceDetail"
                :class="{ 'is-open': isPriceDetailOpen }"
              >
                <span class="label">Tổng giá:</span>
                <div class="value-wrapper">
                  <span class="text-danger fw-bold">{{
                    formatPrice(orderDetail.totalPrice)
                  }}</span>
                  <i class="fa-solid fa-chevron-down ms-2 transition-icon"></i>
                </div>
              </div>

              <!-- Expandable Price Details -->
              <div class="price-details" :class="{ show: isPriceDetailOpen }">
                <div class="price-detail-row">
                  <span>Tổng đơn hàng:</span>
                  <span>{{ formatPrice(orderDetail.totalPriceOrder) }}</span>
                </div>
                <div class="price-detail-row">
                  <span>Phí vận chuyển:</span>
                  <span>{{ formatPrice(orderDetail.shippingFee) }}</span>
                </div>
                <div class="price-detail-row">
                  <span>Giảm giá:</span>
                  <span class="text-success"
                    >{{ formatPrice(orderDetail.totalDiscountPrice) }}</span
                  >
                </div>
                <div class="price-detail-row total">
                  <span>Tổng giá:</span>
                  <span class="text-danger fw-bold">{{
                    formatPrice(orderDetail.totalPrice)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import ApiUser from "@/service/user/apiUser.service";
import Cookies from "js-cookie";
import { formatPrice } from "@/utils/utils";
import moment from "moment";

const route = useRoute();
const token = Cookies.get("accessToken");
const orderID = ref(route.params.orderID);
const apiUser = new ApiUser();
const isPriceDetailOpen = ref(false);
const orderDetail = ref({
  userID: {},
  addressID: {},
  detail: [
    {
      bookID: {},
    },
  ],
});
const getOrderDetail = async () => {
  const response = await apiUser.get(`/orders/detail/${orderID.value}`);
  if (response.status === 200) {
    orderDetail.value = response.data;
    console.log(orderDetail.value);
  }
};

const togglePriceDetail = () => {
  isPriceDetailOpen.value = !isPriceDetailOpen.value;
};

onMounted(() => {
  getOrderDetail();
});
</script>

<style scoped>
.summary-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-section {
  background-color: #fff;
  border-radius: 8px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.price-row:hover {
  background-color: #e9ecef;
}

.price-row.is-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.value-wrapper {
  display: flex;
  align-items: center;
}

.transition-icon {
  transition: transform 0.3s ease;
}

.is-open .transition-icon {
  transform: rotate(-180deg);
}

.price-details {
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease-out;
  background-color: #fff;
  border: 1px solid #e9ecef;
  border-top: none;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.price-details.show {
  max-height: 300px;
}

.price-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
}

.price-detail-row:last-child {
  border-bottom: none;
}

.price-detail-row.total {
  background-color: #f8f9fa;
  font-weight: 500;
}

/* Smooth transitions */
.badge {
  transition: opacity 0.2s ease;
}

.badge:hover {
  opacity: 0.9;
}

/* Card styling */
.card {
  margin-bottom: 1.5rem;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #fff;
  border-bottom: 1px solid #e9ecef;
}

.label {
  font-weight: 500;
  color: #495057;
}
</style>
