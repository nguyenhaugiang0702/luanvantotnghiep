<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="updateVoucherCategory"
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
          <form @submit.prevent="updateVoucherCategory">
            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label for="discountType" class="form-label"
                    >Loại giảm giá</label
                  >
                  <Field
                    as="select"
                    v-model="voucherCategoryToEdit.discountType"
                    class="form-select"
                    :class="{
                      'is-invalid': errors.discountType,
                      'is-valid':
                        !errors.discountType &&
                        voucherCategoryToEdit.discountType !== '',
                    }"
                    name="discountType"
                  >
                    <option
                      :selected="voucherCategoryToEdit.discountType === ''"
                      value=""
                    >
                      Chọn loại giảm giá
                    </option>
                    <option value="percent">Giảm theo phần trăm</option>
                    <option value="amount">Giảm theo giá tiền</option>
                  </Field>
                  <ErrorMessage name="discountType" class="invalid-feedback" />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="value" class="form-label">Giá trị</label>
                  <Field
                    name="value"
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.value,
                      'is-valid':
                        !errors.value && voucherCategoryToEdit.value !== null,
                    }"
                    placeholder="Giá trị"
                    v-model="voucherCategoryToEdit.value"
                  />
                  <ErrorMessage name="value" class="invalid-feedback" />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <div class="form-group my-3">
                  <label for="minValue" class="form-label">Giá tối thiểu</label>
                  <Field
                    name="minValue"
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.minValue,
                      'is-valid':
                        !errors.minValue &&
                        voucherCategoryToEdit.minValue !== null,
                    }"
                    placeholder="Giá giảm từ"
                    v-model="voucherCategoryToEdit.minValue"
                  />
                  <ErrorMessage name="minValue" class="invalid-feedback" />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group my-3">
                  <label for="maxValue" class="form-label"
                    >Giá giảm tối đa</label
                  >
                  <Field
                    name="maxValue"
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.maxValue,
                      'is-valid':
                        !errors.maxValue &&
                        voucherCategoryToEdit.maxValue !== null,
                    }"
                    placeholder="Giá giảm đến"
                    v-model="voucherCategoryToEdit.maxValue"
                  />
                  <ErrorMessage name="maxValue" class="invalid-feedback" />
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
import { ref, watch, defineComponent } from "vue";
import { useForm, Field, ErrorMessage } from "vee-validate";
import { voucherCatgorySchema } from "@/utils/schema.util";
import ApiAdmin from "@/service/admin/apiAdmin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

export default defineComponent({
  components: { Field, ErrorMessage },
  props: {
    voucherCategoryToEdit: {
      type: Object,
      default: () => ({
        discountType: "",
        value: null,
        minValue: null,
        maxValue: null,
      }),
    },
  },
  emits: ["refreshVouchersCategory"],
  setup(props, { emit }) {
    const voucherCategoryToEdit = ref({ ...props.voucherCategoryToEdit });
    console.log(voucherCategoryToEdit.value);

    const { errors, validate, resetForm } = useForm({
      validationSchema: voucherCatgorySchema,
    });

    const apiAdmin = new ApiAdmin();

    const updateVoucherCategory = async () => {
      const { valid, errors } = await validate();
      if (!valid) {
        return;
      }
      try {
        const response = await apiAdmin.put(
          `/vouchers/voucherCategory/${props.voucherCategoryToEdit._id}`,
          voucherCategoryToEdit.value
        );
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          resetForm();
          $("#updateVoucherCategory").modal("hide");
          emit("refreshVouchersCategory");
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    // Watch prop để cập nhật trạng thái nếu prop thay đổi
    watch(
      () => props.voucherCategoryToEdit,
      (newValue) => {
        voucherCategoryToEdit.value = { ...newValue };
      },
      { deep: true }
    );

    // Trả về các thuộc tính và phương thức cần thiết cho template
    return {
      voucherCategoryToEdit,
      errors,
      updateVoucherCategory,
    };
  },
});
</script>
