<template>
  <div class="container bg-white">
    <h4 class="p-3">ĐƠN HÀNG</h4>
    <div class="container pb-3">
      <!-- Tabs Navigation -->
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item" @click="setActiveTab('all')">
          <a :class="['nav-link', activeTab === 'all' ? 'active' : '']">
            Tất cả đơn hàng ({{ countOrdersByStatus("all") }})
          </a>
        </li>
        <li class="nav-item" @click="setActiveTab('pending')">
          <a :class="['nav-link', activeTab === 'pending' ? 'active' : '']">
            Chờ xử lý ({{ countOrdersByStatus("pending") }})
          </a>
        </li>
        <li class="nav-item" @click="setActiveTab('accepted')">
          <a :class="['nav-link', activeTab === 'accepted' ? 'active' : '']">
            Đã xác nhận ({{ countOrdersByStatus("accepted") }})
          </a>
        </li>
        <li class="nav-item" @click="setActiveTab('cancelled')">
          <a :class="['nav-link', activeTab === 'cancelled' ? 'active' : '']">
            Đã hủy ({{ countOrdersByStatus("cancelled") }})
          </a>
        </li>
        <li class="nav-item" @click="setActiveTab('request-cancel')">
          <a
            :class="[
              'nav-link',
              activeTab === 'request-cancel' ? 'active' : '',
            ]"
          >
            Yêu cầu hủy ({{ countOrdersByStatus("request-cancel") }})
          </a>
        </li>
      </ul>

      <!-- Order List -->
      <div v-for="order in currentOrders" :key="order.id" class="card mb-4">
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
      <nav v-if="totalPages > 1" aria-label="Page navigation">
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
import OrderService from "@/service/order.service";
import Cookies from "js-cookie";
import { toast } from "vue3-toastify";
import { showConfirmation } from "@/utils/swalUtils";
import { useRouter } from "vue-router";

const router = useRouter();
const orderService = new OrderService();

const token = Cookies.get("accessToken");
const orders = ref([]);

const getOrders = async () => {
  const response = await orderService.get("/getAll");
  if (response.status === 200) {
    orders.value = response.data.orders;
  }
};

const handleCancelOrder = async (orderID) => {
  const response = await orderService.put(`/updateStatus/${orderID}`, {
    status: 4,
  });
  if (response.status === 200) {
    toast(response.data.message, {
      theme: "auto",
      type: "success",
      dangerouslyHTMLString: true,
    });
    await getOrders();
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

onMounted(() => {
  getOrders();
});

const activeTab = ref("all");
const currentPage = ref(1);
const ordersPerPage = 2;

const filteredOrders = computed(() => {
  if (activeTab.value === "all") return orders.value;
  const statusMap = {
    pending: 1,
    accepted: 2,
    cancelled: 3,
    "request-cancel": 4,
  };
  return orders.value.filter(
    (order) => order.status === statusMap[activeTab.value]
  );
});

const countOrdersByStatus = (status) => {
  if (status === "all") return orders.value.length;

  const statusMap = {
    pending: 1,
    accepted: 2,
    cancelled: 3,
    "request-cancel": 4,
  };

  return orders.value.filter((order) => order.status === statusMap[status])
    .length;
};

const totalPages = computed(() =>
  Math.ceil(filteredOrders.value.length / ordersPerPage)
);

const currentOrders = computed(() => {
  const start = (currentPage.value - 1) * ordersPerPage;
  return filteredOrders.value.slice(start, start + ordersPerPage);
});

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) currentPage.value = page;
};

const setActiveTab = (tab) => {
  activeTab.value = tab;
  currentPage.value = 1;
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
