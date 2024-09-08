<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý danh sách nhập hàng
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Nhập hàng</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <div class="row" v-if="totalReceipts <= 0">Bạn chưa nhập hàng</div>
        <div v-else class="row">
          <div class="col-12">
            <ul class="nav nav-tabs border-bottom border-dark" id="myTab" role="tablist">
              <li
                v-for="(receipt, index) in receipts"
                :key="receipt._id"
                class="nav-item"
                role="presentation"
              >
                <button
                  class="nav-link border border-dark border-bottom-0"
                  :class="{
                    'active': index === 0,
                  }"
                  :id="'tab-' + receipt.supplierID._id"
                  data-bs-toggle="tab"
                  :data-bs-target="'#pane-' + receipt.supplierID._id"
                  type="button"
                  role="tab"
                  :aria-controls="'pane-' + receipt.supplierID._id"
                  :aria-selected="index === 0 ? 'true' : 'false'"
                >
                  {{ receipt.supplierID.name }}
                </button>
              </li>
            </ul>
            <div class="tab-content" id="myTabContent">
              <div
                v-for="(receipt, index) in receipts"
                :key="receipt._id"
                :id="'pane-' + receipt.supplierID._id"
                class="tab-pane fade "
                :class="{ 'show active': index === 0 }"
                role="tabpanel"
                :aria-labelledby="'tab-' + receipt.supplierID._id"
              >
                <!-- Table -->
                <div class="table-responsive mt-4">
                  <DataTable
                  :id="'datatable-' + receipt.supplierID._id"
                  :columns="columns"
                    :data="getItemsBySupplier(receipt.supplierID._id)"
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
                        <th class="text-start">Ngày tạo</th>
                        <th class="text-start">Email</th>
                        <th class="text-start">Số điện thoại</th>
                        <th class="text-start">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </DataTable>
                </div>
              </div>
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
//
import PublisherService from "@/service/publisher.service.js";
import ReceiptService from "@/service/receipt.service.js";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

export default defineComponent({
  components: {
    DataTable,
  },
  setup() {
    const router = useRouter();
    const publisherService = new PublisherService();
    const receiptService = new ReceiptService();
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
        render: (data) => `<div class="text-start text-break">${data}</div>`,
      },
      {
        data: "supplierID.email",
        width: "15%",
        render: (data) => `<div class="text-start text-break">${data}</div>`,
      },
      {
        data: "supplierID.phoneNumber",
        width: "20%",
        render: (data) => `<div class="text-start text-break">${data}</div>`,
      },
      {
        data: "_id",
        width: "15%",
        render: (data) => `
            <div class="row">
              <div class="col-sm-2 me-4 col-md-2">
                <button ref="${data}" id="editPublisher" class="btn btn-warning" data-id=${data}>
                  <i class="fa-solid fa-pencil"></i>
                </button>
              </div>
              <div class="col-sm-2 col-md-2">
                <button class="btn btn-danger" id="deletePublisher" data-id=${data}>
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>`,
      },
    ];
    const receipts = ref([]);

    const getReceipts = async () => {
      const response = await receiptService.get("/");
      if (response.status === 200) {
        receipts.value = response.data;
        console.log(response.data);
      }
    };

    const totalReceipts = computed(() => receipts.value.length);

    const getItemsBySupplier = (supplierID) => {
      return receipts.value
        .filter(receipt => receipt.supplierID._id === supplierID) // Lọc theo `supplierID`
    };

    const deletePublisher = async (publisherID) => {
      const response = await publisherService.delete(`/${publisherID}`);
      if (response.status == 200) {
        toast(response.data.message, { theme: "auto", type: "success" });
        getReceipts();
      }
    };

    $(document).on("click", "#editPublisher", (event) => {
      const publisherID = $(event.currentTarget).data("id");
      router.push({ name: "admin-publishers-edit", params: { publisherID } });
    });

    $(document).on("click", "#deletePublisher", async (event) => {
      const publisherID = $(event.currentTarget).data("id");
      const isConfirmed = confirm(
        "Bạn có chắc chắn muốn xóa nhà xuất bản này?"
      );
      if (isConfirmed) {
        await deletePublisher(publisherID);
      }
    });

    onMounted(getReceipts);

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
