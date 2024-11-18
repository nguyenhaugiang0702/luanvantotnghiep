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
                  <input
                    name="firstName"
                    type="text"
                    class="form-control"
                    id="firstName"
                    placeholder="Họ nhân viên"
                    v-model="adminToEdit.firstName"
                    readonly
                  />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="lastName" class="form-label">Tên</label>
                  <input
                    name="lastName"
                    type="text"
                    class="form-control"
                    id="lastName"
                    placeholder="Tên nhân viên"
                    v-model="adminToEdit.lastName"
                    readonly
                  />
                </div>
              </div>
            </div>

            <div class="row mt-3">
              <div class="col-6">
                <div class="form-group">
                  <label for="phoneNumber" class="form-label"
                    >Số điện thoại</label
                  >
                  <input
                    name="phoneNumber"
                    type="text"
                    class="form-control"
                    id="phoneNumber"
                    placeholder="Số điện thoại"
                    v-model="adminToEdit.phoneNumber"
                    readonly
                  />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="email" class="form-label">Email</label>
                  <input
                    name="email"
                    type="text"
                    class="form-control"
                    readonly
                    id="email"
                    placeholder="Email"
                    v-model="adminToEdit.email"
                  />
                </div>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-12">
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
                    v-model="adminToEdit.role"
                  >
                    <option
                      :selected="adminToEdit.role === role.name"
                      :value="role.name"
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
import { updateAdminSchema } from "@/utils/schema.util";
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
        side: "admin"
      }),
    },
  },
  setup(props, { emit }) {
    const adminToEdit = ref({ ...props.adminToEdit });
    const isLoading = ref(false);
    const { errors, validate, resetForm } = useForm({
      validationSchema: updateAdminSchema,
    });
    const apiAdmin = new ApiAdmin();

    const updateAdmin = async () => {
      const { valid, errors } = await validate();
      if (!valid) {
        return;
      }
      isLoading.value = true;
      try {
        console.log(adminToEdit.value.role);
        const response = await apiAdmin.put(
          `/admins/${props.adminToEdit._id}`,
          {
            role: adminToEdit.value.role,
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
      } finally {
        isLoading.value = false;
      }
    };

    // Watch prop để cập nhật trạng thái nếu prop thay đổi
    watch(
      () => props.adminToEdit,
      (newValue) => {
        adminToEdit.value = { ...newValue };
        console.log(newValue);
      },
      { deep: true }
    );
    const roles = ref([
      {
        name: "admin",
      },
      {
        name: "sale",
      },
      { name: "shipper" },
    ]);

    return { adminToEdit, updateAdmin, errors, roles, isLoading };
  },
};
</script>
