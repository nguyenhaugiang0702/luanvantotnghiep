<template>
  <div class="container">
    <div class="row">
      <div class="d-flex mx-auto">
        <div class="mx-2">
          <router-link :to="{ name: 'home' }">
            <i style="color: black" class="fa-solid fa-house fs-4 my-1"></i>
          </router-link>
        </div>
        <p class="my-2 fw-bold col-12 text-uppercase">/ GIỎ HÀNG</p>
      </div>
    </div>
    <div class="row">
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
import Swal from "sweetalert2";
import CartTable from "../../components/client/carts/CartTable.vue";
import Cookies from "js-cookie";
import { formatPrice, handleNavigate } from "@/utils/utils";
import CartService from "@/service/cart.service";
import { toast } from "vue3-toastify";

const router = useRouter();
const route = useRoute();
const selectedBooks = ref({
  totalQuantity: 0,
  totalPrice: 0,
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
