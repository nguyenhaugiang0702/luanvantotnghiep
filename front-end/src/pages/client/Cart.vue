<template>
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
      <CartTable @update:selected-books-updated="handleSelectedBooksUpdated" />
    </div>
    <div class="col-md-12">
      <div class="container">
        <div class="row">
          <div class="card">
            <div class="card-header row">Tổng Tiền Phải Thanh Toán:</div>
            <div class="card-body fw-bold">
              <span>Tổng tiền : </span>
              <span class="price text-danger">{{
                selectedBooksTotalPrice
                  ? formatPrice(selectedBooksTotalPrice)
                  : "0 đ"
              }}</span>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <button class="btn btn-success col-sm-2 my-3" @click="GotoCheckOut">
              Tiếp Tục
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import CartTable from "../../components/client/carts/CartTable.vue";
import Cookies from "js-cookie";
import ApiService from "@/service/ApiService";
import { formatPrice } from "@/utils/utils";

export default {
  components: {
    CartTable,
  },
  setup() {
    const router = useRouter();
    const selectedBooksArray = ref([]);
    const apiService = new ApiService();

    const handleSelectedBooksUpdated = async (newSelectedBooksArray) => {
      selectedBooksArray.value = newSelectedBooksArray;
    };

    const GotoCheckOut = async () => {
      // trả về true nếu tìm thấy ít nhất 1
      const isSelected = Object.values(selectedBooksArray.value).some(
        (value) => value
      );
      if (!isSelected) {
        Swal.fire({
          title: "Vui lòng chọn sách hoặc kiểm tra lại số lượng",
          text: "Bạn phải chọn ít nhất một sách để tiếp tục",
          icon: "warning",
          confirmButtonText: "Đồng ý",
          timer: 1500,
        });
        return;
      }
      const token = Cookies.get("accessToken");
      if (token) {
        try {
          const response = await apiService.post(
            "books/checkNumber",
            selectedBooksArray.value
          );
          if (response.status === 200) {
            await apiService.post(
              "checkout",
              { selectedBooks: selectedBooksArray.value },
              token
            );
            router.push({ name: "checkout" });
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    const selectedBooksTotalPrice = computed(() => {
      const booksArray = selectedBooksArray.value;
      if (Array.isArray(booksArray) && booksArray.length > 0) {
        return booksArray.reduce(
          (totalPrice, book) => totalPrice + book.totalPrice,
          0
        );
      }
    });

    return {
      handleSelectedBooksUpdated,
      GotoCheckOut,
      selectedBooksTotalPrice,
      formatPrice,
    };
  },
};
</script>
