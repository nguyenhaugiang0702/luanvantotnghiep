<template>
  <button
    type="button"
    class="btn btn-primary mb-3"
    data-bs-toggle="modal"
    data-bs-target="#addCategory"
  >
    <i class="fa-solid fa-plus"></i> Thêm
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="addCategory"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addModalLabel">Thêm danh mục</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addCategory">
            <div class="form-group">
              <label for="name" class="form-label">Tên danh mục</label>
              <Field
                name="name"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.name,
                  'is-valid': !errors.name && newCategory.name !== '',
                }"
                id="name"
                placeholder="Tên danh mục"
                v-model="newCategory.name"
              />
              <ErrorMessage name="name" class="invalid-feedback" />
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
import { toast } from "vue3-toastify";
import { ref } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { categorySchema } from "@/utils/schema.util";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

export default {
  components: { Form, Field, ErrorMessage },
  emit: ["refreshCategories"],
  setup(props, { emit }) {
    const newCategory = ref({
      name: "",
    });
    const { errors, validate, resetForm } = useForm({
      validationSchema: categorySchema,
    });
    const apiAdmin = new ApiAdmin();
    const addCategory = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      try {
        const response = await apiAdmin.post("/categories", newCategory.value);
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          resetForm();
          $("#addCategory").modal("hide");
          emit("refreshCategories");
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };
    return { newCategory, addCategory, errors };
  },
};
</script>
