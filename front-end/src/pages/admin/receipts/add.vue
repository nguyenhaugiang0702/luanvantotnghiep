<template>
  <div>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Nhập hàng</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Thêm</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <!-- Form add product -->
        <form
          @submit.prevent="addProductToReceipt"
          :validation-schema="receiptSchema"
        >
          <div class="row">
            <div class="col-4">
              <div class="form-group">
                <div class="dropdown">
                  <label class="form-label" for="supplierName"
                    >Nhà cung cấp</label
                  >
                  <Field
                    class="form-control dropdown-toggle"
                    type="text"
                    name="supplierName"
                    id="supplierName"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    placeholder="Nhập tên nhà cung cấp"
                    @focus="showDropdown = true"
                    v-model="searchSupplierValue"
                    :class="{
                      'is-invalid':
                        errors.supplierName ||
                        (searchSupplierValue !== '' && !supplierID),
                      'is-valid':
                        !errors.supplierName && newReceipt.supplierID !== '',
                    }"
                  />
                  <ul
                    class="dropdown-menu dropdown-menu-suppliers"
                    v-show="!supplierSelectedID && supplierOptions.length > 0"
                    style="max-height: 200px; overflow: auto"
                  >
                    <li
                      style="width: 38rem; max-width: 38rem"
                      class="dropdown-item"
                      v-for="(supplier, index) in supplierOptions"
                      :key="supplier._id"
                      @click="selectSupplierID(supplier)"
                    >
                      {{ supplier.name }}
                    </li>
                  </ul>
                  <ErrorMessage name="supplierName" class="invalid-feedback" />
                  <span
                    v-if="
                      !errors.supplierName &&
                      searchSupplierValue !== '' &&
                      !supplierID
                    "
                    style="color: #dc3545; font-size: 0.875em"
                    >Vui lòng chọn nhà cung cấp</span
                  >
                </div>
              </div>
            </div>
            <div class="col-8">
              <div class="row form-group">
                <div class="dropdown">
                  <label class="form-label" for="bookName">Tên sản phẩm</label>
                  <Field
                    class="form-control dropdown-toggle"
                    type="text"
                    name="bookName"
                    id="bookName"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    placeholder="Nhập tên sách"
                    @focus="showDropdown = true"
                    v-model="searchBookValue"
                    :class="{
                      'is-invalid':
                        errors.bookName || (searchBookValue !== '' && !bookID),
                      'is-valid':
                        !errors.bookName && newReceipt.detail[0].bookID !== '',
                    }"
                  />
                  <ul
                    class="dropdown-menu dropdown-menu-books"
                    v-show="!bookSelectedID && bookOptions.length !== 0"
                    style="max-height: 200px; overflow: auto"
                  >
                    <li
                      style="width: 38rem; max-width: 38rem"
                      class="dropdown-item"
                      v-for="(book, index) in bookOptions"
                      :key="book._id"
                      @click="selectBookID(book)"
                    >
                      {{ book.name }}
                    </li>
                  </ul>
                  <ErrorMessage name="bookName" class="invalid-feedback" />
                  <span
                    v-if="!errors.bookName && searchBookValue !== '' && !bookID"
                    style="color: #dc3545; font-size: 0.875em"
                    >Vui lòng chọn sách</span
                  >
                </div>
              </div>
              <!-- <div v-if="bookFormality" class="col-6 form-group">
                <label class="form-label" for="bookName">Hình thức</label>
                <input
                  class="form-control"
                  :class="{
                    'is-invalid': errors.bookName,
                    'is-valid': !errors.bookName,
                  }"
                  type="text"
                  name="bookName"
                  id="bookName"
                  v-model="bookFormality.name"
                  readonly
                  placeholder="Hình thức"
                />
              </div> -->
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-4 form-group">
              <label class="form-label" for="">Tổng tiền</label>
              <input
                :value="formatPrice(totalPriceReceipt)"
                type="text"
                class="form-control"
                readonly
              />
            </div>
            <div class="col-8">
              <div class="row">
                <div class="col-6">
                  <label class="form-label" for="quantity">Số lượng</label>
                  <Field
                    class="form-control"
                    :class="{
                      'is-invalid': errors.quantity,
                      'is-valid':
                        !errors.quantity &&
                        newReceipt.detail[0].quantity !== '',
                    }"
                    type="text"
                    name="quantity"
                    id="quantity"
                    v-model="newReceipt.detail[0].quantity"
                    placeholder="Nhập số lượng"
                  />
                  <ErrorMessage name="quantity" class="invalid-feedback" />
                </div>
                <div class="col-6">
                  <label class="form-label" for="price">Đơn giá</label>
                  <Field
                    class="form-control"
                    :class="{
                      'is-invalid': errors.price,
                      'is-valid':
                        !errors.price && newReceipt.detail[0].price !== '',
                    }"
                    type="text"
                    name="price"
                    id="price"
                    v-model="newReceipt.detail[0].price"
                    placeholder="Nhập đơn giá nhập hàng"
                  />
                  <ErrorMessage name="price" class="invalid-feedback" />
                </div>
              </div>
            </div>
          </div>

          <div class="row mt-5 d-flex justify-content-center">
            <button type="submit" class="btn btn-primary col-sm-2">
              Thêm sản phẩm
            </button>
          </div>
        </form>
        <!-- Added Table to Display Added Products -->
        <div v-if="addedProducts.length" class="mt-4">
          <h4>Danh sách sản phẩm đã thêm</h4>
          <table class="table table-bordered">
            <thead class="table-light">
              <tr>
                <th>STT</th>
                <th>Tên sách</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Tổng tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in addedProducts" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ product.bookName }}</td>
                <td>{{ product.quantity }}</td>
                <td>{{ formatPrice(product.price) }}</td>
                <td>{{ formatPrice(product.totalPrice) }}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click="removeProduct(index)"
                  >
                    <i class="fa fa-trash"></i> Xóa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="row">
            <div class="col-3">
              <button
                @click.prevent="addReceipt"
                type="submit"
                class="btn btn-primary"
              >
                Tạo phiếu nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    </a-layout-content>
  </div>
