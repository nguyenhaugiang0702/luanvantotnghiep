<template>
  <button
    type="button"
    class="btn btn-primary mb-3"
    data-bs-toggle="modal"
    data-bs-target="#addVoucherCategory"
  >
    <i class="fa-solid fa-plus"></i> Thêm
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="addVoucherCategory"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addModalLabel">Thêm thể loại mã giảm giá</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addVoucherCategory">
            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label for="discountType" class="form-label">Loại giảm giá</label>
                  <Field
                    as="select"
                    v-model="newVoucherCategory.discountType"
                    class="form-select"
                    :class="{
                      'is-invalid': errors.discountType,
                      'is-valid':
                        !errors.discountType && newVoucherCategory.discountType !== '',
                    }"
                    name="discountType"
                  >
                    <option :selected="newVoucherCategory.discountType === ''" value="">
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
                      'is-valid': !errors.value && newVoucherCategory.value !== null,
                    }"
                    placeholder="Giá trị"
                    v-model="newVoucherCategory.value"
                  />
                  <ErrorMessage name="value" class="invalid-feedback" />
                </div>
              </div>
            </div>
            <div class="row my-3">
              <div class="col-6">
                <div class="form-group">
                  <label for="minValue" class="form-label">Giá tối thiểu</label>
                  <Field
                    name="minValue"
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.minValue,
                      'is-valid':
                        !errors.minValue && newVoucherCategory.minValue !== null,
                    }"
                    placeholder="Giá tối thiểu"
                    v-model="newVoucherCategory.minValue"
                  />
                  <ErrorMessage name="minValue" class="invalid-feedback" />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="maxValue" class="form-label">Giá giảm tối đa</label>
                  <Field
                    name="maxValue"
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.maxValue,
                      'is-valid':
                        !errors.maxValue && newVoucherCategory.maxValue !== null,
                    }"
                    placeholder="Giá giảm tối đa"
                    v-model="newVoucherCategory.maxValue"
                  />
                  <ErrorMessage name="maxValue" class="invalid-feedback" />
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Đóng
              </button>
              <button type="submit" class="btn btn-primary">Lưu Thay Đổi</button>
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
import { ref } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { voucherCatgorySchema } from "@/utils/schema.util";

export default {
  components: { Form, Field, ErrorMessage },
  emit: ["refreshVouchersCategory"],
  setup(props, { emit }) {
    const newVoucherCategory = ref({
      discountType: "",
      value: null,
      minValue: null,
      maxValue: null,
    });
    const { errors, validate, resetForm } = useForm({
      validationSchema: voucherCatgorySchema,
      initialValues: newVoucherCategory.value,
    });
    const apiAdmin = new ApiAdmin();
    const addVoucherCategory = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      try {
        const response = await apiAdmin.post(
          "/vouchers/voucherCategory",
          newVoucherCategory.value
        );
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          resetForm();
          $("#addVoucherCategory").modal("hide");
          emit("refreshVouchersCategory");
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };
    return { newVoucherCategory, addVoucherCategory, errors };
  },
};
</script>
