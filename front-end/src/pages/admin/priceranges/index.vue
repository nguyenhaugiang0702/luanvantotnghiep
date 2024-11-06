<template>
  <div>
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
                <template #action="props">
                  <div class="d-flex">
                    <div class="me-3">
                      <button
                        @click="handleUpdatePriceRange(props.rowData._id)"
                        data-bs-toggle="modal"
                        data-bs-target="#updatePriceRange"
                        class="badge text-bg-warning p-2"
                      >
                        <i class="fa-solid fa-pencil"></i> Edit
                      </button>
                    </div>
                    <div class="">
                      <button
                        type="button"
                        @click="handleDeletePriceRange(props.rowData._id)"
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
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
import { formatPrice, handleNavigate } from "@/utils/utils";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import { buttons, language } from "@/utils/datatable";

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
          return `<div class='text-start'>${formatPrice(data)}</div>`;
        },
      },
      {
        data: "endPrice",
        width: "30%",
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

    const priceranges = ref([]);
    const getPriceRanges = async () => {
      const response = await apiAdmin.get("/priceranges");
      if (response.status === 200) {
        priceranges.value = response.data;
      }
    };

    const handleUpdatePriceRange = (priceRangeID) => {
      const priceRangeToEdit = priceranges.value.find(
        (pricerange) => pricerange._id === priceRangeID
      );

      if (priceRangeToEdit) {
        editedPriceRange.value = { ...priceRangeToEdit };
      }
    };

    const deletePriceRange = async (priceRangeID) => {
      try {
        const response = await apiAdmin.delete(`/priceranges/${priceRangeID}`);
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          getPriceRanges();
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    const handleDeletePriceRange = async (priceRangeID) => {
      const isConfirmed = await showConfirmation({
        title: "Bạn chắc chắn muốn xóa khoản giá này",
      });
      if (isConfirmed.isConfirmed) {
        await deletePriceRange(priceRangeID);
      }
    };

    onMounted(() => {
      getPriceRanges();
    });

    return {
      getPriceRanges,
      priceranges,
      columns,
      editedPriceRange,
      buttons,
      language,
      handleUpdatePriceRange,
      handleDeletePriceRange,
    };
  },
};
</script>
<style>
@import "datatables.net-bs5";
</style>
