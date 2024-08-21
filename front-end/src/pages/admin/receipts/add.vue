<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý nhập hàng
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Nhập hàng</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Thêm</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <form @submit.prevent="addReceipt" :validation-schema="receiptSchema">
          <div class="row">
            <div class="form-group col-sm-6">
              <label class="form-label" for="supplierName"
                >Tên nhà cung cấp</label
              >
              <Field
                class="form-control"
                :class="{
                  'is-invalid': errors.supplierName,
                  'is-valid': !errors.supplierName && searchValue !== '',
                }"
                type="text"
                name="supplierName"
                id="supplierName"
                v-model="searchValue"
                @focus="showDropdown = true"
                placeholder="Nhập tên nhà cung cấp"
              />
              <div
                class="certain-category-search-dropdown"
                v-if="showDropdown && filteredSuppliers.length"
              >
                <ul class="list-group">
                  <li
                    class="list-group-item"
                    v-for="(supplier, index) in filteredSuppliers"
                    :key="supplier._id"
                    @click="selectSupplier(supplier)"
                  >
                    {{ supplier.name }}
                  </li>
                </ul>
              </div>
              <ErrorMessage name="supplierName" class="invalid-feedback" />
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-sm-4 form-group">
              <label class="form-label" for="bookName">Sản phẩm</label>
              <Field
                class="form-control"
                :class="{
                  'is-invalid': errors.bookName,
                  'is-valid': !errors.bookName && newReceipt.bookName !== '',
                }"
                type="text"
                name="bookName"
                id="bookName"
                v-model="newReceipt.bookName"
                placeholder="Nhập tên nhà cung cấp"
              />
              <ErrorMessage name="bookName" class="invalid-feedback" />

            </div>
          </div>
          <div class="row mt-4">
            <div class="col-sm-6">
              <label class="form-label" for="quantity">Số lượng</label>
              <Field
                class="form-control"
                :class="{
                  'is-invalid': errors.quantity,
                  'is-valid': !errors.quantity && newReceipt.detail.quantity !== '',
                }"
                type="text"
                name="quantity"
                id="quantity"
                v-model="newReceipt.detail.quantity"
                placeholder="Nhập tên nhà cung cấp"
              />
              <ErrorMessage name="quantity" class="invalid-feedback" />

            </div>
            <div class="col-sm-6">
              <label class="form-label" for="price">Đơn giá</label>
              <Field
                class="form-control"
                :class="{
                  'is-invalid': errors.price,
                  'is-valid': !errors.price && newReceipt.detail.price !== '',
                }"
                type="text"
                name="price"
                id="price"
                v-model="newReceipt.detail.price"
                placeholder="Nhập tên nhà cung cấp"
              />
              <ErrorMessage name="price" class="invalid-feedback" />
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
import { ref, onMounted, computed } from "vue";
import ReceiptService from "@/service/receipt.service";
import SupplierService from "@/service/supplier.service";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { receiptSchema } from "@/utils/schema.util";
import { toast } from "vue3-toastify";

export default {
  components: { Form, Field, ErrorMessage },
  setup() {
    const searchValue = ref("");
    const suppliers = ref([]);
    const showDropdown = ref(false);
    const supplierService = new SupplierService();
    const receiptService = new ReceiptService();
    const { errors, validate, resetForm } = useForm({
      validationSchema: receiptSchema,
    });
    const newReceipt = ref({
      supplierID: "",
      bookName: "",
      detail: {
        quantity: "",
        price: "",
      },
    });

    // Load nhà cung cấp từ server
    const getSuppliers = async () => {
      const response = await supplierService.get("/");
      if (response.status === 200) {
        suppliers.value = response.data;
      }
    };

    const addReceipt = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      const response = await receiptService.post("/", newReceipt.value);
      if (response.status === 200) {
        toast(response.data.message, {
          theme: "auto",
          type: "success",
          dangerouslyHTMLString: true,
        });
        resetForm();
      }
    };

    onMounted(() => {
      getSuppliers();
    });

    // Lọc và giới hạn danh sách nhà cung cấp hiển thị
    const filteredSuppliers = computed(() => {
      return suppliers.value.filter((supplier) =>
        supplier.name.toLowerCase().includes(searchValue.value.toLowerCase())
      );
    });

    const selectSupplier = (supplier) => {
      searchValue.value = supplier.name;
      newReceipt.value.supplierID = supplier._id;
      showDropdown.value = false; // Ẩn danh sách sau khi chọn
    };

    return {
      searchValue,
      suppliers,
      errors,
      filteredSuppliers,
      selectSupplier,
      showDropdown,
      newReceipt,
      receiptSchema,
      addReceipt,
    };
  },
};
</script>

<style scoped>
.certain-category-search-dropdown {
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
