<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý nhà cung cấp
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Nhà cung cấp</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Thêm</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <form @submit.prevent="addSupplier" :validation-schema="supllierSchema">
          <div class="row">
            <div class="form-group col-sm-6">
              <label class="form-label" for="name">Tên nhà cung cấp</label>
              <Field
                class="form-control"
                :class="{
                  'is-invalid': errors.name,
                  'is-valid': !errors.name && supplier.name !== '',
                }"
                type="text"
                name="name"
                id="name"
                placeholder="Nhập tên nhà cung cấp"
                v-model="supplier.name"
              />
              <ErrorMessage name="name" class="invalid-feedback" />
            </div>
            <div class="form-group col-sm-6">
              <label class="form-label" for="email">Địa chỉ email</label>
              <Field
                class="form-control"
                :class="{
                  'is-invalid': errors.email,
                  'is-valid': !errors.email && supplier.email !== '',
                }"
                type="text"
                name="email"
                id="email"
                placeholder="Nhập địa chỉ email"
                v-model="supplier.email"
              />
              <ErrorMessage name="email" class="invalid-feedback" />
            </div>
          </div>
          <div class="row mt-4">
            <div class="form-group col-sm-6">
              <label class="form-label" for="address">Địa chỉ</label>
              <Field
                class="form-control"
                :class="{
                  'is-invalid': errors.address,
                  'is-valid': !errors.address && supplier.address !== '',
                }"
                type="text"
                name="address"
                id="address"
                placeholder="Nhập địa chỉ"
                v-model="supplier.address"
              />
              <ErrorMessage name="address" class="invalid-feedback" />
            </div>
            <div class="form-group col-sm-6">
              <label class="form-label" for="phoneNumber">Số điện thoại</label>
              <Field
                class="form-control"
                :class="{
                  'is-invalid': errors.phoneNumber,
                  'is-valid':
                    !errors.phoneNumber && supplier.phoneNumber !== '',
                }"
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Nhập số điện thoại"
                v-model="supplier.phoneNumber"
              />
              <ErrorMessage name="phoneNumber" class="invalid-feedback" />
            </div>
          </div>
          <div class="row mt-5 d-flex justify-content-center">
            <button type="submit" class="btn btn-primary col-sm-1">Lưu</button>
          </div>
        </form>
      </div>
    </a-layout-content>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { supllierSchema } from "@/utils/schema.util";
import { toast } from "vue3-toastify";
import { useMenu } from "../../../stores/use-menu.js";

export default {
  components: { Form, Field, ErrorMessage },
  setup() {
    const supplier = ref({
      name: "",
      email: "",
      address: "",
      phoneNumber: "",
      method: "add",
    });
    const store = useMenu();
    store.onSelectedKeys(["admin-suppliers-add"]);

    const apiAdmin = new ApiAdmin();
    const { errors, validate, resetForm } = useForm({
      validationSchema: supllierSchema,
    });

    const addSupplier = async () => {
      try {
        const { valid } = await validate();
        if (!valid) {
          return;
        }
        const response = await apiAdmin.post("/suppliers", supplier.value);
        if (response.status == 200) {
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
          resetForm();
        }
      } catch (error) {
        toast(error.response?.data?.message, {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      }
    };

    return { supplier, addSupplier, supllierSchema, errors };
  },
};
</script>
