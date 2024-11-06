<template>
  <button
    type="button"
    class="btn btn-primary mb-3"
    data-bs-toggle="modal"
    data-bs-target="#addVoucher"
  >
    <i class="fa-solid fa-plus"></i> Thêm
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="addVoucher"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addModalLabel">Thêm mã giảm giá</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addVoucher">
            <div class="row">
              <div class="col-6 form-group">
                <div class="dropdown">
                  <label class="form-label" for="voucherCategoryID"
                    >Loại giảm giá</label
                  >
                  <Field
                    class="form-control dropdown-toggle"
                    type="text"
                    name="voucherCategoryID"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    placeholder="Loại giảm giá"
                    @focus="showDropdown = true"
                    v-model="searchVouchersCategoryValue"
                    :class="{
                      'is-invalid':
                        errors.voucherCategoryID ||
                        (searchVouchersCategoryValue !== '' &&
                          !voucherCategoryID),
                      'is-valid':
                        !errors.voucherCategoryID &&
                        newVoucher.voucherCategoryID !== '',
                    }"
                  />
                  <ul
                    class="dropdown-menu"
                    :class="{
                      'd-none': voucherCategorySelectedID,
                    }"
                    style="max-height: 200px; overflow: auto"
                  >
                    <li
                      style="width: 22rem;max-width: 22rem"
                      class="dropdown-item"
                      v-for="(
                        voucherCategory, index
                      ) in vouchersCategoryOptions"
                      :key="voucherCategory._id"
                      @click="selectVoucherCategoryID(voucherCategory)"
                    >
                      {{ voucherCategory.name }}
                    </li>
                  </ul>
                  <ErrorMessage
                    name="voucherCategoryID"
                    class="invalid-feedback"
                  />
                  <span
                    v-if="
                      !errors.voucherCategoryID &&
                      searchVouchersCategoryValue !== '' &&
                      !voucherCategoryID
                    "
                    style="color: #dc3545; font-size: 0.875em"
                    >Vui lòng chọn loại mã giảm giá</span
                  >
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="quantity" class="form-label">Số lượng</label>
                  <Field
                    name="quantity"
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.quantity,
                      'is-valid':
                        !errors.quantity && newVoucher.quantity !== null,
                    }"
                    placeholder="Số lượng"
                    v-model="newVoucher.quantity"
                  />
                  <ErrorMessage name="quantity" class="invalid-feedback" />
                </div>
              </div>
            </div>
            <div class="row my-3">
              <div class="col-6">
                <div class="form-group">
                  <label for="startDate" class="form-label"
                    >Thòi hạn hiệu lực</label
                  >
                  <Field
                    name="startDate"
                    id="startDate"
                    type="text"
                    class="form-control flatpickr-input input"
                    :class="{
                      'is-invalid': errors.startDate,
                      'is-valid':
                        !errors.startDate && newVoucher.startDate !== '',
                    }"
                    placeholder="Chọn thời hạn hiệu lực"
                    v-model="newVoucher.startDate"
                  />
                  <ErrorMessage name="startDate" class="invalid-feedback" />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="endDate" class="form-label"
                    >Thòi hạn hiệu lực</label
                  >
                  <Field
                    name="endDate"
                    id="endDate"
                    type="text"
                    class="form-control flatpickr-input input"
                    :class="{
                      'is-invalid': errors.endDate,
                      'is-valid': !errors.endDate && newVoucher.endDate !== '',
                    }"
                    placeholder="Chọn thời hạn hiệu lực"
                    v-model="newVoucher.endDate"
                  />
                  <ErrorMessage name="endDate" class="invalid-feedback" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Đóng
              </button>
              <button type="submit" class="btn btn-primary">
                Lưu Thay Đổi
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
import { ref, watch, onMounted } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { voucherSchema } from "@/utils/schema.util";
import moment from "moment";
import useDropdown from "@/composables/useDropdown";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
export default {
  components: { Form, Field, ErrorMessage },
  emit: ["refreshVouchers"],
  setup(props, { emit }) {
    const newVoucher = ref({
      startDate: "",
      endDate: "",
      voucherCategoryID: "",
      quantity: null,
    });
    const { errors, validate, resetForm } = useForm({
      validationSchema: voucherSchema,
    });
    const apiAdmin = new ApiAdmin();
    const addVoucher = async () => {
      const { valid, errors } = await validate();
      if (!valid) {
        return;
      }
      try {
        const response = await apiAdmin.post(
          "/vouchers/voucher",
          newVoucher.value
        );
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          resetForm();
          searchVouchersCategoryValue.value = "";
          $("#addVoucher").modal("hide");
          emit("refreshVouchers");
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    const updateStartDate = (selectedDates) => {
      newVoucher.value.startDate = selectedDates.length
        ? moment(selectedDates[0]).format("DD/MM/YYYY")
        : null;
    };

    const updateEndDate = (selectedDates) => {
      newVoucher.value.endDate = selectedDates.length
        ? moment(selectedDates[0]).format("DD/MM/YYYY")
        : null;
    };

    onMounted(() => {
      flatpickr("#startDate", {
        // altInput: true,
        dateFormat: "d/m/Y",
        // altFormat: "d/m/Y",
        onChange: updateStartDate,
      });

      flatpickr("#endDate", {
        // altInput: true,
        dateFormat: "d/m/Y",
        // altFormat: "d/m/Y",
        onChange: updateEndDate,
      });
    });

    const {
      searchValue: searchVouchersCategoryValue,
      filteredOptions: vouchersCategoryOptions,
      selected: voucherCategorySelectedID,
      selectItem: selectVoucherCategoryID,
      itemID: voucherCategoryID,
    } = useDropdown("vouchersCategory");

    // Theo dõi sự thay đổi của VouchersCategoryID
    watch(voucherCategoryID, (newVal) => {
      if (newVal) {
        newVoucher.value.voucherCategoryID = newVal;
        console.log("Tác giả đã chọn: ", newVal);
      }
    });

    return {
      newVoucher,
      addVoucher,
      errors,
      // VouchersCategory
      searchVouchersCategoryValue,
      vouchersCategoryOptions,
      voucherCategorySelectedID,
      selectVoucherCategoryID,
      voucherCategoryID,
    };
  },
};
</script>
<style scoped>
.input.is-invalid {
  display: block; /* Hiện khi input có class is-invalid */
}
</style>
