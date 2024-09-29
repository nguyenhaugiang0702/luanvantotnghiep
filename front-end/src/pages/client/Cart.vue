<template>
  <div class="container-fluid bg-primary py-4">
    <div class="container text-white">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex flex-column">
          <div class="fw-bold text-uppercase fs-5">Giỏ hàng</div>
          <div>Hãy lựa chọn sách cho phù hợp với chính mình</div>
        </div>
        <div>
          <span @click="handleNavigate(router, 'home')">Trang chủ </span>
          <span>/ Giỏ hàng</span>
        </div>
      </div>
    </div>
  </div>
  <div class="container mt-4">
    <div class="row" v-if="selectedBooks.bookInCart.length === 0">
      <EmptyCart />
    </div>
    <div class="row" v-else>
      <div class="col-md-12">
        <CartTable />
      </div>
      <div class="col-md-12">
        <div class="container">
          <div class="row">
            <div class="card">
              <div class="card-header row">
                <div>
                  Tổng Tiền Phải Thanh Toán:
                  <span class="fw-bold fs-5"
                    >({{ selectedBooks.totalQuantity }}) sản phẩm</span
                  >
                </div>
              </div>
              <div class="card-body fw-bold">
                <span>Tổng tiền : </span>
                <span class="price text-danger">{{
                  formatPrice(selectedBooks.totalPrice)
                }}</span>
              </div>
            </div>
            <div class="d-flex justify-content-end">
              <button
                :disabled="
                  selectedBooks.totalPrice === 0 ||
                  selectedBooks.totalQuantity === 0
                "
                @click="handleNavigate(router, 'checkout')"
                class="btn btn-success col-sm-2 my-3"
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
import { ref, computed, onMounted, inject, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import CartTable from "../../components/client/carts/CartTable.vue";
import { formatPrice, handleNavigate } from "@/utils/utils";
import CartService from "@/service/cart.service";
import EmptyCart from "@/components/client/carts/EmptyCart.vue";

const router = useRouter();
const route = useRoute();
const selectedBooks = ref({
  totalQuantity: 0,
  totalPrice: 0,
  books: [],
  bookInCart: []
});
const cartService = new CartService();
const updateCart = inject("updateCart");
const getCartsWithCheckbox = async () => {
  const response = await cartService.get("/booksCheckBox");
  if (response.status === 200) {
    selectedBooks.value = response.data;
  }
};

watch(updateCart, (newValue) => {
  getCartsWithCheckbox();
});

onMounted(() => {
  getCartsWithCheckbox();
});
</script>
