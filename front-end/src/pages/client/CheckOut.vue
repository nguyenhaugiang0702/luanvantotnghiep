<template>
  <div class="container pb-5 container-pb">
    <!-- address -->
    <div class="row bg-white">
      <div class="text-uppercase fw-bold col-md-6 pt-3 ps-3">
        địa chỉ giao hàng
      </div>
      <router-link
        :to="{ name: 'profile-address' }"
        class="text-uppercase fw-bold col-md-6 pt-3 pe-3 text-end text-primary text-decoration-none"
      >
        thay đổi
      </router-link>
      <div class="col-md-12"><hr /></div>
      <div class="col-md-12">
        <div class="form-check" v-for="addr in address">
          <input
            class="form-check-input border border-dark"
            type="radio"
            name="address"
            :id="`address_${addr._id}`"
            :checked="addr.isDefault"
            @change="handleSelectAddress(addr._id)"
          />
          <label class="form-check-label" for="address1">
            {{
              addr.firstName +
              " " +
              addr.lastName +
              " | " +
              addr.detailAddress +
              ", " +
              addr.ward +
              ", " +
              addr.district +
              ", " +
              addr.province +
              " | " +
              addr.phoneNumber
            }}
          </label>
        </div>
      </div>
    </div>

    <!-- Payment -->
    <div class="row bg-white mt-4">
      <div class="text-uppercase fw-bold col-md-6 pt-3 ps-3">
        phương thức thanh toán
      </div>
      <div class="col-md-12"><hr /></div>
      <div class="col-md-12">
        <div class="form-check">
          <input
            class="form-check-input border border-dark"
            type="radio"
            name="payment"
            id="payment1"
            checked
            v-model="paymentMethod"
            value="COD"
          />
          <label class="form-check-label" for="payment1"
            ><img
              src="../../assets/images/payments/cod.svg"
              class="me-2"
              alt=""
              srcset=""
            />Thanh toán khi nhận hàng</label
          >
        </div>
        <div class="form-check mt-3">
          <input
            class="form-check-input border border-dark"
            type="radio"
            name="payment"
            id="payment1"
            v-model="paymentMethod"
            value="ZALOPAY"
          />
          <label class="form-check-label" for="payment1"
            ><img
              src="../../assets/images/payments/zalopay.png"
              style="
                width: 40px;
                height: 25px;
                border-radius: 2px;
                object-fit: cover;
              "
              class="me-2 border border-dark border-1"
