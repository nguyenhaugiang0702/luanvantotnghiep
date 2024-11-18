<template>
  <div class="container mt-5">
    <div class="card shadow-lg">
      <div class="card-header bg-primary text-white">
        <h3><i class="fas fa-user-edit"></i> Thông tin cá nhân</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="firstName" class="form-label">Họ</label>
            <Field
              type="text"
              v-model="admin.firstName"
              :class="{
                'is-invalid': errors.firstName,
                'is-valid': !errors.firstName && admin.firstName !== '',
              }"
              name="firstName"
              class="form-control"
              placeholder="Nhập họ"
            />
            <ErrorMessage name="firstName" class="invalid-feedback" />
          </div>
          <div class="mb-3">
            <label for="lastName" class="form-label">Tên</label>
            <Field
              type="text"
              v-model="admin.lastName"
              :class="{
                'is-invalid': errors.lastName,
                'is-valid': !errors.lastName && admin.lastName !== '',
              }"
              name="lastName"
              class="form-control"
              placeholder="Nhập tên"
            />
            <ErrorMessage class="invalid-feedback" name="lastName" />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <Field
              type="email"
              v-model="admin.email"
              :class="{
                'is-invalid': errors.email,
                'is-valid': !errors.email && admin.email !== '',
              }"
              name="email"
              class="form-control"
              placeholder="Nhập email"
            />
            <ErrorMessage class="invalid-feedback" name="email" />
          </div>
          <div class="mb-3">
            <label for="phoneNumber" class="form-label">Số điện thoại</label>
            <Field
              type="tel"
              v-model="admin.phoneNumber"
              :class="{
                'is-invalid': errors.phoneNumber,
                'is-valid': !errors.phoneNumber && admin.phoneNumber !== '',
              }"
              name="phoneNumber"
              class="form-control"
              placeholder="Nhập số điện thoại"
            />
            <ErrorMessage class="invalid-feedback" name="phoneNumber" />
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
import { updateEmployeeSchema } from "@/utils/schema.util";
import ApiAdminService from "@/service/admin/apiAdmin.service";
import { showErrorToast, showSuccessToast } from "@/utils/toast.util";

const admin = ref({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
});
const apiAdmin = new ApiAdminService();

const { errors, validate } = useForm({
  validationSchema: updateEmployeeSchema,
});

const getAdmin = async () => {
  const response = await apiAdmin.get("/admins/infoAdmin");
  if (response.status === 200) {
    admin.value = response.data;
  }
};
onMounted(() => {
  getAdmin();
});

const handleSubmit = async () => {
  const { valid } = await validate();
  if (!valid) {
    return;
  }

  try {
    const response = await apiAdmin.put(`/admins/${admin.value._id}`, {
      method: "update",
      side: "employee",
      role: admin.value.role,
      ...admin.value,
    });
    if (response.status === 200) {
      showSuccessToast("Cập nhật thành công");
      getAdmin();
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
