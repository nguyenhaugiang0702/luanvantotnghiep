<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý đơn hàng
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Đơn hàng</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Chi tiết</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <div class="container mx-auto">
                <div class="row">
                  <div class="col-md-8">
                    <div class="card">
                      <div class="card-header">
                        <h5 class="card-title">Order #{{ orderDetail._id }}</h5>
                        <p class="card-text d-flex justify-content-between">
                          <span class=""
                            >Ngày đặt
                            {{ formatDate(orderDetail.createdAt) }}</span
                          >
                          <span
                            class="badge handleBadge"
                            :class="{
                              'text-bg-danger':
                                orderDetail.status === 4 ||
                                orderDetail.status === 3,
                              'text-bg-warning': orderDetail.status === 1,
                              'text-bg-success': orderDetail.status === 2,
                            }"
                          >
                            {{ getOrderStatus(orderDetail.status) }}
                          </span>
                        </p>
                      </div>
                      <div class="card-body">
                        <h6 class="mb-3">
                          <i class="fa-solid fa-box me-2"></i> Các sách
                        </h6>
                        <ul class="list-group list-group-flush">
                          <li
                            v-for="book in orderDetail.detail"
                            :key="book.bookID.id"
                            class="list-group-item d-flex justify-content-between"
                          >
                            <img
                              v-if="
                                book.bookID.images &&
                                book.bookID.images.length !== 0
                              "
                              :src="
                                `http://localhost:3000/` +
                                book.bookID?.images[0]?.path
                              "
                              alt="Product Image"
                              class="img-fluid rounded book-image"
                            />
                            <div class="d-flex flex-column flex-grow-1 ms-4">
                              <div>
                                {{ book.bookID.name }}
                              </div>
                              <div class="my-2 fw-bold">
                                {{ formatPrice(book.realPrice) }} x
                                {{ book.quantity }}
                              </div>
                            </div>

                            <span class="fw-bold">{{
                              formatPrice(book.realPrice * book.quantity)
                            }}</span>
                          </li>
                        </ul>
                      </div>
                      <div class="card-footer d-flex flex-column mt-3">
                        <div class="d-flex justify-content-between">
                          <div>Phí vận chuyển</div>
                          <strong class="text-dark">{{
                            formatPrice(orderDetail.shippingFee)
                          }}</strong>
                        </div>
                        <div class="d-flex justify-content-between">
                          <strong>Tổng cộng</strong>
                          <strong class="text-danger">{{
                            formatPrice(orderDetail.totalPrice)
                          }}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <!-- Customer Information -->
                    <div class="card mb-3">
                      <div class="card-header">
                        <h5 class="card-title">Thông tin khách hàng</h5>
                      </div>
                      <div class="card-body">
                        <p>
                          <i class="fa-solid fa-user me-2"></i>
                          {{
                            orderDetail.userID?.firstName +
                            " " +
                            orderDetail.userID?.lastName
                          }}
                        </p>
                        <p>
                          <i class="fa-solid fa-phone me-2"></i>
                          {{ orderDetail.userID?.phoneNumber }}
                        </p>
                        <p v-if="orderDetail.userID?.email">
                          <i class="fa-solid fa-envelope me-2"></i>
                          {{ orderDetail.userID?.email }}
                        </p>
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

                    <!-- Order Status -->
                    <div class="card mb-3">
                      <div class="card-header">
                        <h5 class="card-title">Trạng thái đơn hàng</h5>
                      </div>
                      <div class="card-body">
                        <select
                          v-model="orderDetail.status"
                          class="form-select"
                        >
                          <option
                            v-for="option in statusOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </option>
                        </select>
                      </div>
                      <div class="card-footer">
                        <button
                          class="btn btn-primary w-100"
                          @click="updateStatus"
                        >
                          Cập nhật trạng thái
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-layout-content>
  </div>
</template>

<script setup>
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import { formatPrice, formatDate } from "@/utils/utils";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

const orderStatus = ref("processing");
const apiAdmin = new ApiAdmin();
const route = useRoute();
const orderID = ref(route.params.orderID);
const orderDetail = ref({
  userID: {},
  addressID: {},
  detail: [
    {
      bookID: {},
    },
  ],
  status: 0,
});

const options = {
  1: [
    { value: 1, label: "Chờ xác nhận" },
    { value: 2, label: "Đã xác nhận" },
  ],
  2: [{ value: 2, label: "Đã xác nhận" }],
  3: [{ value: 3, label: "Đã hủy" }],
  4: [
    { value: 4, label: "Yêu cầu hủy" },
    { value: 3, label: "Đã hủy" },
  ],
};

const getOrderDetail = async () => {
  const response = await apiAdmin.get(`/orders/${orderID.value}`);
  if (response.status === 200) {
    orderDetail.value = response.data;
  }
};

const statusOptions = computed(() => options[orderDetail.value.status] || []);

const getOrderStatus = (status) => {
  switch (status) {
    case 1:
      return "Chờ xác nhận";
    case 2:
      return "Đã xác nhận";
    case 3:
      return "Đã hủy";
    case 4:
      return "Yêu cầu hủy";
    default:
      return "Không xác định";
  }
};

onMounted(() => {
  getOrderDetail();
});

const updateStatus = async () => {
  try {
    const response = await apiAdmin.put(`/orders/${orderDetail.value._id}`, {
      status: orderDetail.value.status,
    });
    if (response.status === 200) {
      showSuccessToast(response?.data?.message);
      await getOrderDetail();
    }
  } catch (error) {
    console.log(error);
    showErrorToast(error.response?.data?.message);
    await getOrderDetail();
  }
};
</script>

<style scoped>
.book-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
}

.handleBadge {
  font-size: 14px;
}
</style>
