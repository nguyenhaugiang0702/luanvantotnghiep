<template>
  <div>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Người dùng</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <DataTable
                id="mytable"
                :columns="columns"
                :data="orders"
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
                    <th class="text-start">Khách hàng</th>
                    <th class="text-start">Số lượng</th>
                    <th class="text-start">Tổng giá</th>
                    <th class="text-start">Thanh toán</th>
                    <th class="text-start">Mã giảm giá</th>
                    <th class="text-start">Đã trả</th>
                    <th class="text-start">Trạng thái</th>
                    <th class="text-start">Ngày đặt</th>
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

<script setup>
import { ref, onMounted } from "vue";
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import { useMenu } from "../../../stores/use-menu";
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
import { useRouter } from "vue-router";
window.JsZip = JsZip;
DataTable.use(DataTableLib);
DataTable.use(pdfmake);
DataTable.use(ButtonsHtml5);
import { showConfirmation } from "@/utils/swalUtils";
import { toast } from "vue3-toastify";
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
import moment from "moment";
import { formatPrice, handleNavigate } from "@/utils/utils";
//
const router = useRouter();
const store = useMenu();
store.onSelectedKeys(["admin-orders-list"]);
//
const apiAdmin = new ApiAdmin();
const orders = ref([]);
// Dữ liệu giả
const getOrders = async () => {
  const response = await apiAdmin.get("/orders");
  if (response.status === 200) {
    orders.value = response.data;
    console.log(response.data);
  }
};

const columns = [
  {
    data: null,
    width: "5%",
    render: (data, type, row, meta) => {
      return `<div class='text-start'>${meta.row + 1}</div>`;
    },
  },
  {
    data: "userID",
    render: (data, type, row, meta) => {
      return `<div class='text-start'>${
        data.firstName + " " + data.lastName
      }</div>
      <div class='text-start'>(${data.phoneNumber})</div>`;
    },
  },
  {
    data: "totalQuantity",
    width: "5%",
    render: (data, type, row, meta) => {
      return `<div class='text-start'>${data}</div>`;
    },
  },
  {
    data: "totalPrice",
    render: (data, type, row, meta) => {
      return `<div class='text-start'>${formatPrice(data)}</div>`;
    },
  },
  {
    data: "payment",
    width: "10%",
    render: (data, type, row, meta) => {
      return `<div class='text-start'>${data}</div>`;
    },
  },
  {
    data: "voucherID.code",
    width: "10%",
    render: (data, type, row, meta) => {
      return `<div class='text-start'>${data ? data : ""}</div>`;
    },
  },
  {
    data: "wasPaided",
    render: (data, type, row, meta) => {
      if (data) {
        data = "Đã thanh toán";
        return `<div class='text-start badge text-bg-success'>${data}</div>`;
      } else {
        data = "Chưa";
        return `<div class='text-start'>${data}</div>`;
      }
    },
  },
  {
    data: "status",
    width: "8%",
    render: (data, type, row, meta) => {
      if (data === 1) {
        data = "Chờ xác nhận";
        return `<div class='text-start badge text-bg-warning'>${data}</div>`;
      } else if (data === 2) {
        data = "Đã xác nhận";
        return `<div class='text-start badge text-bg-success'>${data}</div>`;
      } else if (data === 3) {
        data = "Đã hủy";
        return `<div class='text-start badge text-bg-danger'>${data}</div>`;
      } else if (data === 4) {
        data = "Yêu cầu hủy";
        return `<div class='text-start badge text-bg-danger'>${data}</div>`;
      }
    },
  },
  {
    data: "createdAt",
    render: (data, type, row, meta) => {
      return `<div class='text-start'>${moment(data).format(
        "DD/MM/YYYY HH:mm:ss"
      )}</div>`;
    },
  },
  {
    data: "_id",
    render: (data, type, row, meta) => {
      return `<div class="d-flex">
        <div class="me-3">
                <button id="detailOrder" class="badge text-bg-secondary p-2" data-id=${data}>
                   <i class="fa-solid fa-eye"></i> View
                </button>
            </div>
            <div class="">
                <button class="badge text-bg-danger p-2" id="deleteAuthor" data-id=${data}>
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>
          </div>`;
    },
  },
];

$(document).on("click", "#detailOrder", (event) => {
  let orderID = $(event.currentTarget).data("id");
  handleNavigate(router, "admin-order-detail", "orderID", orderID);
});

onMounted(() => {
  getOrders();
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
</script>
<style>
@import "datatables.net-bs5";
</style>
<style scoped>
div {
  font-size: 15px;
}
</style>
