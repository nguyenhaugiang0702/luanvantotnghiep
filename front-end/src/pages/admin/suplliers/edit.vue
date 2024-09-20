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
        <a-breadcrumb-item class="fw-bold">Nhà cung cấp</a-breadcrumb-item>
        <a-breadcrumb-item
          class="fw-bold hoverPointer"
          @click="handleNavigate(router, 'admin-suppliers-list')"
          >Danh sách</a-breadcrumb-item
        >
        <a-breadcrumb-item class="fw-bold">Chỉnh sửa</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <form
          @submit.prevent="updateSupplier"
          :validation-schema="supllierSchema"
        >
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
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import SupplierService from "@/service/supplier.service";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { supllierSchema } from "@/utils/schema.util";
import { toast } from "vue3-toastify";
import { useMenu } from "../../../stores/use-menu.js";
import {handleNavigate} from "@/utils/utils.js"

const supplier = ref({});
const route = useRoute();
const router = useRouter();
const supplierID = route.params.supplierID;
const supplierService = new SupplierService();
const store = useMenu();
store.onSelectedKeys(["admin-suppliers-edit"]);

const { errors, validate, resetForm } = useForm({
  validationSchema: supllierSchema,
});

const getSupplier = async () => {
  const response = await supplierService.get(`/${supplierID}`);
  if (response.status === 200) {
    supplier.value = response.data;
  }
};

const updateSupplier = async () => {
  try {
    const { valid } = await validate();
    if (!valid) {
      return;
    }
    const data = {
      ...supplier.value,
      method: "edit",
    };
    const response = await supplierService.put(`/${supplierID}`, data);
    if (response.status == 200) {
      toast(response.data.message, {
        theme: "auto",
        type: "success",
        dangerouslyHTMLString: true,
      });
    }
  } catch (error) {
    toast(error.response?.data?.message, {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
  }
};

onMounted(() => {
  getSupplier();
});

</script>
<style scoped>
.hoverPointer {
  cursor: pointer;
}
.hoverPointer:hover {
  cursor: pointer;
  color: black;
}
</style>
