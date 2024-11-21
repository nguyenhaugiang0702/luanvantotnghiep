<template>
  <button
    type="button"
    class="btn btn-primary mb-3"
    data-bs-toggle="modal"
    data-bs-target="#addPriceRange"
  >
    <i class="fa-solid fa-plus"></i> Thêm
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="addPriceRange"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addModalLabel">Thêm khoản giá</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addPriceRange">
            <div class="form-group">
              <label for="startPrice" class="form-label">Giá bắt đầu</label>
              <Field
                name="startPrice"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.startPrice,
                  'is-valid':
                    !errors.startPrice && newPriceRange.startPrice !== '',
                }"
                id="startPrice"
                placeholder="Giá bắt đầu"
                v-model="newPriceRange.startPrice"
              />
              <ErrorMessage name="startPrice" class="invalid-feedback" />
            </div>
            <div class="form-group mt-3">
              <label for="endPrice" class="form-label">Giá kết thúc</label>
              <Field
                name="endPrice"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.endPrice,
                  'is-valid': !errors.endPrice && newPriceRange.endPrice !== '',
                }"
                id="endPrice"
                placeholder="Giá kết thúc"
                v-model="newPriceRange.endPrice"
              />
              <ErrorMessage name="endPrice" class="invalid-feedback" />
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
import { ref } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { priceRangeSchema } from "@/utils/schema.util";

export default {
  components: { Form, Field, ErrorMessage },
  emit: ["refreshPriceRanges"],
  setup(props, { emit }) {
    const newPriceRange = ref({
      startPrice: "",
      endPrice: "",
    });
    const { errors, validate, resetForm } = useForm({
      validationSchema: priceRangeSchema,
    });
    const apiAdmin = new ApiAdmin();
    const addPriceRange = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      try {
        const response = await apiAdmin.post(
          "/priceranges",
          newPriceRange.value
        );
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          resetForm();
          $("#addPriceRange").modal("hide");
          emit("refreshPriceRanges");
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };
    return { newPriceRange, addPriceRange, errors };
  },
};
</script>
