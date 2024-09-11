<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý nhập hàng
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Nhập hàng</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Thêm</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <form @submit.prevent="addReceipt" :validation-schema="receiptSchema">
          <div class="row">
            <div class="form-group col-sm-6">
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
                  class="dropdown-menu"
                  :class="{
                    'd-none': supplierSelectedID,
                  }"
                  style="max-height: 200px; overflow: auto"
                >
                  <li
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
          <div class="row mt-4">
            <div class="col-sm-6 form-group">
              <div class="dropdown">
                <label class="form-label" for="bookName">Sản phẩm</label>
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
                    'is-valid': !errors.bookName && newReceipt.detail[0].bookID !== '',
                  }"
                />
                <ul
                  class="dropdown-menu"
                  :class="{
                    'd-none': bookSelectedID,
                  }"
                  style="max-height: 200px; overflow: auto"
                >
                  <li
                    style="max-width: 300px"
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
            <div v-if="bookFormality" class="col-sm-6 form-group">
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
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-sm-6">
              <label class="form-label" for="quantity">Số lượng</label>
              <Field
                class="form-control"
                :class="{
                  'is-invalid': errors.quantity,
                  'is-valid':
                    !errors.quantity && newReceipt.detail[0].quantity !== '',
                }"
                type="text"
                name="quantity"
                id="quantity"
                v-model="newReceipt.detail[0].quantity"
                placeholder="Nhập số lượng"
              />
              <ErrorMessage name="quantity" class="invalid-feedback" />
            </div>
            <div class="col-sm-6">
              <label class="form-label" for="price">Đơn giá</label>
              <Field
                class="form-control"
                :class="{
                  'is-invalid': errors.price,
                  'is-valid': !errors.price && newReceipt.detail[0].price !== '',
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
          <div class="row mt-5 d-flex justify-content-center">
            <button type="submit" class="btn btn-primary col-sm-1">Lưu</button>
          </div>
        </form>
      </div>
    </a-layout-content>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import ReceiptService from "@/service/receipt.service";
import SupplierService from "@/service/supplier.service";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { receiptSchema } from "@/utils/schema.util";
import { toast } from "vue3-toastify";
import useDropdown from "@/composables/useDropdown";
import { formatPrice } from "@/utils/utils";
export default {
  components: { Form, Field, ErrorMessage },
  setup() {
    const searchValue = ref("");
    const suppliers = ref([]);
    const showDropdown = ref(false);
    const supplierService = new SupplierService();
    const receiptService = new ReceiptService();
    const { errors, validate, resetForm } = useForm({
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

    // Load nhà cung cấp từ server
    const getSuppliers = async () => {
      const response = await supplierService.get("/");
      if (response.status === 200) {
        suppliers.value = response.data;
      }
    };

    const addReceipt = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      const response = await receiptService.post("/", newReceipt.value);
      if (response.status === 200) {
        toast(response.data.message, {
          theme: "auto",
          type: "success",
          dangerouslyHTMLString: true,
        });
        newReceipt.value.supplierID = "";
        newReceipt.value.detail[0].bookID = "";
        bookFormality.value = null;
        resetForm();
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
    };
  },
};
</script>
