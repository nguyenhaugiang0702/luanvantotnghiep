<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý danh sách tồn kho
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Tồn kho</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <div class="row">
          <div class="col-12">
            <!-- Table -->
            <div class="table-responsive mt-4">
              <DataTable
                id="my-datatable"
                :columns="columns"
                :data="stockProducts"
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
                    <th class="text-start">Sản phẩm</th>
                    <th class="text-start">Danh mục</th>
                    <th class="text-start">Nhà xuất bản</th>
                    <th class="text-start">Hình thức</th>
                    <th class="text-start">Số lượng tồn</th>
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

<script setup>
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
//
import PublisherService from "@/service/publisher.service.js";
import ReceiptService from "@/service/receipt.service.js";
import BookService from "@/service/book.service";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import moment from "moment";

const router = useRouter();
const publisherService = new PublisherService();
const receiptService = new ReceiptService();
const bookService = new BookService();
const columns = [
  {
    data: null,
    width: "5%",
    render: (data, type, row, meta) =>
      `<div class="text-start">${meta.row + 1}</div>`,
  },
  {
    data: "name",
    width: "40%",
    render: (data) => `<div class="text-start text-break">${data}</div>`,
  },
  {
    data: "categoryID.name",
    width: "15%",
    render: (data) => `<div class="text-start text-break">${data}</div>`,
  },
  {
    data: "publisherID.name",
    width: "15%",
    render: (data) => `<div class="text-start text-break">${data}</div>`,
  },
  {
    data: "formalityID.name",
    width: "10%",
    render: (data) => `<div class="text-start text-break">${data}</div>`,
  },
  {
    data: "quantityImported",
    width: "25%",
    render: (data) => `<div class="text-start text-break">${data}</div>`,
  },
];
const stockProducts = ref([]);

const getStockProducts = async () => {
  const response = await bookService.get("/");
  if (response.status === 200) {
    stockProducts.value = response.data;
  }
};

const deletePublisher = async (publisherID) => {
  const response = await publisherService.delete(`/${publisherID}`);
  if (response.status == 200) {
    toast(response.data.message, { theme: "auto", type: "success" });
    getReceipts();
  }
};

$(document).on("click", "#detailReceipt", (event) => {
  const receiptID = $(event.currentTarget).data("id");
  router.push({
    name: "admin-receipts-detail",
    params: { receiptID: receiptID },
  });
});

$(document).on("click", "#deletePublisher", async (event) => {
  const publisherID = $(event.currentTarget).data("id");
  const isConfirmed = confirm("Bạn có chắc chắn muốn xóa nhà xuất bản này?");
  if (isConfirmed) {
    await deletePublisher(publisherID);
  }
});

onMounted(getStockProducts);

const exportOptions = {
  columns: ":not(:last-child)",
};

const buttons = [
  { extend: "copy", exportOptions },
  { extend: "csv", exportOptions },
  { extend: "pdf", exportOptions },
  { extend: "print", exportOptions },
];

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
</script>

<style>
@import "datatables.net-bs5";
</style>
