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
                <template #action="props">
                  <div class="d-flex">
                    <div class="me-3">
                      <select
                        class="form-select"
                        :class="{
                          'border-warning border-2':
                            props.rowData?.status?.value === 1,
                          'border-success border-2':
                            props.rowData?.status?.value === 2,
                          'border-danger border-2':
                            props.rowData?.status?.value === 3 ||
                            props.rowData?.status?.value === 4,
                        }"
                        style="width: 12rem"
                        :value="props.rowData.status.value"
                        @change="
                          updateOrderStatus(
                            props.rowData._id,
                            $event.target.value
                          )
                        "
                      >
                        <option
                          style="width: 12rem"
                          v-for="option in props.rowData.statusOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                    </div>
                    <div class="me-3">
                      <button
                        @click="handleViewDetailOrder(props.rowData._id)"
                        class="badge text-bg-secondary p-2"
                      >
                        <i class="fa-solid fa-eye"></i> View
                      </button>
                    </div>
                    <div class="">
                      <button
                        type="button"
                        @click="handleDeleteOrder(props.rowData._id)"
                        class="badge text-bg-danger p-2"
                      >
                        <i class="fa-solid fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                </template>
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
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
import moment from "moment";
import { formatPrice, handleNavigate } from "@/utils/utils";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import { buttons, language } from "@/utils/datatable";

//
const router = useRouter();
const store = useMenu();
store.onSelectedKeys(["admin-orders-list"]);
//
const apiAdmin = new ApiAdmin();
const orders = ref([]);
const orderStatus = ref(null);
// Dữ liệu giả
const getOrders = async () => {
  const response = await apiAdmin.get("/orders");
  if (response.status === 200) {
    orders.value = response.data;
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
      if (data) {
        return `<div class='text-start'>${
          data.firstName + " " + data.lastName
        }</div>
      <div class='text-start'>(${data.phoneNumber})</div>`;
      }
      return `<div class='text-start'>Đang cập nhật<div>`;
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
        return `<div class='text-start badge text-bg-success p-2'>${data}</div>`;
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
      if (data.value === 1) {
        return `<div class='text-start badge text-bg-warning p-2'>${data.label}</div>`;
      } else if (data.value === 2) {
        return `<div class='text-start badge text-bg-success p-2'>${data.label}</div>`;
      } else if (data.value === 3) {
        return `<div class='text-start badge text-bg-danger p-2'>${data.label}</div>`;
      } else if (data.value === 4) {
        return `<div class='text-start badge text-bg-danger p-2'>${data.label}</div>`;
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
    render: "#action",
  },
];

const handleViewDetailOrder = (orderID) => {
  handleNavigate(router, "admin-order-detail", "orderID", orderID);
};

const deleteOrder = async (orderID) => {
  try {
    const response = await apiAdmin.delete(`/orders/${orderID}`);
    if (response.status === 200) {
      showSuccessToast(response?.data?.message);
      getOrders();
    }
  } catch (error) {
    console.log(error);
    showErrorToast(error.response?.data?.message);
  }
};

const handleDeleteOrder = async (orderID) => {
  const isConfirmed = await showConfirmation({
    title: "Bạn chắc chắn muốn xóa đơn hàng này",
  });
  if (isConfirmed.isConfirmed) {
    await deleteOrder(orderID);
  }
};

const updateOrderStatus = async (orderID, statusValue) => {
  try {
    const response = await apiAdmin.put(`/orders/${orderID}`, {
      status: statusValue,
    });
    if (response.status === 200) {
      showSuccessToast(response?.data?.message);
      getOrders();
    }
  } catch (error) {
    console.log(error);
    showErrorToast(error.response?.data?.message);
    getOrders();
  }
};

onMounted(() => {
  getOrders();
});
</script>
<style>
@import "datatables.net-bs5";
</style>
<style scoped>
div {
  font-size: 15px;
}
</style>
