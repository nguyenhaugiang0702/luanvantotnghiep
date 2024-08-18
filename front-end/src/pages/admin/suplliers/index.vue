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
                  response: true,
                  autoWidth: true,
                  dom: 'Bfrtip',
                  buttons: buttons,
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
import JsZip from "jszip";
window.JsZip = JsZip;
DataTable.use(DataTableLib);
DataTable.use(pdfmake);
DataTable.use(ButtonsHtml5);
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import SupplierService from "@/service/supplier.service.js";
import { showSuccess, showConfirmation } from "@/utils/swalUtils";
export default defineComponent({
  components: {
    DataTable,
  },
  setup() {
    const router = useRouter();
    const store = useMenu();
    store.onSelectedKeys(["admin-suppliers-list"]);
    const supplierService = new SupplierService();
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
          return `<div class="row">
            <div class="col-sm-2 me-4 col-md-2">
                <button ref="${data}" class="btn btn-primary" data-id=${data}>
                    <i class="fa-solid fa-pen"></i>
                </button>
            </div>
            <div class="col-sm-2 col-md-2">
                <button class="btn btn-danger" data-id=${data}>
                    <i class="fa-solid fa-trash"></i>
                </button>    
            </div>
          </div>`;
        },
      },
    ];
    const suppliers = ref([]);

    const getSuppliers = async () => {
      const response = await supplierService.get("/");
      if (response.status === 200) {
        suppliers.value = response.data.suppliers;
      }
    };

    // const deletuser = async (userID) => {
    //   const token = Cookies.get("accessToken");
    //   const response = await api.delete(`/users/${userID}`, token);
    //   if (response.status == 200) {
    //     await showSuccess({
    //       text: "Dữ liệu đã được xóa thành công.",
    //     });
    //     getUsers();
    //   }
    // };

    // const blockUser = async (userID) => {
    //   const token = Cookies.get("accessToken");
    //   const response = await api.put(`/users/blockAccount/${userID}`, token);
    //   if (response.status == 200) {
    //     await showSuccess({
    //       text: "Người dùng đã bị khóa",
    //     });
    //     getUsers();
    //   }
    // };

    // const unBlockUser = async (userID) => {
    //   const token = Cookies.get("accessToken");
    //   const response = await api.put(`/users/unBlockAccount/${userID}`, token);
    //   if (response.status == 200) {
    //     await showSuccess({
    //       text: "Người dùng đã được mở khóa",
    //     });
    //     getUsers();
    //   }
    // };

    // $(document).on("click", "#deletuser", async (event) => {
    //   const userId = $(event.currentTarget).data("id");
    //   await showConfirmation({
    //     text: "Người dùng này sẽ bị xóa!",
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       deletuser(userId);
    //     }
    //   });
    // });

    // $(document).on("click", "#blockuser", async (event) => {
    //   const userId = $(event.currentTarget).data("id");
    //   await showConfirmation({
    //     text: "Người dùng này sẽ bị khóa !",
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       blockUser(userId);
    //     }
    //   });
    // });

    // $(document).on("click", "#unblockuser", async (event) => {
    //   const userId = $(event.currentTarget).data("id");
    //   await showConfirmation({
    //     text: "Người dùng này sẽ đuợc mở khóa !",
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       unBlockUser(userId);
    //     }
    //   });
    // });

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

    return {
      getSuppliers,
      columns,
      suppliers,
      buttons,
    };
  },
});
</script>
<style>
@import "datatables.net-bs5";
</style>
