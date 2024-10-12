<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý nhà xuất bản
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Nhà xuất bản</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Thêm</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <form
          @submit.prevent="addPublisher"
          :validation-schema="publisherSchema"
        >
          <div class="row">
            <div class="form-group col-sm-6">
              <label class="form-label" for="name">Tên nhà xuất bản</label>
              <Field
                class="form-control"
                :class="{
                  'is-invalid': errors.name,
                  'is-valid': !errors.name && publisher.name !== '',
                }"
                type="text"
                name="name"
                id="name"
                placeholder="Nhập tên nhà cung cấp"
                v-model="publisher.name"
              />
              <ErrorMessage name="name" class="invalid-feedback" />
            </div>
            <div class="form-group col-sm-6">
              <label class="form-label" for="email">Địa chỉ email</label>
              <Field
                class="form-control"
                :class="{
                  'is-invalid': errors.email,
                  'is-valid': !errors.email && publisher.email !== '',
                }"
                type="text"
                name="email"
                id="email"
                placeholder="Nhập địa chỉ email"
                v-model="publisher.email"
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
                  'is-valid': !errors.address && publisher.address !== '',
                }"
                type="text"
                name="address"
                id="address"
                placeholder="Nhập địa chỉ"
                v-model="publisher.address"
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
                    !errors.phoneNumber && publisher.phoneNumber !== '',
                }"
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Nhập số điện thoại"
                v-model="publisher.phoneNumber"
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
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { publisherSchema } from "@/utils/schema.util";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import { useMenu } from "../../../stores/use-menu.js";

export default {
  components: { Form, Field, ErrorMessage },
  setup() {
    const publisher = ref({
      name: "",
      email: "",
      address: "",
      phoneNumber: "",
      method: "add",
    });
    const store = useMenu();
    store.onSelectedKeys(["admin-publishers-add"]);

    const apiAdmin = new ApiAdmin();
    const { errors, validate, resetForm } = useForm({
      validationSchema: publisherSchema,
    });

    const addPublisher = async () => {
      try {
        const { valid } = await validate();
        if (!valid) {
          return;
        }
        const response = await apiAdmin.post("/publishers", publisher.value);
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          resetForm();
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    return { publisher, addPublisher, publisherSchema, errors };
  },
};
</script>
