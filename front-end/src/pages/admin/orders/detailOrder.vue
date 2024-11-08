<template>
  <div>
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
                                orderDetail.status.value === 4 ||
                                orderDetail.status.value === 3,
                              'text-bg-warning': orderDetail.status.value === 1,
                              'text-bg-success': orderDetail.status.value === 2,
                            }"
                          >
                            {{
                              getOrderStatus(
                                orderDetail.status.value,
                                orderDetail.statusFullOptions
                              )
                            }}
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
                              <div class="fs-6">
                                {{ book.bookID.name }}
                              </div>
                              <div class="my-2 fw-bold fs-6">
                                {{ formatPrice(book.realPrice) }} x
                                {{ book.quantity }}
                              </div>
                            </div>

                            <span class="fw-bold fs-6">{{
                              formatPrice(book.realPrice * book.quantity)
                            }}</span>
                          </li>
                        </ul>
                      </div>
                      <div class="card-footer d-flex flex-column mt-3">
                        <div class="d-flex justify-content-between">
                          <div class="fs-6">Tổng tiền hàng</div>
                          <div class="text-dark fs-6 fw-bold">
                            {{ formatPrice(orderDetail.totalPriceOrder) }}
                          </div>
                        </div>
                        <div class="d-flex justify-content-between">
                          <div class="fs-6">Phí vận chuyển</div>
                          <div class="text-dark fs-6 fw-bold">
                            {{ formatPrice(orderDetail.shippingFee) }}
                          </div>
                        </div>
                        <div class="d-flex justify-content-between">
                          <div class="fs-6">Tổng giảm giá</div>
                          <div class="fs-6 fw-bold text-success">
                            {{ formatPrice(orderDetail.totalDiscountPrice) }}
                          </div>
                        </div>
                        <hr />
                        <div class="d-flex justify-content-between">
                          <div class="fs-6 fw-bold">Tổng cộng</div>
                          <strong class="text-danger fs-5">{{
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
                            orderDetail.userID
                              ? orderDetail.userID?.firstName +
                                " " +
                                orderDetail.userID?.lastName
                              : "Đang cập nhạt"
                          }}
                        </p>
                        <p>
                          <i class="fa-solid fa-phone me-2"></i>
                          {{ orderDetail.addressID?.phoneNumber }}
                        </p>
                        <p v-if="orderDetail.addressID?.email">
                          <i class="fa-solid fa-envelope me-2"></i>
                          {{ orderDetail.addressID?.email }}
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

                    <!-- Customer Notes -->
                    <div class="card mb-3" v-if="orderDetail.notes">
                      <div class="card-header">
                        <h5 class="card-title">Ghi chú từ khách hàng</h5>
                      </div>
                      <div class="card-body">
                        <p class="mb-0">{{ orderDetail.notes }}</p>
                      </div>
                    </div>

                    <!-- Order Status -->
                    <div class="card mb-3">
                      <div class="card-header">
                        <h5 class="card-title">Trạng thái đơn hàng</h5>
                      </div>
                      <div class="card-body">
                        <select
                          v-model="orderDetail.status.value"
                          class="form-select"
                        >
                          <option
                            v-for="option in orderDetail.statusOptions"
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
  status: {
    value: null,
    label: "",
  },
});

const getOrderDetail = async () => {
  const response = await apiAdmin.get(`/orders/${orderID.value}`);
  if (response.status === 200) {
    orderDetail.value = response.data;
  }
};

const getOrderStatus = (status, statusFullOptions = []) => {
  const statusOptionObj = statusFullOptions.find(
    (statusOption) => statusOption.value === status
  );
  if (statusOptionObj) {
    return statusOptionObj
      ? statusOptionObj.label
      : "Không xác địng được trạng thái";
  }
};

onMounted(() => {
  getOrderDetail();
});

const updateStatus = async () => {
  try {
    const response = await apiAdmin.put(`/orders/${orderDetail.value._id}`, {
      status: orderDetail.value.status.value,
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
