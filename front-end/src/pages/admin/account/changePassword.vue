<template>
  <div class="container mt-5">
    <div class="card shadow-lg">
      <div class="card-header bg-primary text-white">
        <h3><i class="fas fa-user-edit"></i> Đổi mật khẩu</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="currentPassword" class="form-label"
              >Mật khẩu hiện tại</label
            >
            <Field
              type="password"
              v-model="admin.currentPassword"
              :class="{
                'is-invalid': errors.currentPassword,
                'is-valid':
                  !errors.currentPassword && admin.currentPassword !== '',
              }"
              name="currentPassword"
              class="form-control"
              placeholder="Nhập mật khẩu hiện tại"
            />
            <ErrorMessage name="currentPassword" class="invalid-feedback" />
          </div>
          <div class="mb-3">
            <label for="newPassword" class="form-label">Mật khẩu mới</label>
            <Field
              type="password"
              v-model="admin.newPassword"
              :class="{
                'is-invalid': errors.newPassword,
                'is-valid': !errors.newPassword && admin.newPassword !== '',
              }"
              name="newPassword"
              class="form-control"
              placeholder="Nhập mật khẩu mới"
            />
            <ErrorMessage class="invalid-feedback" name="newPassword" />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Nhập lại mật khẩu mới</label>
            <Field
              type="password"
              v-model="admin.cfNewPassword"
              :class="{
                'is-invalid': errors.cfNewPassword,
                'is-valid': !errors.cfNewPassword && admin.cfNewPassword !== '',
              }"
              name="cfNewPassword"
              class="form-control"
              placeholder="Nhập lại mật khẩu mới"
            />
            <ErrorMessage class="invalid-feedback" name="cfNewPassword" />
          </div>

          <button type="submit" class="btn btn-primary w-100">
            <i class="fas fa-save"></i> Lưu
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { changePasswordSchema } from "@/utils/schema.util";
import ApiAdminService from "@/service/admin/apiAdmin.service";
import { showErrorToast, showSuccessToast } from "@/utils/toast.util";

const admin = ref({
  currentPassword: "",
  newPassword: "",
  cfNewPassword: "",
});
const apiAdmin = new ApiAdminService();

const { errors, validate, resetForm } = useForm({
  validationSchema: changePasswordSchema,
});

const handleSubmit = async () => {
  const { valid } = await validate();
  if (!valid) {
    return;
  }

  try {
    const response = await apiAdmin.put("/auth/changePassword", admin.value);
    if (response.status === 200) {
      showSuccessToast("Đổi mật khẩu thành công");
      resetForm();
    }
  } catch (error) {
    console.log(error);
    showErrorToast(error.response?.data?.message);
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

button {
  font-size: 18px;
}
</style>
