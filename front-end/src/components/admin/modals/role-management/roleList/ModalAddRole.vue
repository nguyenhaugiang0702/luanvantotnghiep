<template>
  <button
    type="button"
    class="btn btn-primary mb-3"
    data-bs-toggle="modal"
    data-bs-target="#addRole"
  >
    <i class="fa-solid fa-plus"></i> Thêm
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="addRole"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addModalLabel">Thêm quyền</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addRole">
            <div class="form-group">
              <label for="name" class="form-label">Tên hình thức</label>
              <Field
                name="name"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.name,
                  'is-valid': !errors.name && newRole.name !== '',
                }"
                id="name"
                placeholder="Tên hình thức"
                v-model="newRole.name"
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
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import { ref } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { roleSchema } from "@/utils/schema.util";
export default {
  components: { Form, Field, ErrorMessage },
  emit: ["refreshRoles"],
  setup(props, { emit }) {
    const newRole = ref({
      name: "",
    });
    const { errors, validate, resetForm } = useForm({
      validationSchema: roleSchema,
    });
    const apiAdmin = new ApiAdmin();
    const addRole = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      try {
        const response = await apiAdmin.post(
          "/roles",
          newRole.value
        );
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          resetForm();
          $("#addRole").modal("hide");
          emit("refreshRoles");
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };
    return { newRole, addRole, errors };
  },
};
</script>
