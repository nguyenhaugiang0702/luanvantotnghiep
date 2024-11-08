<template>
  <div
    class="modal fade"
    id="resetPassword"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addModalLabel">Cấp lại mật khẩu</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="resetPassword">
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <label for="password" class="form-label">Mật khẩu</label>
                  <Field
                    name="password"
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.password,
                      'is-valid': !errors.password && newPassword !== '',
                    }"
                    id="password"
                    placeholder="Mật khẩu"
                    v-model="newPassword"
                  />
                  <ErrorMessage name="password" class="invalid-feedback" />
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
              <button type="submit" class="btn btn-primary col-md-3">
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm text-white"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span class="text-white" v-else> Lưu Thay Đổi </span>
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
import { ref, onMounted, watch } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { addAdminSchema } from "@/utils/schema.util";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

export default {
  components: { Form, Field, ErrorMessage },
  emit: ["refreshEmployee"],
  props: {
    adminToEdit: {
      type: Object,
      default: () => ({
        newPassword: "",
      }),
    },
  },
  setup(props, { emit }) {
    const adminToEdit = ref({ ...props.adminToEdit });
    const newPassword = ref("");
    const isLoading = ref(false);
    const { errors, validate, resetForm, validateField } = useForm({
      validationSchema: addAdminSchema,
    });
    const apiAdmin = new ApiAdmin();

    const resetPassword = async () => {
      const { valid, errors } = await validateField("password");
      if (!valid) {
        return;
      }
      isLoading.value = true;
      try {
        const response = await apiAdmin.put(
          `/admins/resetPassword/${props.adminToEdit._id}`,
          {
            password: newPassword.value,
          }
        );

        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          resetForm();
          $("#resetPassword").modal("hide");
          emit("refreshEmployee");
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      } finally {
        isLoading.value = false;
      }
    };

    // Watch prop để cập nhật trạng thái nếu prop thay đổi
    watch(
      () => props.adminToEdit,
      (newValue) => {
        adminToEdit.value = { ...newValue };
      },
      { deep: true }
    );

    return { resetPassword, errors, newPassword, isLoading };
  },
};
</script>
