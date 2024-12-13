<template>
  <div>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Loại mã giảm giá</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <ModalAddVoucherCategory @refreshVouchersCategory="getVouchersCategory" />
        <ModalUpdateVoucherCatgory
          :voucherCategoryToEdit="editedVoucherCategory"
          @refreshVouchersCategory="getVouchersCategory"
        />
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <DataTable
                id="mytable"
                :columns="columns"
                :data="vouchersCategory"
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
                        @click="handleEditVoucherCategory(props.rowData._id)"
                        data-bs-toggle="modal"
                        data-bs-target="#updateVoucherCategory"
                        class="badge text-bg-warning p-2"
                      >
                        <i class="fa-solid fa-pen"></i> Edit
                      </button>
                    </div>
                    <div class="me-3">
                      <button
                        @click="handleDeleteVoucherCategory(props.rowData._id)"
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
                    <th class="text-start">Loại giảm giá</th>
                    <th class="text-start">Giá trị giảm</th>
                    <th class="text-start">Giá trị tối thiểu</th>
                    <th class="text-start">Giá trị giảm tối đa</th>
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
import ModalAddVoucherCategory from "@/components/admin/modals/vouchers/voucherCategory/ModalAddVoucherCategory.vue";
import ModalUpdateVoucherCatgory from "@/components/admin/modals/vouchers/voucherCategory/ModalUpdateVoucherCatgory.vue";
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import { showConfirmation } from "@/utils/swalUtils";
import { toast } from "vue3-toastify";
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
import { formatPrice, handleNavigate } from "@/utils/utils";
import { showErrorToast, showSuccessToast } from "@/utils/toast.util";
import { buttons, language } from "@/utils/datatable";

export default {
  components: {
    DataTable,
    ModalAddVoucherCategory,
    ModalUpdateVoucherCatgory,
  },
  setup() {
    const router = useRouter();
    const store = useMenu();
    store.onSelectedKeys(["admin-vouchers-voucherCategory-list"]);
    const apiAdmin = new ApiAdmin();
    const editedVoucherCategory = ref({});
    const columns = [
      {
        data: null,
        width: "5%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${meta.row + 1}</div>`;
        },
      },
      {
        data: "discountType",
        width: "10%",
        render: (data, type, row, meta) => {
          if (data === "percent") {
            return `<div class='text-start'>Phần trăm</div>`;
          }
          return `<div class='text-start'>Giá tiền</div>`;
        },
      },
      {
        data: "value",
        width: "15%",
        render: (data, type, row, meta) => {
          if (row.discountType === "percent") {
            return `<div class='text-start'>${data} %</div>`;
          }
          return `<div class='text-start'>${formatPrice(data)}</div>`;
        },
      },
      {
        data: "minValue",
        width: "15%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${formatPrice(data)}</div>`;
        },
      },
      {
        data: "maxValue",
        width: "15%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${formatPrice(data)}</div>`;
        },
      },
      {
        data: "_id",
        width: "30%",
        render: "#action",
      },
    ];

    // const editedNxb = ref({});
    const vouchersCategory = ref([]);
    const getVouchersCategory = async () => {
      const response = await apiAdmin.get("/vouchers/voucherCategory");
      if (response.status === 200) {
        vouchersCategory.value = response.data;
      }
    };

    const handleEditVoucherCategory = (voucherCategoryId) => {
      const voucherCategoryToEdit = vouchersCategory.value.find(
        (voucherCategory) => voucherCategory._id === voucherCategoryId
      );

      if (voucherCategoryToEdit) {
        editedVoucherCategory.value = { ...voucherCategoryToEdit };
      }
    };

    const deleteVoucherCategory = async (voucherCategoryID) => {
      try {
        const response = await apiAdmin.delete(
          `/vouchers//voucherCategory/${voucherCategoryID}`
        );
        if (response.status === 200) {
          showSuccessToast(response.data.message);
          getVouchersCategory();
        }
      } catch (error) {
        console.log(error);
        showErrorToast("Lỗi khi xóa loại giảm giá");
      }
    };

    const handleDeleteVoucherCategory = async (voucherCategoryId) => {
      const isConfirmed = await showConfirmation({
        text: "Loại giảm giá này sẽ bị xóa",
      });
      if (isConfirmed.isConfirmed) {
        await deleteVoucherCategory(voucherCategoryId);
      }
    };

    onMounted(() => {
      getVouchersCategory();
    });

    return {
      getVouchersCategory,
      vouchersCategory,
      columns,
      editedVoucherCategory,
      buttons,
      language,
      handleEditVoucherCategory,
      handleDeleteVoucherCategory,
    };
  },
};
</script>
<style>
@import "datatables.net-bs5";
</style>
