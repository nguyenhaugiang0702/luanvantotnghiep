<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý hình thức
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Hình thức</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <ModalAddFormality @refreshFormalities="getFormalities" />
        <ModalUpdateFormality
          :formalityToEdit="editedFormality"
          @refreshFormalities="getFormalities"
        />
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <DataTable
                id="mytable"
                :columns="columns"
                :data="formalities"
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
import ModalAddFormality from "@/components/admin/modals/formalities/ModalAddFormality.vue";
import ModalUpdateFormality from "@/components/admin/modals/formalities/ModalUpdateFormality.vue";
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import { showConfirmation } from "@/utils/swalUtils";
import { toast } from "vue3-toastify";
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

export default {
  components: {
    DataTable,
    ModalAddFormality,
    ModalUpdateFormality,
  },
  setup() {
    const router = useRouter();
    const store = useMenu();
    store.onSelectedKeys(["admin-formalities"]);
    const apiAdmin = new ApiAdmin();
    const editedFormality = ref({});
    const columns = [
      {
        data: null,
        width: "10%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${meta.row + 1}</div>`;
        },
      },
      {
        data: "name",
        width: "30%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${data}</div>`;
        },
      },

      {
        data: "_id",
        width: "30%",
        render: (data, type, row, meta) => {
          return `<div class="d-flex">
              <div class="me-3">
                  <button data-bs-toggle="modal"
                      data-bs-target="#updateFormality" ref="${data}" id="editFormality" class="badge text-bg-warning p-2" data-id=${data}>
                     <i class="fa-solid fa-pencil"></i> Edit
                  </button>
              </div>
              <div class="">
                  <button type="button" 
                      class="badge text-bg-danger p-2" id="deleteFormality" data-id=${data}>
                      <i class="fa-solid fa-trash"></i> Delete
                  </button>
              </div>
            </div>`;
        },
      },
    ];

    // const editedNxb = ref({});
    const formalities = ref([]);
    const getFormalities = async () => {
      const response = await apiAdmin.get("/formalities");
      if (response.status === 200) {
        formalities.value = response.data;
      }
    };

    $(document).on("click", "#editFormality", (event) => {
      let formalityID = $(event.currentTarget).data("id");
      const formalityToEdit = formalities.value.find(
        (formality) => formality._id === formalityID
      );
      if (formalityToEdit) {
        editedFormality.value = { ...formalityToEdit };
      }
    });

    const deleteFormality = async (formalityID) => {
      try {
        const response = await apiAdmin.delete(`/formalities/${formalityID}`);
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          getFormalities();
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    $(document).on("click", "#deleteFormality", async (event) => {
      const formalityID = $(event.currentTarget).data("id");
      const isConfirmed = await showConfirmation({
        title: "Bạn chắc chắn muốn xóa hình thức này",
      });
      if (isConfirmed.isConfirmed) {
        await deleteFormality(formalityID);
      }
    });

    onMounted(() => {
      getFormalities();
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
      getFormalities,
      formalities,
      columns,
      editedFormality,
      buttons,
      language,
    };
  },
};
</script>
<style>
@import "datatables.net-bs5";
</style>
