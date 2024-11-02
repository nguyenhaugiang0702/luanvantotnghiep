<template>
  <button
    type="button"
    class="btn btn-primary mb-3"
    data-bs-toggle="modal"
    data-bs-target="#addAdmin"
  >
    <i class="fa-solid fa-plus"></i> Thêm
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="addAdmin"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addModalLabel">Thêm nhân viên</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addAdmin">
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
                        !errors.firstName && newAdmin.firstName !== '',
                    }"
                    id="firstName"
                    placeholder="Họ nhân viên"
                    v-model="newAdmin.firstName"
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
                      'is-valid': !errors.lastName && newAdmin.lastName !== '',
                    }"
                    id="lastName"
                    placeholder="Tên nhân viên"
                    v-model="newAdmin.lastName"
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
                        !errors.phoneNumber && newAdmin.phoneNumber !== '',
                    }"
                    id="phoneNumber"
                    placeholder="Số điện thoại"
                    v-model="newAdmin.phoneNumber"
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
                      'is-valid': !errors.email && newAdmin.email !== '',
                    }"
                    id="email"
                    placeholder="Email"
                    v-model="newAdmin.email"
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
                      'is-valid': !errors.password && newAdmin.password !== '',
                    }"
                    id="password"
                    placeholder="Mật khẩu"
                    v-model="newAdmin.password"
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
                      'is-valid': !errors.role && newAdmin.roleID !== '',
                    }"
                    id="role"
                    placeholder="Vai trò"
                    v-model="newAdmin.roleID"
                    ><option selected value="">Vui lòng chọn quyền</option>
                    <option :value="role._id" v-for="role in roles">
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
import { ref, onMounted } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { addAdminSchema } from "@/utils/schema.util";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

export default {
  components: { Form, Field, ErrorMessage },
  emit: ["refreshEmployee"],
  setup(props, { emit }) {
    const newAdmin = ref({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      roleID: "",
      method: "add"
    });
    const roles = ref([]);
    const getRoles = async () => {
      const response = await apiAdmin.get("/roles");
      if (response.status == 200) {
        roles.value = response.data;
      }
    };
    const { errors, validate, resetForm } = useForm({
      validationSchema: addAdminSchema,
    });
    const apiAdmin = new ApiAdmin();
    const addAdmin = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      try {
        const response = await apiAdmin.post("/admins", newAdmin.value);
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          resetForm();
          $("#addAdmin").modal("hide");
          emit("refreshEmployee");
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    onMounted(() => {
      getRoles();
    });

    return { newAdmin, addAdmin, errors, roles };
  },
};
</script>
