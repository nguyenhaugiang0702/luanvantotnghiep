<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý nhà xuất bản
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Nhà xuất bản</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <DataTable
                id="mytable_suppliers"
                :columns="columns"
                :data="publishers"
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
                    <th class="text-start">Tên</th>
                    <th class="text-start">Số điện thoại</th>
                    <th class="text-start">Email</th>
                    <th class="text-start">Địa chỉ</th>
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

<script>
import { ref, onMounted, h, defineComponent } from "vue";
import { useMenu } from "../../../stores/use-menu.js";
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
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import PublisherService from "@/service/publisher.service.js";
import { showSuccess, showConfirmation } from "@/utils/swalUtils";
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
import { toast } from "vue3-toastify";
export default defineComponent({
  components: {
    DataTable,
  },
  setup() {
    const router = useRouter();
    const store = useMenu();
    store.onSelectedKeys(["admin-publishers-list"]);
    const publisherService = new PublisherService();
    const columns = [
      {
        data: null,
        width: "5%",
        render: (data, type, row, meta) => {
          return `<div class="text-center">${meta.row + 1}</div>`;
        },
      },
      {
        data: "name",
        width: "15%",
        render: (data, type, row, meta) => {
          return `<div class="text-start text-break">${data}</div>`;
        },
      },
      {
        data: "phoneNumber",
        width: "15%",
        render: (data, type, row, meta) => {
          return `<div class="text-start text-break">${data}</div>`;
        },
      },
      {
        data: "email",
        width: "20%",
        render: (data, type, row, meta) => {
          return `<div class="text-start text-break">${data}</div>`;
        },
      },
      {
        data: "address",
        width: "30%",
        render: (data) => {
          return `<div class="text-break text-start">${data}</div>`;
        },
      },
      {
        data: "_id",
        width: "15%",
        render: (data, type, row, meta) => {
          return `<div class="row">
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
          </div>`;
        },
      },
    ];
    const publishers = ref([]);

    const getPublishers = async () => {
      const response = await publisherService.get("/");
      if (response.status === 200) {
        publishers.value = response.data;
      }
    };

    const deletePublisher = async (publisherID) => {
      const response = await publisherService.delete(`/${publisherID}`);
      if (response.status == 200) {
        toast(response.data.message, {
          theme: "auto",
          type: "success",
          dangerouslyHTMLString: true,
        });
        getPublishers();
      }
    };

    $(document).on("click", "#editPublisher", async (event) => {
      const publisherID = $(event.currentTarget).data("id");
      router.push({
        name: "admin-publishers-edit",
        params: { publisherID: publisherID },
      });
    });

    $(document).on("click", "#deletePublisher", async (event) => {
      const publisherID = $(event.currentTarget).data("id");
      const isConfirmed = await showConfirmation({
        title: "Bạn có chắc chắn muốn xóa nhà xuất bản này?",
      });
      if (isConfirmed.isConfirmed) {
        await deletePublisher(publisherID);
      }
    });

    onMounted(() => {
      getPublishers();
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
      getPublishers,
      columns,
      publishers,
      buttons,
      language,
    };
  },
});
</script>
<style>
@import "datatables.net-bs5";
</style>
