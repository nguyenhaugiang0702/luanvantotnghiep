<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý loại mã giảm giá
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Loại mã giảm giá</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <ModalAddVoucherCategory
          @refreshVouchersCategory="getVouchersCategory"
        />
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
                <thead>
                  <tr>
                    <th class="text-start">#</th>
                    <th class="text-start">Loại giảm giá</th>
                    <th class="text-start">Giá trị giảm</th>
                    <th class="text-start">Giá trị tối thiểu</th>
                    <th class="text-start">Giá trị tối đa</th>
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
        render: (data, type, row, meta) => {
          return `<div class="d-flex">
              <div class="me-3">
                  <button data-bs-toggle="modal" data-bs-target="#updateVoucherCategory" id="editVoucherCategory" class="badge text-bg-warning p-2" data-id=${data}>
                     <i class="fa-solid fa-pencil"></i> Edit
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

    // const editedNxb = ref({});
    const vouchersCategory = ref([]);
    const getVouchersCategory = async () => {
      const response = await apiAdmin.get("/vouchers/voucherCategory");
      if (response.status === 200) {
        vouchersCategory.value = response.data;
      }
    };

    $(document).on("click", "#editVoucherCategory", (event) => {
      let voucherCategoryId = $(event.currentTarget).data("id");
      const voucherCategoryToEdit = vouchersCategory.value.find(
        (voucherCategory) => voucherCategory._id === voucherCategoryId
      );

      if (voucherCategoryToEdit) {
        editedVoucherCategory.value = { ...voucherCategoryToEdit };
      }
    });

    onMounted(() => {
      getVouchersCategory();
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
      getVouchersCategory,
      vouchersCategory,
      columns,
      editedVoucherCategory,
      buttons,
      language,
    };
  },
};
</script>
<style>
@import "datatables.net-bs5";
</style>