F              alt=""
              srcset=""
            />Thanh toán ZALOPAY</label
          >
        </div>
        <div class="form-check my-3">
          <input
            class="form-check-input border border-dark"
            type="radio"
            name="payment"
            id="payment1"
            v-model="paymentMethod"
            value="MOMO"
          />
          <label class="form-check-label" for="payment1"
            ><img
              src="../../assets/images/payments/momo.svg"
              class="me-2"
              alt=""
              srcset=""
            />Thanh toán MOMO</label
          >
        </div>
        <div class="form-check my-3">
          <input
            class="form-check-input border border-dark"
            type="radio"
            name="payment"
            id="payment1"
            v-model="paymentMethod"
            value="PAYPAL"
          />
          <label class="form-check-label" for="payment1"
            ><img
              src="../../assets/images/payments/paypal.png"
              style="width: 40px; height: 25px; border-radius: 2px"
              class="me-2 border border-dark border-1"
              alt=""
              srcset=""
            />Thanh toán PAYPAL</label
          >
        </div>
      </div>
    </div>

    <!-- Vouchers -->
    <div class="row bg-white mt-4 pb-4">
      <div class="text-uppercase fw-bold col-md-6 pt-3 ps-3">mã khuyến mãi</div>
      <div class="col-md-12"><hr /></div>
      <div class="col-md-2 text-center pt-1">Mã khuyến mãi</div>
      <div class="col-md-4">
        <input
          type="text"
          class="form-control"
          placeholder="Nhập mã khuyễn mãi"
        />
      </div>
      <div class="col-md-4 pt-1">Chọn mã khuyến mãi</div>
    </div>

    <!-- Notes -->
    <div class="row bg-white mt-4 pb-4">
      <div class="text-uppercase fw-bold col-md-6 pt-3 ps-3">
        Thông tin khác
      </div>
      <div class="col-md-12"><hr /></div>
      <div class="col-md-12 form-group">
        <label for="">Ghi chú</label>
        <input
          type="text"
          class="form-control"
          placeholder="Nhập ghi chú cho người bán"
          v-model="notes"
        />
      </div>
    </div>

    <!-- CheckOrder -->
    <div class="row bg-white mt-4 pb-5" style="padding-bottom: 200px">
      <div class="text-uppercase fw-bold col-md-6 pt-3 ps-3">
        Kiểm tra lại đơn hàng
      </div>
      <div class="col-md-12"><hr /></div>
      <div class="row mb-4" v-for="book in selectedBooks.books">
        <img
          v-if="book.bookID && book.bookID.images.length !== 0"
          style="width: 165px; height: 140px"
          :src="`${config.imgUrl}/` + book.bookID?.images[0]?.path"
          alt=""
        />
        <div class="col-sm-5">{{ book.bookID.name }}</div>
        <div class="col-sm-2">
          <div>
            {{ formatPrice(book.price) }}
          </div>
          <div class="text-decoration-line-through opacity-75">
            {{ formatPrice(book.bookID.detail.originalPrice) }}
          </div>
        </div>
        <div class="col-sm-1">
          <div>{{ book.quantity }}</div>
        </div>
        <div class="col-sm-2">
          <div class="text-danger fw-bold">
            {{ formatPrice(book.price * book.quantity) }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- CheckOut -->
  <div class="container-fluid bg-white py-4 checkout-bar">
    <div class="container">
      <div class="row d-flex justify-content-end text-end">
        <div class="col-md-10 col-sm-10">
          <div class="text-end">Thành tiền:</div>
          <div class="text-end">Phí vận chuyển (Giao hàng tiêu chuẩn):</div>
          <div class="text-end fw-bold my-1">Tổng Số Tiền (gồm VAT):</div>
        </div>
        <div class="col-md-2 col-sm-2">
          <div class="text-end">
            {{ formatPrice(selectedBooks.totalPrice) }}
          </div>
          <div class="text-end">0 đ</div>
          <div class="text-end fs-5 fw-bold text-danger">
            {{ formatPrice(selectedBooks.totalPrice) }}
          </div>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-sm-6 col-md-6">
          <div class="form-check mb-2">
            <input
              class="form-check-input border border-dark"
              type="checkbox"
              id="termsCheckbox"
              v-model="acceptedTerms"
            />
            <label class="form-check-label" for="termsCheckbox">
              Bằng việc tiến hành Mua hàng, Bạn đã đồng ý với <br />
              <a href="#">Điều khoản & Điều kiện của Fahasa.com</a>
            </label>
          </div>
        </div>
        <div class="col-sm-6 col-md-6 text-end">
          <button
            class="btn btn-danger px-4"
            :disabled="!acceptedTerms"
            @click="confirmPayment"
          >
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed, inject } from "vue";
import Cookies from "js-cookie";
import AddressService from "@/service/address.service";
import CartService from "@/service/cart.service";
import config from "@/config";
import { formatPrice } from "@/utils/utils";
import OrderService from "@/service/order.service";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";

const token = Cookies.get("accessToken");
const addressService = new AddressService();
const cartService = new CartService();
const orderService = new OrderService();
const address = ref([]);
const selectedBooks = ref({
  totalPrice: 0,
  totalQuantity: 0,
  books: [],
});
const selectedAddress = ref(""); // Địa chỉ giao hàng đã chọn
const paymentMethod = ref("COD"); // Phương thức thanh toán mặc định là COD
const notes = ref(""); // Ghi chú cho người bán
const acceptedTerms = ref(false);
const router = useRouter();
const updateCart = inject("updateCart");

