<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý khoản giá
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Khoản giá</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <ModalAddPriceRange @refreshPriceRanges="getPriceRanges" />
        <ModalUpdatePriceRange
          :priceRangeToEdit="editedPriceRange"
          @refreshPriceRanges="getPriceRanges"
        />
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <DataTable
                id="mytable"
                :columns="columns"
                :data="priceranges"
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
                    <th class="text-start">Giá bắt đầu</th>
                    <th class="text-start">Giá kết thúc</th>
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
import "datatables.net-responsive-bs5";
import JsZip from "jszip";
import { useRouter } from "vue-router";
window.JsZip = JsZip;
DataTable.use(DataTableLib);
DataTable.use(pdfmake);
DataTable.use(ButtonsHtml5);
import ModalAddPriceRange from "@/components/admin/modals/priceranges/ModalAddPriceRange.vue";
import ModalUpdatePriceRange from "@/components/admin/modals/priceranges/ModalUpdatePriceRange.vue";
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import { showConfirmation } from "@/utils/swalUtils";
import { toast } from "vue3-toastify";
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
export default {
  components: {
    DataTable,
    ModalAddPriceRange,
    ModalUpdatePriceRange,
  },
  setup() {
    const router = useRouter();
    const store = useMenu();
    store.onSelectedKeys(["admin-priceranges-list"]);
    const apiAdmin = new ApiAdmin();
    const editedPriceRange = ref({});
    const columns = [
      {
        data: null,
        width: "10%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${meta.row + 1}</div>`;
        },
      },
      {
        data: "startPrice",
        width: "30%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${data}</div>`;
        },
      },
      {
        data: "endPrice",
        width: "30%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${data}</div>`;
        },
      },
      {
        data: "_id",
        width: "30%",
        render: (data, type, row, meta) => {
          return `<div class="row">
            <div class="col-sm-1 me-3">
                <button data-bs-toggle="modal" data-bs-target="#updatePriceRange" ref="${data}" id="editPriceRange" class="btn btn-warning" data-id=${data}>
                   <i class="fa-solid fa-pencil"></i>
                </button>
            </div>
            <div class="col-sm-1">
                <button  class="btn btn-danger" id="deletePriceRange" data-id=${data}>
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
          </div>`;
        },
      },
    ];

    // const editedNxb = ref({});
    const priceranges = ref([]);
    const getPriceRanges = async () => {
      const response = await apiAdmin.get("/priceranges");
      if (response.status === 200) {
        priceranges.value = response.data;
      }
    };

    $(document).on("click", "#editPriceRange", (event) => {
      let priceRangeID = $(event.currentTarget).data("id");
      const priceRangeToEdit = priceranges.value.find(
        (pricerange) => pricerange._id === priceRangeID
      );

      if (priceRangeToEdit) {
        editedPriceRange.value = { ...priceRangeToEdit };
      }
    });

    const deletePriceRange = async (priceRangeID) => {
      const response = await apiAdmin.delete(`/priceranges/${priceRangeID}`);
      if (response.status === 200) {
        toast(response.data.message, {
          theme: "auto",
          type: "success",
          dangerouslyHTMLString: true,
        });
        getPriceRanges();
      }
    };

    $(document).on("click", "#deletePriceRange", async (event) => {
      const priceRangeID = $(event.currentTarget).data("id");
      const isConfirmed = await showConfirmation({
        title: "Bạn chắc chắn muốn xóa khoản giá này",
      });
      if (isConfirmed.isConfirmed) {
        await deletePriceRange(priceRangeID);
      }
    });

    onMounted(() => {
      getPriceRanges();
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
      getPriceRanges,
      priceranges,
      columns,
      editedPriceRange,
      buttons,
      language,
    };
  },
};
</script>
<style>
@import "datatables.net-bs5";
</style>
