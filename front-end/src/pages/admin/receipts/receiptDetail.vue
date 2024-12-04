<template>
  <div>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Nhập hàng</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">{{
          supplier.name +
          " - " +
          formatDate(receiptDetail.createdAt, (time = ttrue))
        }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <ModalAddReceipt
          :supplierID="supplier.id"
          :receiptID="receiptID"
          @refreshReceipt="getReceiptDetail"
        />
        <div class="row">
          <div class="col-12">
            <!-- Table -->
            <div class="table-responsive mt-4">
              <DataTable
                id="datatable_receipt_detail"
                :columns="columns"
                :data="receiptDetail"
                :options="{
                  responsive: false,
                  autoWidth: true,
                  dom: 'lBfrtip',
                  buttons: buttonsReceiptDetailConfig,
                  language: language,
                }"
                class="display table table-striped table-bordered"
                :scroll="{ x: 576 }"
              >
                <thead>
                  <tr>
                    <th class="text-start">#</th>
                    <th class="text-start">Sản phẩm</th>
                    <th class="text-start">Số lượng</th>
                    <th class="text-start">Đơn giá</th>
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
import { buttonsReceiptDetail, language } from "@/utils/datatable";

//
import ApiAdmin from "../../../service/admin/apiAdmin.service";

import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import { formatDate, formatPrice } from "@/utils/utils";
import ModalAddReceipt from "@/components/admin/modals/receipts/ModalAddReceipt.vue";

export default defineComponent({
  components: {
    DataTable,
    ModalAddReceipt,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const apiAdmin = new ApiAdmin();
    const receiptID = ref(route.params.receiptID);
    const columns = [
      {
        data: null,
        width: "5%",
        render: (data, type, row, meta) =>
          `<div class="text-start">${meta.row + 1}</div>`,
      },
      {
        data: "bookName",
        width: "45%",
        render: (data) => `<div class="text-start text-break">${data}</div>`,
      },
      {
        data: "quantity",
        width: "20%",
        render: (data) => `<div class="text-start text-break">${data}</div>`,
      },
      {
        data: "price",
        width: "20%",
        render: (data) =>
          `<div class="text-start text-break">${formatPrice(data)}</div>`,
      },
    ];
    const receiptDetail = ref([]);
    const supplier = ref({
      id: "",
      name: "",
    });
    const getReceiptDetail = async () => {
      const response = await apiAdmin.get(`/receipts/${receiptID.value}`);
      if (response.status === 200) {
        receiptDetail.value = response.data.receiptDetail;
        supplier.value = response.data.supplier;
      }
    };

    onMounted(getReceiptDetail);

    const buttonsReceiptDetailConfig = computed(() =>
      buttonsReceiptDetail(receiptDetail.value.createdAt)
    );

    return {
      getReceiptDetail,
      columns,
      receiptDetail,
      buttonsReceiptDetail,
      language,
      formatPrice,
      supplier,
      receiptID,
      formatDate,
      buttonsReceiptDetailConfig
    };
  },
});
</script>

<style>
@import "datatables.net-bs5";
</style>
