<template>
  <div>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Nhập hàng</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <div class="row" v-if="totalReceipts === 0">Bạn chưa nhập hàng</div>
        <div v-else class="row">
          <div class="col-12">
            <!-- Table -->
            <div class="table-responsive mt-4">
              <DataTable
                id="datatable"
                :columns="columns"
                :data="receipts"
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
                    <th class="text-start">Ngày nhập hàng</th>
                    <th class="text-start">Email</th>
                    <th class="text-start">Số điện thoại</th>
                    <th class="text-start">Tổng giá nhập</th>
                    <th class="text-start">Nhân viên</th>
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
import { ref, onMounted, defineComponent, computed } from "vue";
//
import DataTable from "datatables.net-vue3";
import DataTableLib from "datatables.net-bs5";
import Buttons from "datatables.net-buttons-bs5";
import ButtonsHtml5 from "datatables.net-buttons/js/buttons.html5";
import print from "datatables.net-buttons/js/buttons.print";
import pdfmake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfmake.vfs = pdfFonts.pdfMake.vfs;
import JsZip from "jszip";
window.JsZip = JsZip;
DataTable.use(DataTableLib);
DataTable.use(pdfmake);
DataTable.use(ButtonsHtml5);
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
import { buttons, language } from "@/utils/datatable";
import { formatPrice } from "@/utils/utils";
//
import ApiAdmin from "../../../service/admin/apiAdmin.service";

import { useRouter } from "vue-router";
import moment from "moment";

export default defineComponent({
  components: {
    DataTable,
  },
  setup() {
    const router = useRouter();
    const apiAdmin = new ApiAdmin();
    const columns = [
      {
        data: null,
        width: "5%",
        render: (data, type, row, meta) =>
          `<div class="text-center">${meta.row + 1}</div>`,
      },
      {
        data: "createdAt",
        width: "15%",
        render: (data, type, row, meta) => {
          return moment(data).format("DD/MM/YYYY HH:mm:ss");
        },
      },
      {
        data: "supplierID.email",
        width: "15%",
        render: (data) =>
          `<div class="text-start text-break">${
            data ? data : "Đang cập nhật"
          }</div>`,
      },
      {
        data: "supplierID.phoneNumber",
        width: "20%",
        render: (data) =>
          `<div class="text-start text-break">${
            data ? data : "Đang cập nhật"
          }</div>`,
      },
      {
        data: "totalPrice",
        width: "20%",
        render: (data) =>
          `<div class="text-start text-break">${
            data ? formatPrice(data) : "Đang cập nhật"
          }</div>`,
      },
      {
        data: null,
        width: "20%",
        render: (data, row) => {
          if (data.adminID != null) {
            return `<div class="text-start text-break">${
              data.adminID.firstName + " " + data.adminID.lastName
            }</div>`;
          }
          return `<div class="text-start text-break">Đang cập nhật</div>`;
        },
      },
      {
        data: "_id",
        width: "15%",
        render: (data) => `
            <div class="row">
              <div class="col-sm-2 me-4 col-md-2">
                <button id="detailReceipt" class="badge text-bg-secondary p-2" data-id=${data}>
                  <i class="fa-solid fa-eye"></i> View
                </button>
              </div>
            </div>`,
      },
    ];
    const receipts = ref([]);

    const getReceipts = async () => {
      const response = await apiAdmin.get("/receipts");
      if (response.status === 200) {
        receipts.value = response.data;
        console.log(receipts.value);
      }
    };

    const totalReceipts = computed(() => receipts.value.length);

    const getItemsBySupplier = (receipt) => {
      return receipts.value.filter(
        (receipt) => receipt.supplierID._id === supplierID
      );
    };

    $(document).on("click", "#detailReceipt", (event) => {
      const receiptID = $(event.currentTarget).data("id");
      router.push({
        name: "admin-receipts-detail",
        params: { receiptID: receiptID },
      });
    });

    onMounted(getReceipts);

    return {
      getReceipts,
      columns,
      receipts,
      buttons,
      language,
      totalReceipts,
      getItemsBySupplier,
    };
  },
});
</script>

<style>
@import "datatables.net-bs5";
</style>
