<template>
  <div
    class="modal fade"
    id="updateAdmin"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addModalLabel">Cập nhật nhân viên</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateAdmin">
            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label for="firstName" class="form-label">Họ</label>
                  <Field
                    name="firstName"
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.firstName,
                      'is-valid':
                        !errors.firstName && adminToEdit.firstName !== '',
                    }"
                    id="firstName"
                    placeholder="Họ nhân viên"
                    v-model="adminToEdit.firstName"
                  />
                  <ErrorMessage name="firstName" class="invalid-feedback" />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="lastName" class="form-label">Tên</label>
                  <Field
                    name="lastName"
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.lastName,
                      'is-valid':
                        !errors.lastName && adminToEdit.lastName !== '',
                    }"
                    id="lastName"
                    placeholder="Tên nhân viên"
                    v-model="adminToEdit.lastName"
                  />
                  <ErrorMessage name="lastName" class="invalid-feedback" />
                </div>
              </div>
            </div>

            <div class="row mt-3">
              <div class="col-6">
                <div class="form-group">
                  <label for="phoneNumber" class="form-label"
                    >Số điện thoại</label
                  >
                  <Field
                    name="phoneNumber"
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.phoneNumber,
                      'is-valid':
                        !errors.phoneNumber && adminToEdit.phoneNumber !== '',
                    }"
                    id="phoneNumber"
                    placeholder="Số điện thoại"
                    v-model="adminToEdit.phoneNumber"
                  />
                  <ErrorMessage name="phoneNumber" class="invalid-feedback" />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="email" class="form-label">Email</label>
                  <Field
                    name="email"
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.email,
                      'is-valid': !errors.email && adminToEdit.email !== '',
                    }"
                    id="email"
                    placeholder="Email"
                    v-model="adminToEdit.email"
                  />
                  <ErrorMessage name="email" class="invalid-feedback" />
                </div>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-6">
                <div class="form-group">
                  <label for="password" class="form-label">Mật khẩu</label>
                  <Field
                    name="password"
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.password,
                      'is-valid':
                        !errors.password && adminToEdit.password !== '',
                    }"
                    id="password"
                    placeholder="Mật khẩu"
                    v-model="adminToEdit.password"
                  />
                  <ErrorMessage name="password" class="invalid-feedback" />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="role" class="form-label">Vai trò</label>
                  <Field
                    as="select"
                    name="role"
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.role,
                      'is-valid': !errors.role && adminToEdit.role !== '',
                    }"
                    id="role"
                    placeholder="Vai trò"
                    v-model="adminToEdit.roleID"
                  >
                    <option
                      :selected="adminToEdit.roleID === role._id"
                      :value="role._id"
                      v-for="role in roles"
                    >
                      {{ role.name }}
                    </option>
                  </Field>
                  <ErrorMessage name="role" class="invalid-feedback" />
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
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        roleID: "",
        method: "update",
      }),
    },
  },
  setup(props, { emit }) {
    const adminToEdit = ref({ ...props.adminToEdit });

    const { errors, validate, resetForm } = useForm({
      validationSchema: addAdminSchema,
    });
    const apiAdmin = new ApiAdmin();

    const updateAdmin = async () => {
      const { valid, errors } = await validate();
      if (!valid) {
        return;
      }
      try {
        const response = await apiAdmin.put(
          `/admins/${props.adminToEdit._id}`,
          {
            ...adminToEdit.value,
            roleID: adminToEdit.value.roleID,
          }
        );

        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          resetForm();
          $("#updateAdmin").modal("hide");
          emit("refreshEmployee");
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    // Watch prop để cập nhật trạng thái nếu prop thay đổi
    watch(
      () => props.adminToEdit,
      (newValue) => {
        adminToEdit.value = { ...newValue };
        console.log(adminToEdit.value );
      },
      { deep: true }
    );
    const roles = ref([]);
    const getRoles = async () => {
      const response = await apiAdmin.get("/roles");
      if (response.status == 200) {
        roles.value = response.data;
      }
    };

    onMounted(() => {
      getRoles();
    });

    return { adminToEdit, updateAdmin, errors, roles };
  },
};
</script>