const getAddress = async () => {
  const response = await addressService.get(`/`, token);
  if (response.status === 200) {
    address.value = response.data;
    const defaultAddress = address.value.find((addr) => addr.isDefault);
    if (defaultAddress) {
      selectedAddress.value = defaultAddress._id;
    }
  }
};

const getBookCheckOut = async () => {
  const response = await cartService.get("/booksCheckBox", token);
  if (response.status === 200) {
    selectedBooks.value.books = response.data.books;
    console.log(selectedBooks.value.books);
    selectedBooks.value.totalPrice = response.data.totalPrice;
    selectedBooks.value.totalQuantity = response.data.totalQuantity;
  }
};

const handleSelectAddress = (addressID) => {
  selectedAddress.value = addressID;
};

const confirmPayment = async () => {
  const orderData = {
    addressID: selectedAddress.value,
    detail: selectedBooks.value.books.map((book) => ({
      bookID: book.bookID._id,
      quantity: book.quantity,
      realPrice: book.price,
    })),
    totalPrice: selectedBooks.value.totalPrice,
    totalQuantity: selectedBooks.value.totalQuantity,
    notes: notes.value,
    payment: paymentMethod.value,
  };
  console.log(orderData);
  switch (paymentMethod.value) {
    case "MOMO":
      try {
        // Gọi API MOMO ở đây
        const momoResponse = await orderService.post(
          "/momo/createLink",
          orderData,
          token
        );

        if (momoResponse.status === 200) {
          const { payUrl, shortLink } = momoResponse.data;
          if (payUrl) {
            window.open(payUrl, "_blank");
          } else if (shortLink) {
            window.open(shortLink, "_blank");
          }
        } else {
          toast("Đã xảy ra lỗi khi gọi API MOMO", {
            theme: "auto",
            type: "error",
            dangerouslyHTMLString: true,
          });
        }
      } catch (error) {
        toast("Đã xảy ra lỗi khi gọi API MOMO", {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      }
      break;

    case "ZALOPAY":
      try {
        const zalopayResponse = await orderService.post(
          "/zalopay/createLink",
          orderData,
          token
        );

        if (zalopayResponse.status === 200) {
          const { order_url, order_token } = zalopayResponse.data;
          if (order_url) {
            window.open(order_url, "_blank");
          }
        } else {
          toast("Đã xảy ra lỗi khi gọi API ZALOPAY", {
            theme: "auto",
            type: "error",
            dangerouslyHTMLString: true,
          });
        }
      } catch (error) {
        toast("Đã xảy ra lỗi khi gọi API ZALOPAY", {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      }
      break;
    case "PAYPAL":
      try {
        const paypalResponse = await orderService.post(
          "/paypal/createLink",
          orderData,
          token
        );

        if (paypalResponse.status === 200) {
          const { paypal_url } = paypalResponse.data;
          if (paypal_url) {
            window.open(paypal_url, "_blank");
          }
        } else {
          toast("Đã xảy ra lỗi khi gọi API PAYPAL", {
            theme: "auto",
            type: "error",
            dangerouslyHTMLString: true,
          });
        }
      } catch (error) {
        toast(error.response?.data?.message, {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      }
      break;

    case "COD":
    default:
      await placeOrder(orderData);
      break;
  }
};

// Tạo một phương thức riêng để xử lý đơn hàng
const placeOrder = async (orderData) => {
  try {
    const response = await orderService.post("/", orderData, token);
    if (response.status === 200) {
      toast(response.data.message, {
        theme: "auto",
        type: "success",
        dangerouslyHTMLString: true,
      });
      updateCart.value += 1;
      router.push({ name: "thanks" });
    }
  } catch (error) {
    toast("Đã xảy ra lỗi khi xác nhận đơn hàng", {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
  }
};

onMounted(() => {
  getAddress();
  getBookCheckOut();
});
</script>
<style scoped>
.checkout-bar {
  position: sticky;
  bottom: 0;
  z-index: 1000;
  width: 100%;
}
</style>
