<template>
  <div>
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
                <template #action="props">
                  <div class="d-flex">
                    <div class="me-3">
                      <button
                        @click="handleUpdatePublisher(props.rowData._id)"
                        class="badge text-bg-warning p-2"
                      >
                        <i class="fa-solid fa-pencil"></i> Edit
                      </button>
                    </div>
                    <div class="">
                      <button
                        type="button"
                        @click="handleDeletePublisher(props.rowData._id)"
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
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import { showSuccess, showConfirmation } from "@/utils/swalUtils";
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import { buttons, language } from "@/utils/datatable";

export default defineComponent({
  components: {
    DataTable,
  },
  setup() {
    const router = useRouter();
    const store = useMenu();
    store.onSelectedKeys(["admin-publishers-list"]);
    const apiAdmin = new ApiAdmin();
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
        render: "#action",
      },
    ];
    const publishers = ref([]);

    const getPublishers = async () => {
      const response = await apiAdmin.get("/publishers");
      if (response.status === 200) {
        publishers.value = response.data;
      }
    };

    const handleUpdatePublisher = (publisherID) => {
      router.push({
        name: "admin-publishers-edit",
        params: { publisherID: publisherID },
      });
    };

    const deletePublisher = async (publisherID) => {
      try {
        const response = await apiAdmin.delete(`/publishers/${publisherID}`);
        if (response.status == 200) {
          showSuccessToast(response?.data?.message);
          getPublishers();
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    const handleDeletePublisher = async (publisherID) => {
      const isConfirmed = await showConfirmation({
        title: "Bạn có chắc chắn muốn xóa nhà xuất bản này?",
      });
      if (isConfirmed.isConfirmed) {
        await deletePublisher(publisherID);
      }
    };

    onMounted(() => {
      getPublishers();
    });
    
    return {
      getPublishers,
      columns,
      publishers,
      buttons,
      language,
      handleDeletePublisher,
      handleUpdatePublisher,
    };
  },
});
</script>
<style>
@import "datatables.net-bs5";
</style>
