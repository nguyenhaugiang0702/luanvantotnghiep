<template>
  <div class="table-responsive">
    <table class="table">
      <thead class="table-light">
        <tr>
          <th>
            <input
              type="checkbox"
              class="w-100"
              :checked="selectAll && booksInCart.length !== 0"
              @change="toggleSelectAll"
            />
          </th>
          <th>Hình</th>
          <th>Tên Sách</th>
          <th>Số Lượng</th>
          <th>Tổng Giá</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in booksInCart.books" :key="book.bookID._id">
          <td>
            <input
              type="checkbox"
              class="w-100"
              :checked="book.isCheckOut"
              @change="handleCheckboxChange(book.bookID._id)"
            />
          </td>
          <td style="width: 150px">
            <router-link
              :to="{
                name: 'book-detail',
                params: { bookID: book.bookID._id },
              }"
              ><img
                v-if="book.bookID?.images && book.bookID?.images?.length > 0"
                class="img-fluid"
                :src="`http://localhost:3000/` + book.bookID?.images[0]?.path"
                alt=""
            /></router-link>
          </td>
          <td>
            <router-link
              class="text-decoration-none text-break text-dark"
              :to="{
                name: 'book-detail',
                params: { bookID: book.bookID._id },
              }"
              >{{ book.bookID.name }}</router-link
            >
            <div class="mt-2">
              <span class="price text-danger fw-bold">
                {{ formatPrice(book.price) }}
              </span>
              <span class="ms-2 text-decoration-line-through opacity-75">{{
                formatPrice(book.bookID.detail.originalPrice)
              }}</span>
            </div>
          </td>
          <td>
            <div class="d-flex justify-content-start align-items-center">
              <button
                class="btn btn-outline-secondary p-2"
                type="button"
                @click="decreaseQuantity(book)"
              >
                -
              </button>
              <input
                :id="'inputQuantity_' + book.bookID._id"
                class="form-control mx-2 text-center"
                style="width: 50px"
                @change="updateQuantity(book, $event)"
                :value="book.quantity"
                min="1"
              />
              <button
                class="btn btn-outline-secondary p-2"
                type="button"
                @click="increaseQuantity(book)"
              >
                +
              </button>
            </div>
          </td>
          <td>
            <span class="price text-danger fw-bold">
              {{ formatPrice(book.quantity * book.price) }}
            </span>
          </td>
          <td>
            <a href="">
              <button
                @click.prevent="deleteBook(book.bookID._id)"
                class="btn btn-danger"
                type="button"
              >
                Xóa
              </button>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="d-flex justify-content-end">
    <div class="mb-3">
      <a href="">
        <button class="btn btn-danger" @click="deleteAllBook($event)">
          Xóa tất cả
        </button>
      </a>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, inject } from "vue";
import Cookies from "js-cookie";
import ApiUser from "@/service/user/apiUser.service";
import { formatPrice } from "@/utils/utils";
import { showConfirmation } from "@/utils/swalUtils";
import { toast } from "vue3-toastify";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import { io } from "socket.io-client";

export default {
  emit: ["refreshVouchers"],
  setup(props, { emit }) {
    const booksInCart = ref([]);
    const selectedBooks = ref({});
    const selectAll = ref(false);
    let apiUser = new ApiUser();
    const token = Cookies.get("accessToken");
    const isLoggedIn = Cookies.get("isLoggedIn");
    const updateCart = inject("updateCart");
    const updateVouchers = inject("updateVouchers");
    const socket = ref(null);

    const getCarts = async () => {
      if (token) {
        const response = await apiUser.get("/cart");
        if (response.status === 200) {
          booksInCart.value = response.data;
          if (response.data.books.length === 0) {
            selectAll.value = false;
          } else {
            selectAll.value = response.data.books.every(
              (book) => book.isCheckOut
            );
          }
        }
      }
    };

    onMounted(async () => {
      socket.value = io("http://localhost:3000");
      socket.value.on("hasNewHideBook", async (data) => {
        if (data.book) {
          await getCarts();
        }
      });
      await getCarts();
    });

    const increaseQuantity = async (book) => {
      try {
        const bookID = book.bookID._id;
        const data = {
          books: [
            {
              bookID: bookID,
              quantity: 1,
              method: "INCREASE",
            },
          ],
        };
        const response = await apiUser.post("/cart", data);
        if (response.status === 200) {
          await getCarts();
          updateCart.value += 1;
          updateVouchers.value += 1;
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
        await getCarts();
      }
    };

    const decreaseQuantity = async (book) => {
      try {
        const bookID = book.bookID._id;
        const quantity = $(`#inputQuantity_${book.bookID._id}`).val();
        if (quantity > 1) {
          const data = {
            books: [
              {
                bookID: bookID,
                quantity: 1,
                method: "DECREASE", // Xóa số lượng đi 1
              },
            ],
          };
          const response = await apiUser.post("/cart", data);
          if (response.status === 200) {
            await getCarts();
            updateCart.value += 1;
            updateVouchers.value += 1;
          }
        } else {
          const isConfirmed = await showConfirmation({
            title: "Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng?",
          });
          if (isConfirmed.isConfirmed) {
            await deleteBook(bookID);
          }
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
        await getCarts();
      }
    };

    const updateQuantity = async (book, event) => {
      try {
        const bookID = book.bookID._id;
        const newQuantity = parseInt(event.target.value);
        if (isNaN(newQuantity) || newQuantity < 1) {
          // Hiển thị lại số lượng hiện tại
          $(`#inputQuantity_${bookID}`).val(book.quantity);
          return;
        }
        const data = {
          books: [
            {
              bookID: bookID,
              quantity: newQuantity,
              method: "UPDATE",
            },
          ],
        };
        const response = await apiUser.post("/cart", data);
        if (response.status === 200) {
          await getCarts();
          updateCart.value += 1;
          updateVouchers.value += 1;
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
        await getCarts();
      }
    };

    const deleteBook = async (bookID) => {
      if (token) {
        const isConfirmed = await showConfirmation({
          title: "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?",
        });
        if (isConfirmed.isConfirmed) {
          const response = await apiUser.delete(`/cart/${bookID}`);
          if (response.status == 200) {
            updateCart.value += 1;
            updateVouchers.value += 1;
            await getCarts();
          }
        }
      }
    };

    const toggleSelectAll = async () => {
      const response = await apiUser.put("/cart/checkAll", {});
      if (response.status === 200) {
        await getCarts();
        updateCart.value += 1;
        updateVouchers.value += 1;
        emit("refreshVouchers");
      }
    };

    const deleteAllBook = async (event) => {
      event.preventDefault();
      if (token) {
        const isConfirmed = await showConfirmation({
          title: "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?",
        });
        if (isConfirmed.isConfirmed) {
          const response = await apiUser.delete("/cart");
          if (response.status == 200) {
            updateCart.value += 1;
            updateVouchers.value += 1;
            await getCarts();
          }
        }
      }
    };

    const handleCheckboxChange = async (bookID) => {
      const response = await apiUser.put(`/cart/${bookID}`, {});
      if (response.status === 200) {
        await getCarts();
        updateCart.value += 1;
        updateVouchers.value += 1;
        emit("refreshVouchers");
      }
    };

    return {
      booksInCart,
      selectedBooks,
      selectAll,
      updateQuantity,
      toggleSelectAll,
      getCarts,
      increaseQuantity,
      decreaseQuantity,
      deleteBook,
      deleteAllBook,
      handleCheckboxChange,
      formatPrice,
    };
  },
};
</script>
<style scoped>
.table-responsive {
  overflow-x: auto;
  border-radius: 10px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
</style>