</template>
<script>
import { ref, onMounted, computed, watch } from "vue";
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import {
  Form,
  Field,
  ErrorMessage,
  useForm,
  useValidateField,
} from "vee-validate";
import { receiptSchema, receiptAddproductSchema } from "@/utils/schema.util";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import useDropdown from "@/composables/useDropdown";
import { formatPrice } from "@/utils/utils";
export default {
  components: { Form, Field, ErrorMessage },
  setup() {
    const searchValue = ref("");
    const suppliers = ref([]);
    const showDropdown = ref(false);
    const apiAdmin = new ApiAdmin();
    const addedProducts = ref([]);
    const { errors, validate, resetForm, validateField } = useForm({
      validationSchema: receiptSchema,
    });
    const newReceipt = ref({
      supplierID: "",
      detail: [
        {
          bookID: "",
          quantity: "",
          price: "",
        },
      ],
    });
    const totalPriceReceipt = ref(0);
    // Load nhà cung cấp từ server
    const getSuppliers = async () => {
      const response = await apiAdmin.get("/suppliers");
      if (response.status === 200) {
        suppliers.value = response.data;
      }
    };

    // Update addedProducts
    const updateAddedProducts = (products, newProduct) => {
      let productUpdated = false;
      let totalPriceReceipt = 0;

      // Cập nhật sản phẩm nếu tìm thấy trùng
      const updatedProducts = products.map((product) => {
        if (product.bookID === newProduct.bookID) {
          product.quantity += parseInt(newProduct.quantity);
          product.totalPrice += parseInt(
            newProduct.quantity * newProduct.price
          );
          productUpdated = true;
        }
        totalPriceReceipt += product.totalPrice; // Cộng dồn tổng giá trị
        return product;
      });

      // Nếu không có sản phẩm nào được cập nhật, thêm sản phẩm mới
      if (!productUpdated) {
        updatedProducts.push(newProduct);
        totalPriceReceipt += newProduct.totalPrice; // Cộng giá của sản phẩm mới
      }

      return { updatedProducts, totalPriceReceipt };
    };

    const addProductToReceipt = async () => {
      try {
        let valid;
        valid = await validateField("bookName");
        valid = await validateField("quantity");
        valid = await validateField("price");
        if (!valid.valid) {
          return;
        }
        // Collect product data and add it to the list
        const newProduct = {
          bookID: bookID.value,
          bookName: searchBookValue.value,
          quantity: parseInt(newReceipt.value.detail[0].quantity),
          price: parseInt(newReceipt.value.detail[0].price),
          totalPrice:
            parseInt(newReceipt.value.detail[0].quantity) *
            parseInt(newReceipt.value.detail[0].price),
        };
        // Gọi hàm để cập nhật hoặc thêm sản phẩm mới và tính tổng giá
        const { updatedProducts, totalPriceReceipt: newTotalPrice } =
          updateAddedProducts(addedProducts.value, newProduct);

        // Cập nhật danh sách và tổng giá trị
        addedProducts.value = updatedProducts;
        totalPriceReceipt.value = newTotalPrice;
        resetForm();
        $(".dropdown-menu").removeClass("show");
        newReceipt.value.supplierID = "";
        newReceipt.value.detail[0].bookID = "";
        bookFormality.value = null;
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    const addReceipt = async () => {
      const { valid } = await validateField("supplierName");
      if (!valid) {
        return;
      }
      newReceipt.value.detail = addedProducts.value;
      const response = await apiAdmin.post("/receipts", newReceipt.value);
      if (response.status === 200) {
        showSuccessToast(response?.data?.message);
        newReceipt.value.supplierID = "";
        newReceipt.value.detail[0].bookID = "";
        bookFormality.value = null;
        totalPriceReceipt.value = 0;
        addedProducts.value = [];
        $(".dropdown-menu").removeClass("show");
        resetForm();
      }
    };

    // Function to remove product from the list
    const removeProduct = (index) => {
      if (index >= 0 && index < addedProducts.value.length) {
        totalPriceReceipt.value -= addedProducts.value[index].totalPrice;
        addedProducts.value.splice(index, 1);
      }
    };

    // Dropdown cho nhà cung cấp
    const {
      searchValue: searchSupplierValue,
      filteredOptions: supplierOptions,
      selected: supplierSelectedID,
      selectItem: selectSupplierID,
      itemID: supplierID,
    } = useDropdown("suppliers");

    // Dropdown cho sách
    const {
      searchValue: searchBookValue,
      filteredOptions: bookOptions,
      selected: bookSelectedID,
      selectItem: selectBookID,
      itemID: bookID,
      extraData: bookFormality,
    } = useDropdown("books");

    // Theo dõi sự thay đổi của nhà cung cấp
    watch(supplierID, (newVal) => {
      if (newVal) {
        newReceipt.value.supplierID = newVal;
        console.log("Nhà cung cấp đã chọn: ", newVal);
      }
    });

    // Theo dõi sự thay đổi của authorID
    watch(bookID, (newVal) => {
      if (newVal) {
        newReceipt.value.detail[0].bookID = newVal;
        console.log("Nhà cung cấp đã chọn: ", newVal);
      }
    });

    const clearDropdownSuppliers = (className) => {
      searchSupplierValue.value = "";
      supplierSelectedID.value = "";
      $(`.${className}`).addClass("show");
    };
    const clearDropdownBooks = (className) => {
      searchBookValue.value = "";
      bookSelectedID.value = "";
      $(`.${className}`).addClass("show");
    };

    onMounted(() => {
      getSuppliers();
    });

    return {
      searchValue,
      suppliers,
      errors,
      showDropdown,
      newReceipt,
      receiptSchema,
      addProductToReceipt,
      addReceipt,
      /* suppliers */
      searchSupplierValue,
      supplierOptions,
      supplierSelectedID,
      selectSupplierID,
      supplierID,
      /* books */
      searchBookValue,
      bookOptions,
      bookSelectedID,
      selectBookID,
      bookID,
      bookFormality,
      //
      clearDropdownSuppliers,
      clearDropdownBooks,
      addedProducts,
      formatPrice,
      removeProduct,
      totalPriceReceipt,
      formatPrice,
    };
  },
};
</script>
<style scoped>
@import "../../../assets/css/admin/dropdown/dropdown.css";
</style>
