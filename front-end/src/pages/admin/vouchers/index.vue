<template>
  <div>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Mã giảm giá</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <ModalAddVoucher @refreshVouchers="handleRefreshVouchers" />
        <ModalUpdateVoucher
          :voucherToEdit="editedVoucher"
          @refreshVouchers="handleRefreshVouchers"
        />
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <DataTable
                id="mytable"
                :columns="columns"
                :data="vouchers"
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
                      <button
                        type="button"
                        @click="handleEditVoucher(props.rowData._id)"
                        data-bs-toggle="modal"
                        data-bs-target="#updateVoucher"
                        class="badge text-bg-warning p-2"
                      >
                        <i class="fa-solid fa-pen"></i> Edit
                      </button>
                    </div>
                    <div class="me-3">
                      <button
                        @click="handleDeleteVoucher(props.rowData._id)"
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
                    <th class="text-start">Mã</th>
                    <th class="text-start">Loại mã</th>
                    <th class="text-start">Số lượng</th>
                    <th class="text-start">Đã sử dụng</th>
                    <th class="text-start">Bắt đầu</th>
                    <th class="text-start">Kết thúc</th>
                    <th class="text-start">Thao Tác</th>
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
import { ref, onMounted } from "vue";
import { useMenu } from "../../../stores/use-menu";
import DataTable from "datatables.net-vue3";
import DataTableLib from "datatables.net-bs5";
import Buttons from "datatables.net-buttons-bs5";
import ButtonsHtml5 from "datatables.net-buttons/js/buttons.html5";
import print from "datatables.net-buttons/js/buttons.print";
import pdfmake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfmake.vfs = pdfFonts.pdfMake.vfs;
import JsZip from "jszip";
import { useRouter } from "vue-router";
window.JsZip = JsZip;
DataTable.use(DataTableLib);
DataTable.use(pdfmake);
DataTable.use(ButtonsHtml5);
import ModalAddVoucher from "@/components/admin/modals/vouchers/voucher/ModalAddVoucher.vue";
import ModalUpdateVoucher from "@/components/admin/modals/vouchers/voucher/ModalUpdateVoucher.vue";
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import { showConfirmation } from "@/utils/swalUtils";
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
import moment from "moment";
import { buttons, language } from "@/utils/datatable";
import { showErrorToast, showSuccessToast } from "@/utils/toast.util";

export default {
  components: {
    DataTable,
    ModalAddVoucher,
    ModalUpdateVoucher,
  },
  setup() {
    const router = useRouter();
    const store = useMenu();
    store.onSelectedKeys(["admin-vouchers-list"]);
    const apiAdmin = new ApiAdmin();
    const editedVoucher = ref({});
    const columns = [
      {
        data: null,
        width: "5%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${meta.row + 1}</div>`;
        },
      },
      {
        data: "code",
        width: "15%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${data}</div>`;
        },
      },
      {
        data: "voucherCategoryID.name",
        width: "15%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${data}</div>`;
        },
      },
      {
        data: "quantity",
        width: "10%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${data}</div>`;
        },
      },
      {
        data: "quantityUsed",
        width: "10%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${data}</div>`;
        },
      },
      {
        data: "startDate",
        width: "15%",
        render: (data, type, row, meta) => {
          return moment(data).format("DD/MM/YYYY");
        },
      },

      {
        data: "endDate",
        width: "15%",
        render: (data, type, row, meta) => {
          return moment(data).format("DD/MM/YYYY");
        },
      },
      {
        data: "_id",
        width: "30%",
        render: "#action",
      },
    ];

    // const editedNxb = ref({});
    const vouchers = ref([]);
    const getVouchers = async () => {
      const response = await apiAdmin.get("/vouchers/voucher");
      if (response.status === 200) {
        vouchers.value = response.data;
      }
    };

    const handleEditVoucher = (voucherId) => {
      const voucherToEdit = vouchers.value.find(
        (voucher) => voucher._id === voucherId
      );

      if (voucherToEdit) {
        editedVoucher.value = { ...voucherToEdit };
      }
    };

    const deleteVoucher = async (voucherId) => {
      try {
        const response = await apiAdmin.delete(
          `/vouchers/voucher/${voucherId}`
        );
        if (response.status === 200) {
          showSuccessToast(response.data.message);
          getVouchers();
        }
      } catch (error) {
        showErrorToast("Lỗi khi xóa mã giảm giá");
      }
    };

    const handleDeleteVoucher = async (voucherId) => {
      const isConfirmed = await showConfirmation({
        title: "Mã giảm giá sẽ bị xóa đi",
      });
      if (isConfirmed.isConfirmed) {
        await deleteVoucher(voucherId);
      }
    };

    

    onMounted(() => {
      getVouchers();
    });

    const handleRefreshVouchers = async () => {
      await getVouchers();
    };

    return {
      getVouchers,
      vouchers,
      columns,
      editedVoucher,
      buttons,
      language,
      handleRefreshVouchers,
      handleDeleteVoucher,
      handleEditVoucher,
    };
  },
};
</script>
<style>
@import "datatables.net-bs5";
</style>
