<template>
  <button
    type="button"
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#addReceipt"
  >
    <i class="fa-solid fa-plus"></i> Thêm
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="addReceipt"
    tabindex="-1"
    data-bs-backdrop="static"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addModalLabel">Thêm nhập hàng</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addReceipt">
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
                    v-model="searchBookValue"
                    :class="{
                      'is-invalid':
                        errors.bookName || (searchBookValue !== '' && !bookID),
                      'is-valid':
                        !errors.bookName && newReceipt.detail[0].bookID !== '',
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
                  v-model="bookFormality.name"
                  type="text"
                  name="bookName"
                  id="bookName"
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
                  v-model="newReceipt.detail[0].quantity"
                  type="text"
                  name="quantity"
                  id="quantity"
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
                    'is-valid':
                      !errors.price && newReceipt.detail[0].price !== '',
                  }"
                  v-model="newReceipt.detail[0].price"
                  type="text"
                  name="price"
                  id="price"
                  placeholder="Nhập đơn giá nhập hàng"
                />
                <ErrorMessage name="price" class="invalid-feedback" />
              </div>
            </div>
            <div class="mt-5 d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-secondary me-2"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="submit" class="btn btn-primary col-sm-1">
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ApiAdmin from "@/service/admin/apiAdmin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import { ref, watch } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { addReceiptSchema } from "@/utils/schema.util";
import useDropdown from "@/composables/useDropdown";

export default {
  components: { Form, Field, ErrorMessage },
  emits: ["refreshReceipt"],
  props: {
    supplierID: {
      type: String,
    },
    receiptID: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const apiAdmin = new ApiAdmin();
    const supplierID = ref(props.supplierID);
    const receiptID = ref(props.receiptID);
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
    // Dropdown cho sách
    const {
      searchValue: searchBookValue,
      filteredOptions: bookOptions,
      selected: bookSelectedID,
      selectItem: selectBookID,
      itemID: bookID,
      extraData: bookFormality,
    } = useDropdown("books");

    // Theo dõi sự thay đổi của authorID
    watch(bookID, (newVal) => {
      if (newVal) {
        newReceipt.value.detail[0].bookID = newVal;
        console.log("Sách đã chọn: ", newVal);
      }
    });

    watch(
      () => props.supplierID,
      (newVal) => {
        if (newVal) {
          supplierID.value = newVal;
          newReceipt.value.supplierID = newVal;
        }
      }
    );

    watch(
      () => props.receiptID,
      (newVal) => {
        if (newVal) {
          receiptID.value = newVal;
        }
      }
    );

    const { errors, validate, resetForm } = useForm({
      validationSchema: addReceiptSchema,
    });
    const addReceipt = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      const response = await apiAdmin.put(
        `/receipts/${receiptID.value}`,
        newReceipt.value
      );
      if (response.status === 200) {
        showSuccessToast(response?.data?.message);
        newReceipt.value.supplierID = "";
        newReceipt.value.detail[0].bookID = "";
        bookFormality.value = null;
        resetForm();
        $("#addReceipt").modal("hide");
        emit("refreshReceipt");
      }
    };

    return {
      errors,
      searchBookValue,
      bookOptions,
      bookSelectedID,
      selectBookID,
      bookID,
      bookFormality,
      newReceipt,
      addReceipt,
    };
  },
};
</script>
