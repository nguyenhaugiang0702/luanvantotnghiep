<template>
  <div class="container-fluid bg-primary py-4">
    <div class="container text-white">
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-start"
      >
        <div class="d-flex flex-column mb-3 mb-md-0">
          <div class="fw-bold text-uppercase fs-5">Thanh toán</div>
          <div>Hãy kiểm tra cẩn thận trước khi thanh toán</div>
        </div>
        <div class="align-self-md-center">
          <span @click="handleNavigate(router, 'home')">Trang chủ </span>
          <span>/ Thanh toán</span>
        </div>
      </div>
    </div>
  </div>
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
              addr.ward.name +
              ", " +
              addr.district.name +
              ", " +
              addr.province.name +
              " | " +
              addr.phoneNumber
            }}
          </label>
        </div>
      </div>
    </div>

    <!-- <div class="row bg-white mt-4">
      <div class="text-uppercase fw-bold col-md-6 pt-3 ps-3">
        Hình thức giao hàng & Cước phí vận chuyển
      </div>
      <div class="col-md-12"><hr /></div>
      <div class="col-md-12"></div>
    </div> -->

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
              F
              alt=""
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
      <div class="text-uppercase fw-bold pt-3 ps-3">Mã khuyến mãi</div>
      <div class="col-md-12"><hr /></div>
      <div class="row">
        <div class="col-2">Mã khuyến mãi</div>
        <div class="col-4 text-start">
          <input
            readonly
            type="text"
            class="form-control"
            placeholder="Mã khuyễn mãi"
            value="MAGIAM50%"
            v-model="voucher.code"
          />
        </div>
        <div class="col-4">
          <VoucherModal @refreshCart:update="refreshCartMethod" />
        </div>
      </div>
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
          <div class="text-end">
            Phí vận chuyển (Giao hàng tiêu chuẩn):
            <span v-if="isCalculatingFee" class="ms-2">
              <i class="fas fa-spinner fa-spin"></i>
            </span>
          </div>
          <div class="text-end my-1">Tổng giảm giá:</div>
          <div class="text-end fw-bold my-1">Tổng Số Tiền (gồm VAT):</div>
        </div>
        <div class="col-md-2 col-sm-2">
          <div class="text-end">
            {{ formatPrice(selectedBooks.originalTotalPrice) }}
          </div>
          <div class="text-end">
            {{ isCalculatingFee ? "Đang tính..." : formatPrice(shippingFee) }}
          </div>
          <div class="text-end text-success">
            -{{
              isCalculatingFee
                ? "Đang tính..."
                : formatPrice(selectedBooks.discountValue)
            }}
          </div>
          <div class="text-end fs-5 fw-bold text-danger">
            {{
              isCalculatingFee
                ? "Đang tính..."
                : formatPrice(selectedBooks.totalPrice + shippingFee)
            }}
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
              <a href="#">Điều khoản & Điều kiện của nhgbookstore.com</a>
            </label>
          </div>
        </div>
        <div class="col-sm-6 col-md-6 text-end">
          <button
            class="btn btn-primary px-4"
            :disabled="!acceptedTerms || isCalculatingFee || isLoadingPaypal"
            @click="confirmPayment"
          >
            <span
              v-if="isLoadingPaypal"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-else>Xác nhận thanh toán</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed, inject, provide } from "vue";
import Cookies from "js-cookie";
import ApiUser from "@/service/user/apiUser.service";
import config from "@/config";
import { useRouter } from "vue-router";
import { formatPrice, handleNavigate } from "@/utils/utils";
import VoucherModal from "@/components/client/modals/vouchers/VoucherModal.vue";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import { io } from "socket.io-client";

const socket = ref(null);
const apiUser = new ApiUser();
const address = ref([]);
const voucher = ref({
  code: "",
  voucherID: "",
});
const selectedBooks = ref({
  originalTotalPrice: 0,
  totalQuantity: 0,
  totalPrice: 0,
  discountValue: 0,
  books: [],
  bookInCart: [],
});
const updateVoucher = inject("updateVouchers");
const selectedAddress = ref(""); // Địa chỉ giao hàng đã chọn
const paymentMethod = ref("COD"); // Phương thức thanh toán mặc định là COD
const notes = ref(""); // Ghi chú cho người bán
const acceptedTerms = ref(false);
const router = useRouter();
const updateCart = inject("updateCart");
const vouchersEmit = ref([]);
const dataToCalculateShippingFee = ref({
  province: "",
  district: "",
  ward: "",
  address: "",
  weight: null,
});
const shippingFee = ref(0);
const isCalculatingFee = ref(false);
const isLoadingPaypal = ref(false);
let voucherUsed;
const isOrderCompleted = ref(false);

const getAddress = async () => {
  const response = await apiUser.get("/addresses");
  if (response.status === 200) {
    address.value = response.data.addresses;
    const defaultAddress = address.value.find((addr) => addr.isDefault);
    if (defaultAddress) {
      selectedAddress.value = defaultAddress._id;
    }
  }
};

const getBookCheckOut = async () => {
  const response = await apiUser.get("/cart/booksCheckBox");
  if (response.status === 200) {
    selectedBooks.value = response.data;
    dataToCalculateShippingFee.value.weight = response.data.totalWeight;
  }
};

