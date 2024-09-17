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
                  orderDetail.userID.firstName +
                  " " +
                  orderDetail.userID.lastName
                }}
              </p>
              <p>
                <i class="fa-solid fa-phone me-2"></i>
                {{ orderDetail.userID.phoneNumber }}
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
                  orderDetail.addressID.detailAddress +
                  ", " +
                  orderDetail.addressID.ward +
                  ", " +
                  orderDetail.addressID.district +
                  ", " +
                  orderDetail.addressID.province
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
        <div class="card-body">
          <div
            v-for="book in orderDetail.detail"
            :key="book.bookID.id"
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
                <p class="text-success fw-bold">
                  Tiết kiệm:
                  {{ formatPrice(book.bookID?.detail?.discountPrice) }}
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
          <p class="d-flex justify-content-between">
            <span
              ><i class="fa-solid fa-calendar-days me-2"></i>Ngày đặt
              hàng:</span
            >
            <span>{{
              moment(orderDetail.createdAt).format("DD/MM/YYYY HH:mm:ss")
            }}</span>
          </p>
          <p class="d-flex justify-content-between">
            <span>Trạng thái thanh toán:</span>
            <span
              class="badge"
              :class="orderDetail.wasPaided ? 'bg-success' : 'bg-danger'"
            >
              {{ orderDetail.wasPaided ? "Đã thanh toán" : "Chưa thanh toán" }}
            </span>
          </p>
          <p class="d-flex justify-content-between font-weight-bold">
            <span>Tổng giá:</span>
            <span class="text-danger fw-bold">{{
              formatPrice(orderDetail.totalPrice)
            }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import OrderService from "@/service/order.service";
import Cookies from "js-cookie";
import { formatPrice } from "@/utils/utils";
import moment from "moment";

const route = useRoute();
const token = Cookies.get("accessToken");
const orderID = ref(route.params.orderID);
const orderService = new OrderService();
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
  const response = await orderService.get(`/detail/${orderID.value}`, token);
  if (response.status === 200) {
    orderDetail.value = response.data;
    console.log(response.data);
  }
};

onMounted(() => {
  getOrderDetail();
});
</script>

<style scoped>
.card-title {
  font-size: 1.25rem;
}
</style>
