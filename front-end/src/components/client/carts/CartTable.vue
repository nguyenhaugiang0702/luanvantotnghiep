<template>
  <table class="table">
    <thead class="table-light">
      <tr>
        <th>
          <input
            type="checkbox"
            class="w-100"
            v-model="selectAll"
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
            v-model="selectedBooks[book.bookID._id]"
            @change="handleCheckboxChange"
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
          <div>
            <small>Còn lại 0</small>
          </div>
          <span class="price text-danger fw-bold">
            {{ formattedPrice(book.price) }}
          </span>
          <span class="ms-2 text-decoration-line-through opacity-75">{{
            formattedPrice(book.bookID.detail.originalPrice)
          }}</span>
        </td>
        <td>
          <div class="input-group">
            <button
              class="border p-2"
              type="button"
              @click="decreaseQuantity(book)"
            >
              -
            </button>
            <input
              :id="'inputQuantity_' + book.bookID._id"
              class="col-sm-3 col-md-3 border border-3 text-center w-50"
              @change="updateQuantity(book, $event)"
              :value="book.quantity"
              min="1"
            />
            <button
              class="border p-2"
              type="button"
              @click="increaseQuantity(book)"
            >
              +
            </button>
          </div>
        </td>
        <td>
          <span class="price text-danger fw-bold">
            {{ formattedPrice(book.quantity * book.price) }}
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
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import CartService from "@/service/cart.service";
import { formatPrice } from "@/utils/utils";
import { showConfirmation } from "@/utils/swalUtils";
export default {
  setup(props, { emit }) {
    const booksInCart = ref([]);
    const selectedBooks = ref({});
    const selectAll = ref(false);
    const cartService = new CartService();
    const token = Cookies.get("accessToken");
    const isLoggedIn = Cookies.get("isLoggedIn");
    const updateCart = inject("updateCart");

    const getCarts = async () => {
      const token = Cookies.get("accessToken");
      if (token) {
        const response = await cartService.get("/", token);
        if (response.status === 200) {
          booksInCart.value = response.data;
        }
      }
    };

    onMounted(() => {
      getCarts();
    });

    const increaseQuantity = async (book) => {
      const bookID = book.bookID._id;
      const data = {
        books: [
          {
            bookID: bookID,
            quantity: 1,
          },
        ],
      };
      const response = await cartService.post("/", data, token);
      if (response.status === 200) {
        await getCarts();
        updateCart.value += 1;
        propsBooksGotoCart();
      }
    };

    const decreaseQuantity = async (book) => {
      const bookID = book.bookID._id;
      const quantity = $(`#inputQuantity_${book.bookID._id}`).val();
      if (quantity > 1) {
        const data = {
          books: [
            {
              bookID: bookID,
              quantity: 1,
              method: "DELETE", // Xóa số lượng đi 1
            },
          ],
        };
        const response = await cartService.post("/", data, token);
        if (response.status === 200) {
          await getCarts();
          propsBooksGotoCart();
          updateCart.value += 1;
        }
      } else {
        const isConfirmed = await showConfirmation({
          title: "Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng?",
        });
        if (isConfirmed.isConfirmed) {
          await deleteBook(bookID);
        }
      }
    };

    const updateQuantity = async (book, event) => {
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
      const response = await cartService.post("/", data, token);
      if (response.status === 200) {
        await getCarts();
        updateCart.value += 1;
        propsBooksGotoCart();
      }
    };

    const deleteBook = async (bookID) => {
      if (token) {
        const isConfirmed = await showConfirmation({
          title: "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?",
        });
        if (isConfirmed.isConfirmed) {
          const response = await cartService.delete(`/${bookID}`, token);
          if (response.status == 200) {
            await getCarts();
            updateCart.value += 1;
          }
        }
      }
    };

    const toggleSelectAll = () => {
      for (const book of booksInCart.value.books) {
        selectedBooks.value[book.bookID._id] = selectAll.value;
      }
      propsBooksGotoCart();
    };

    const propsBooksGotoCart = () => {
      const selectedBooksArray = [];
      const booksArray = booksInCart.value.books;
      let totalPrice = 0;
      if (Array.isArray(booksArray) && booksArray.length > 0) {
        for (const bookId in selectedBooks.value) {
          const isSelected = selectedBooks.value[bookId];
          if (isSelected) {
            const book = booksArray.find((book) => book.bookID._id === bookId);
            const bookTotalPrice = book.quantity * book.price;
            totalPrice += bookTotalPrice;
            selectedBooksArray.push({
              bookID: book.bookID._id,
              quantity: book.quantity,
              totalPrice: bookTotalPrice,
            });
          }
        }
      }
      emit("update:selected-books-updated", selectedBooksArray);
    };

    const deleteAllBook = async (event) => {
      event.preventDefault();
      if (token) {
        const isConfirmed = await showConfirmation({
          title: "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?",
        });
        if (isConfirmed.isConfirmed) {
          const response = await cartService.delete("/", token);
          if (response.status == 200) {
            getCarts();
            updateCart.value += 1;
          }
        }
      }
    };

    const handleCheckboxChange = () => {
      console.log(selectedBooks.value);
      propsBooksGotoCart();
    };

    const formattedPrice = (price) => {
      return formatPrice(price);
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
      propsBooksGotoCart,
      deleteAllBook,
      handleCheckboxChange,
      formattedPrice,
    };
  },
};
</script>
