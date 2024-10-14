<template>
  <div class="container bg-white pb-3">
    <h4 class="p-3">ĐƠN HÀNG</h4>
    <div class="container">
      <!-- Tabs Navigation -->
      <ul class="nav nav-tabs mb-3">
        <li
          class="nav-item"
          v-for="totalOrder in totalOrdersByStatus"
          @click="setActiveTab(totalOrder.status)"
        >
          <a
            :class="[
              'nav-link',
              activeTab === totalOrder.status ? 'active' : '',
            ]"
          >
            {{ countOrdersByStatus(totalOrder.status, totalOrder.count) }}
          </a>
        </li>
      </ul>

      <!-- Order List -->
      <div v-for="order in orders" :key="order.id" class="card mb-4">
        <div
          class="card-header d-flex justify-content-between align-items-center"
        >
          <h5 class="mb-0">Đơn hàng #{{ order._id }}</h5>
          <span class="badge" :class="getStatusBadge(order.status)">
            <span class="me-1">{{ getStatusIcon(order.status) }}</span
            >{{ getStatusLabel(order.status) }}
          </span>
        </div>
        <div class="card-body mh-100">
          <ul class="list-unstyled mb-3">
            <li
              v-for="(book, index) in order.detail"
              :key="index"
              class="d-flex justify-content-between mb-3"
            >
              <div class="d-flex align-items-center">
                <img
                  :src="`http://localhost:3000/` + book.bookID.images[0].path"
                  alt=""
                  class="me-3 book-image"
                />
                <div class="d-flex flex-column">
                  <span>{{ book.bookID.name }}</span>
                  <div class="d-flex flex-row">
                    <span>{{ book.quantity }} x</span>
                    <span class="text-danger fw-bold mx-2">
                      {{
                        formatPrice(
                          book.bookID.detail.originalPrice -
                            book.bookID.detail.discountPrice
                        )
                      }}</span
                    >
                    <span class="opacity-75 text-decoration-line-through">{{
                      formatPrice(book.bookID.detail.originalPrice)
                    }}</span>
                  </div>
                </div>
              </div>
              <span class="d-flex align-items-center fw-bold">{{
                formatPrice(book.realPrice * book.quantity)
              }}</span>
            </li>
          </ul>
          <hr />
          <div class="d-flex justify-content-between fw-bold">
            <span>Tổng cộng</span>
            <span class="text-danger fw-bold">{{
              formatPrice(order.totalPrice)
            }}</span>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-end gap-2">
          <button
            @click="
              handleNavigate(
                router,
                'profile-orders-detail',
                'orderID',
                order._id
              )
            "
            class="btn btn-outline-secondary"
          >
            Chi tiết
          </button>
          <button
            @click="requestCancelOrder(order._id)"
            v-if="order.status === 1"
            class="btn btn-danger"
          >
            Hủy đơn
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <nav v-if="totalPages > 0" aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li
            class="page-item"
            :class="{ disabled: currentPage === 1 }"
            @click="changePage(currentPage - 1)"
          >
            <a class="page-link" href="#">Previous</a>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
            @click="changePage(page)"
          >
            <a class="page-link" href="#">{{ page }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
            @click="changePage(currentPage + 1)"
          >
            <a class="page-link" href="#">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { formatPrice, handleNavigate } from "@/utils/utils";
import ApiUser from "@/service/user/apiUser.service";
import Cookies from "js-cookie";
import { showConfirmation } from "@/utils/swalUtils";
import { useRouter } from "vue-router";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

const router = useRouter();
const apiUser = new ApiUser();

const token = Cookies.get("accessToken");
const orders = ref([]);
// Phân trang
const currentPage = ref(1);
const limit = ref(3);
const totalPages = ref(1);
const status = ref("all");
const activeTab = ref("all");
const totalOrdersByStatus = ref([]);
const getOrders = async (page, limit, status) => {
  const response = await apiUser.get(
    `/orders?page=${page}&limit=${limit}&status=${status}`
  );
  if (response.status === 200) {
    orders.value = response.data.orders;
    totalPages.value = response.data.totalPages;
    currentPage.value = response.data.currentPage;
    totalOrdersByStatus.value = response.data.totalOrdersByStatus;
  }
};

const handleCancelOrder = async (orderID) => {
  try {
    const response = await apiUser.put(`/orders/updateStatus/${orderID}`, {
      status: 4,
    });
    if (response.status === 200) {
      showSuccessToast(response?.data?.message);
      await getOrders();
    }
  } catch (error) {
    console.log(error);
    showErrorToast(error.response?.data?.message);
  }
};

const requestCancelOrder = async (orderID) => {
  const isConfirm = await showConfirmation({
    title: "Bạn chắc chắn muốn hủy đơn hàng này?",
  });
  if (isConfirm.isConfirmed) {
    await handleCancelOrder(orderID);
  }
};

const countOrdersByStatus = (status, count) => {
  switch (status) {
    case "all":
      return `Tất cả đơn hàng (${count})`;
    case "pending":
      return `Chờ xử lý (${count})`;
    case "accepted":
      return `Đã xác nhận (${count})`;
    case "cancelled":
      return `Đã hủy (${count})`;
    case "request-cancel":
      return `Yêu cầu hủy (${count})`;
  }
};

onMounted(() => {
  getOrders(currentPage.value, limit.value, status.value);
});

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    getOrders(page, limit.value, activeTab.value);
  }
};

const setActiveTab = (tab) => {
  activeTab.value = tab;
  currentPage.value = 1;
  getOrders(currentPage.value, limit.value, tab);
};

const getStatusBadge = (status) => {
  switch (status) {
    case 1:
      return "bg-warning text-dark";
    case 2:
      return "bg-success";
    case 3:
      return "bg-danger";
    case 4:
      return "bg-warning text-dark";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 1:
      return "⏳";
    case 2:
      return "✅";
    case 3:
      return "❌";
    case 4:
      return "⚠️";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 1:
      return "Đang chờ xử lý";
    case 2:
      return "Đã xác nhận";
    case 3:
      return "Đã hủy";
    case 4:
      return "Yêu cầu hủy";
    default:
      return "Unknown"; // Để xử lý trường hợp không xác định
  }
};
</script>

<style scoped>
.nav-tabs .nav-link.active {
  background-color: #0d6efd;
  color: #fff;
}

.book-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
}
</style>