const refreshCartMethod = async (data) => {
  await getBookCheckOut();
  if (data.length > 0) {
    vouchersEmit.value = data;
    voucherUsed = vouchersEmit.value.find((v) => v.isApplied);

    if (voucherUsed) {
      voucher.value.code = voucherUsed.voucherID?.code || "";
      voucher.value.voucherID = voucherUsed.voucherID?._id || "";
    } else {
      voucher.value.code = "";
      voucher.value.voucherID = "";
    }
  }
};

const handleSelectAddress = (addressID) => {
  selectedAddress.value = addressID;
};

const selectedAddressData = computed(() => {
  return address.value.find((addr) => addr._id === selectedAddress.value);
});

const confirmPayment = async () => {
  const orderData = {
    addressID: selectedAddress.value,
    detail: selectedBooks.value.books.map((book) => ({
      bookID: book.bookID._id,
      quantity: book.quantity,
      realPrice: book.price,
    })),
    totalPrice: selectedBooks.value.totalPrice + shippingFee.value,
    shippingFee: shippingFee.value,
    totalQuantity: selectedBooks.value.totalQuantity,
    notes: notes.value,
    discountValue: selectedBooks.value.discountValue,
    discountCode: voucher.value.code,
    voucherID: voucher.value.voucherID || undefined,
    payment: paymentMethod.value,
  };
  switch (paymentMethod.value) {
    case "MOMO":
      try {
        // Gọi API MOMO ở đây
        const momoResponse = await apiUser.post(
          "/payment/momo/createLink",
          orderData
        );

        if (momoResponse.status === 200) {
          const { payUrl, shortLink } = momoResponse.data;
          if (payUrl) {
            window.open(payUrl, "_blank");
          } else if (shortLink) {
            window.open(shortLink, "_blank");
          }
        }
      } catch (error) {
        console.log(error.response?.data?.message);
        showErrorToast(error.response?.data?.message);
      }
      break;

    case "ZALOPAY":
      try {
        const zalopayResponse = await apiUser.post(
          "/payment/zalopay/createLink",
          orderData
        );

        if (zalopayResponse.status === 200) {
          const { order_url, order_token } = zalopayResponse.data;
          if (order_url) {
            window.open(order_url, "_blank");
          }
        }
      } catch (error) {
        console.log(error.response?.data?.message);
        showErrorToast(error.response?.data?.message);
      }
      break;
    case "PAYPAL":
      try {
        isLoadingPaypal.value = true;
        const paypalResponse = await apiUser.post(
          "/payment/paypal/createLink",
          orderData
        );

        if (paypalResponse.status === 200) {
          const { paypal_url } = paypalResponse.data;
          if (paypal_url) {
            console.log(paypal_url);
            window.open(paypal_url, "_blank");
          }
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      } finally {
        isLoadingPaypal.value = false;
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
    const orderDataObj = {
      ...orderData,
      paymentDetail:{
        saleId: null,
        state: null,
        amount: null
      }
    }
    const response = await apiUser.post("/orders", orderDataObj);
    if (response.status === 200) {
      updateCart.value += 1;
      router.push({ name: "thanks" });
    }
  } catch (error) {
    console.log(error);
    showErrorToast(error.response?.data?.message);
  }
};

watch(
  [selectedAddress, () => dataToCalculateShippingFee.value.weight],
  async ([newAddressId, newWeight], [oldAddressId, oldWeight]) => {
    if (isOrderCompleted.value) {
      return;
    }
    if (selectedAddressData.value && dataToCalculateShippingFee.value.weight) {
      const params = {
        province: selectedAddressData.value.province.name,
        district: selectedAddressData.value.district.name,
        ward: selectedAddressData.value.ward.name,
        address: selectedAddressData.value.detailAddress,
        weight: dataToCalculateShippingFee.value.weight,
        value: selectedBooks.value.totalPrice,
      };

      try {
        const fee = await getShippingFee(params);
        shippingFee.value = fee;
      } catch (error) {
        console.error("Error calculating shipping fee:", error);
        showErrorToast("Lỗi khi tính phí vận chuyển");
      }
    }
  }
);

const getShippingFee = async (params) => {
  try {
    isCalculatingFee.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await apiUser.post("/orders/shipping-fee", params);
    return response.data;
  } catch (error) {
    console.error("Error calculating shipping fee:", error);
    shippingFee.value = 0;
  } finally {
    isCalculatingFee.value = false;
  }
};

onMounted(async () => {
  await getAddress();
  await getBookCheckOut();
  socket.value = io("http://localhost:3000");
  await socket.value.on("hasNewVoucherUpdate", async (data) => {
    if (data.vouchers) {
      updateVoucher.value += 1;
      await getBookCheckOut();
    }
  });
  await socket.value.on("hasUpdateCheckout", async (data) => {
    if (data.checkout) {
      isOrderCompleted.value = true;
      shippingFee.value = 0;
      updateVoucher.value += 1;
      await getBookCheckOut();
      await getShippingFee();
    }
  });
  await socket.value.on("hasNewHideBook", async (data) => {
    if (data.book) {  
      updateVoucher.value += 1;
      await getBookCheckOut();
    }
  });
});
</script>
<style scoped>
.checkout-bar {
  position: sticky;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}
</style>
