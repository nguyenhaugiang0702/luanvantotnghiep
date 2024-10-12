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
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <DataTable
                id="mytable_suppliers"
                :columns="columns"
                :data="suppliers"
                :options="{
                  responsive: false,
                  autoWidth: true,
                  dom: 'lBfrtip',
                  buttons: buttons,
                  language: language,
                }"
                class="display table table-striped table-bordered"
                :scroll="{ x: 576 }"
              >
                <thead>
                  <tr>
                    <th class="text-start">#</th>
                    <th class="text-start">Tên</th>
                    <th class="text-start">Số điện thoại</th>
                    <th class="text-start">Email</th>
                    <th class="text-start">Địa chỉ</th>
                    <th class="text-start">Thao tác</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </a-layout-content>
  </div>
</template>

<script>
import { ref, onMounted, h, defineComponent } from "vue";
import { useMenu } from "../../../stores/use-menu.js";
import DataTable from "datatables.net-vue3";
import DataTableLib from "datatables.net-bs5";
import Buttons from "datatables.net-buttons-bs5";
import ButtonsHtml5 from "datatables.net-buttons/js/buttons.html5";
import print from "datatables.net-buttons/js/buttons.print";
import pdfmake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfmake.vfs = pdfFonts.pdfMake.vfs;
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
import JsZip from "jszip";
window.JsZip = JsZip;
DataTable.use(DataTableLib);
DataTable.use(pdfmake);
DataTable.use(ButtonsHtml5);
import { useRouter } from "vue-router";
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import { showSuccess, showConfirmation } from "@/utils/swalUtils";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

export default defineComponent({
  components: {
    DataTable,
  },
  setup() {
    const router = useRouter();
    const store = useMenu();
    store.onSelectedKeys(["admin-suppliers-list"]);
    const apiAdmin = new ApiAdmin();
    const columns = [
      {
        data: null,
        width: "5%",
        render: (data, type, row, meta) => {
          return `<div class="text-center">${meta.row + 1}</div>`;
        },
      },
      {
        data: "name",
        width: "15%",
        render: (data, type, row, meta) => {
          return `<div class="text-start text-break">${data}</div>`;
        },
      },
      {
        data: "phoneNumber",
        width: "15%",
        render: (data, type, row, meta) => {
          return `<div class="text-start text-break">${data}</div>`;
        },
      },
      {
        data: "email",
        width: "20%",
        render: (data, type, row, meta) => {
          return `<div class="text-start text-break">${data}</div>`;
        },
      },
      {
        data: "address",
        width: "30%",
        render: (data) => {
          return `<div class="text-break text-start">${data}</div>`;
        },
      },
      {
        data: "_id",
        width: "15%",
        render: (data, type, row, meta) => {
          return `<div class="d-flex">
            <div class="me-3">
                <button ref="${data}" id="editSupplier" class="badge text-bg-warning p-2" data-id=${data}>
                    <i class="fa-solid fa-pen"></i> Edit
                </button>
            </div>
            <div class="">
                <button class="badge text-bg-danger p-2" id="deleteSupplier" data-id=${data}>
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>
          </div>`;
        },
      },
    ];
    const suppliers = ref([]);

    const getSuppliers = async () => {
      const response = await apiAdmin.get("/suppliers");
      if (response.status === 200) {
        suppliers.value = response.data;
      }
    };

    const deleteSupplier = async (supplierID) => {
      try {
        const response = await apiAdmin.delete(`/suppliers/${supplierID}`);
        if (response.status == 200) {
          showSuccessToast(response?.data?.message);
          getSuppliers();
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    $(document).on("click", "#editSupplier", async (event) => {
      const supplierID = $(event.currentTarget).data("id");
      router.push({
        name: "admin-suppliers-edit",
        params: { supplierID: supplierID },
      });
    });

    $(document).on("click", "#deleteSupplier", async (event) => {
      const supplierID = $(event.currentTarget).data("id");
      const isConfirmed = await showConfirmation({
        title: "Bạn có chắc chắn muốn xóa nhà cung cấp này?",
      });
      if (isConfirmed.isConfirmed) {
        await deleteSupplier(supplierID);
      }
    });

    onMounted(() => {
      getSuppliers();
    });

    // Bỏ cột thao tác trong bảng
    const exportOptions = {
      columns: ":not(:last-child)",
    };

    const buttons = [
      {
        extend: "copy",
        exportOptions: exportOptions,
      },
      {
        extend: "csv",
        exportOptions: exportOptions,
      },
      {
        extend: "pdf",
        exportOptions: exportOptions,
      },
      {
        extend: "print",
        exportOptions: exportOptions,
      },
    ];
    // Bỏ cột thao tác trong bảng

    const language = {
      search: "_INPUT_",
      searchPlaceholder: "Tìm kiếm...",
      lengthMenu: "Hiển thị _MENU_ hàng",
      paginate: {
        first: "Đầu tiên",
        last: "Cuối cùng",
        next: "Tiếp theo",
        previous: "Trước đó",
      },
      info: "Hiển thị _START_ đến _END_ của _TOTAL_ mục",
    };
    return {
      getSuppliers,
      columns,
      suppliers,
      buttons,
      language,
    };
  },
});
</script>
<style>
@import "datatables.net-bs5";
</style>
