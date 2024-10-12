<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="updateVoucher"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Chỉnh sửa thể loại mã giảm giá
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateVoucher">
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
                        voucherToEdit.voucherCategoryID !== '',
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
                      style="max-width: 300px"
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
                        !errors.quantity && voucherToEdit.quantity !== null,
                    }"
                    placeholder="Số lượng"
                    v-model="voucherToEdit.quantity"
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
                    id="startDateUpdate"
                    type="text"
                    class="form-control flatpickr-input input"
                    :class="{
                      'is-invalid': errors.startDate,
                      'is-valid':
                        !errors.startDate && voucherToEdit.startDate !== '',
                    }"
                    placeholder="Chọn thời hạn hiệu lực"
                    v-model="voucherToEdit.startDate"
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
                    id="endDateUpdate"
                    type="text"
                    class="form-control flatpickr-input input"
                    :class="{
                      'is-invalid': errors.endDate,
                      'is-valid':
                        !errors.endDate && voucherToEdit.endDate !== '',
                    }"
                    placeholder="Chọn thời hạn hiệu lực"
                    v-model="voucherToEdit.endDate"
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
import { ref, watch, defineComponent, onMounted } from "vue";
import { useForm, Form, Field, ErrorMessage } from "vee-validate";
import { voucherSchema } from "@/utils/schema.util";
import ApiAdmin from "@/service/admin/apiAdmin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import moment from "moment";
import useDropdown from "@/composables/useDropdown";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
export default defineComponent({
  components: { Field, ErrorMessage, Form },
  props: {
    voucherToEdit: {
      type: Object,
      default: () => ({
        startDate: "",
        endDate: "",
        voucherCategoryID: "",
        quantity: null,
      }),
    },
  },
  emits: ["refreshVouchersCategory"],
  setup(props, { emit }) {
    const voucherToEdit = ref({ ...props.voucherToEdit });

    const { errors, validate, resetForm } = useForm({
      validationSchema: voucherSchema,
    });

    const apiAdmin = new ApiAdmin();

    const updateVoucher = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      try {
        const data = {
          startDate: voucherToEdit.value.startDate,
          endDate: voucherToEdit.value.endDate,
          voucherCategoryID: voucherToEdit.value.voucherCategoryID,
          quantity: voucherToEdit.value.quantity,
        };

        const response = await apiAdmin.put(
          `/vouchers/voucher/${props.voucherToEdit._id}`,
          data
        );
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          resetForm();
          $("#updateVoucher").modal("hide");
          emit("refreshVouchersCategory");
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    const updateStartDate = (selectedDates) => {
      voucherToEdit.value.startDate = selectedDates.length
        ? moment(selectedDates[0]).format("DD/MM/YYYY")
        : null;
    };

    const updateEndDate = (selectedDates) => {
      voucherToEdit.value.endDate = selectedDates.length
        ? moment(selectedDates[0]).format("DD/MM/YYYY")
        : null;
    };

    onMounted(() => {
      flatpickr("#startDateUpdate", {
        dateFormat: "d/m/Y",
        onChange: updateStartDate,
      });

      flatpickr("#endDateUpdate", {
        dateFormat: "d/m/Y",
        onChange: updateEndDate,
      });
    });

    // Watch prop để cập nhật trạng thái nếu prop thay đổi
    watch(
      () => props.voucherToEdit,
      (newValue) => {
        voucherToEdit.value = { ...newValue };
        const { startDate, endDate, voucherCategoryID } = voucherToEdit.value;
        searchVouchersCategoryValue.value = voucherCategoryID.name;
        voucherToEdit.value.startDate = moment(startDate).format("DD/MM/YYYY");
        voucherToEdit.value.endDate = moment(endDate).format("DD/MM/YYYY");
      },
      { deep: true }
    );

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
        voucherToEdit.value.voucherCategoryID = newVal;
      }
    });

    // Trả về các thuộc tính và phương thức cần thiết cho template
    return {
      voucherToEdit,
      errors,
      updateVoucher,
      // VouchersCategory
      searchVouchersCategoryValue,
      vouchersCategoryOptions,
      voucherCategorySelectedID,
      selectVoucherCategoryID,
      voucherCategoryID,
    };
  },
});
</script>
