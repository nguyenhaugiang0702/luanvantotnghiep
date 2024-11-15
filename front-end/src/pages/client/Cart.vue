<template>
  <div class="container-fluid bg-primary py-4">
    <div class="container text-white">
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-start"
      >
        <div class="d-flex flex-column mb-3 mb-md-0">
          <div class="fw-bold text-uppercase fs-5">Giỏ hàng</div>
          <div>Hãy lựa chọn sách cho phù hợp với chính mình</div>
        </div>
        <div class="align-self-md-center">
          <span @click="handleNavigate(router, 'home')">Trang chủ </span>
          <span>/ Giỏ hàng</span>
        </div>
      </div>
    </div>
  </div>
  <div class="container py-4">
    <div class="row" v-if="selectedBooks.bookInCart.length === 0">
      <EmptyCart />
    </div>
    <div class="row" v-else>
      <div class="col-md-12">
        <CartTable @refreshVouchers="getVouchersUseds" />
      </div>
      <div class="col-md-12">
        <div class="container">
          <div class="row">
            <div class="card">
              <div class="card-header row">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    Tổng Tiền Phải Thanh Toán:
                    <span class="fw-bold fs-5"
                      >({{ selectedBooks.totalQuantity }}) sản phẩm</span
                    >
                  </div>
                  <VoucherModal @refreshCart:update="refreshCartMethod" />
                </div>
              </div>
              <div class="card-body fw-bold">
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <span>Tổng tiền hàng:</span>
                  <span class="price">{{
                    formatPrice(selectedBooks.originalTotalPrice)
                  }}</span>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <span>Giảm giá:</span>
                  <span class="price text-success">{{
                    formatPrice(selectedBooks.discountValue)
                  }}</span>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center fw-bold"
                >
                  <span>Tổng thanh toán:</span>
                  <span class="price text-danger">{{
                    formatPrice(selectedBooks.totalPrice)
                  }}</span>
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-end">
              <button
                :disabled="
                  selectedBooks.totalPrice === 0 ||
                  selectedBooks.totalQuantity === 0 ||
                  selectedBooks.originalTotalPrice === 0
                "
                @click="handleNavigate(router, 'checkout')"
                class="btn btn-primary col-sm-2 my-3"
              >
                Tiếp Tục
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch, provide } from "vue";
import { useRouter, useRoute } from "vue-router";
import CartTable from "../../components/client/carts/CartTable.vue";
import { formatPrice, handleNavigate } from "@/utils/utils";
import ApiUser from "@/service/user/apiUser.service";
import EmptyCart from "@/components/client/carts/EmptyCart.vue";
import Cookies from "js-cookie";
import VoucherModal from "@/components/client/modals/vouchers/VoucherModal.vue";
import { io } from "socket.io-client";

const router = useRouter();
const route = useRoute();
const selectedBooks = ref({
  originalTotalPrice: 0,
  totalQuantity: 0,
  totalPrice: 0,
  discountValue: 0,
  books: [],
  bookInCart: [],
});
const socket = ref(null);
const voucherUseds = ref([]);
const apiUser = new ApiUser();
const updateCart = inject("updateCart");
const vouchersEmit = ref([]);
const updateVoucher = inject("updateVouchers");
const getCartsWithCheckbox = async () => {
  const response = await apiUser.get("/cart/booksCheckBox");
  if (response.status === 200) {
    selectedBooks.value = response.data;
  }
};

const getVouchersUseds = async () => {
  const response = await apiUser.get("/vouchers/voucherUseds");
  if (response.status === 200) {
    voucherUseds.value = response.data;
  }
};

const refreshCartMethod = async (data) => {
  await getCartsWithCheckbox();
  vouchersEmit.value = data;
};

watch(updateCart, async (newValue) => {
  if (newValue) {
    await getCartsWithCheckbox();
  }
});

onMounted(async () => {
  await getCartsWithCheckbox();
  await getVouchersUseds();
  socket.value = io("http://localhost:3000");
  socket.value.on("hasNewVoucherUpdate", async (data) => {
    if (data.vouchers) {
      updateVoucher.value += 1;
      await getBookCheckOut();
    }
  });
});
</script>
<style scoped>
.voucher-item {
  transition: all 0.3s ease;
}

.voucher-item:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.voucher-list {
  max-height: 400px;
  overflow-y: auto;
}

.card {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
</style>
