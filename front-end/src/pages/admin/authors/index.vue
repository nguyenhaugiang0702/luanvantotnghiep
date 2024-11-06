<template>
  <div>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Tác giả</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <ModalAddAuthor @refreshAuthors="getAuthors" />
        <ModalUpdateAuthor
          :authorToEdit="editedAuthor"
          @refreshAuthors="getAuthors"
        />
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <DataTable
                id="mytable"
                :columns="columns"
                :data="authors"
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
                        @click="handleUpdateAuthor(props.rowData._id)"
                        data-bs-toggle="modal"
                        data-bs-target="#updateAuthor"
                        id="editRole"
                        class="badge text-bg-warning p-2"
                      >
                        <i class="fa-solid fa-pencil"></i> Edit
                      </button>
                    </div>
                    <div class="">
                      <button
                        type="button"
                        @click="handleDeleteAuthor(props.rowData._id)"
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
                    <th class="text-start">Ngày Sinh</th>
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
import ModalAddAuthor from "@/components/admin/modals/authors/ModalAddAuthor.vue";
import ModalUpdateAuthor from "@/components/admin/modals/authors/ModalUpdateAuthor.vue";
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import { showConfirmation } from "@/utils/swalUtils";
import { toast } from "vue3-toastify";
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import { buttons, language } from "@/utils/datatable";

export default {
  components: {
    DataTable,
    ModalAddAuthor,
    ModalUpdateAuthor,
  },
  setup() {
    const router = useRouter();
    const store = useMenu();
    store.onSelectedKeys(["admin-authors-list"]);
    const apiAdmin = new ApiAdmin();
    const editedAuthor = ref({});
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
        data: "dob",
        width: "30%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${data}</div>`;
        },
      },
      {
        data: "_id",
        render: "#action",
        title: "Thao tác",
      },
    ];

    // const editedNxb = ref({});
    const authors = ref([]);
    const getAuthors = async () => {
      const response = await apiAdmin.get("/authors");
      if (response.status === 200) {
        authors.value = response.data;
      }
    };

    const handleDeleteAuthor = async (authorId) => {
      const isConfirmed = await showConfirmation({
        title: "Bạn chắc chắn muốn xóa tác giả này",
      });
      if (isConfirmed.isConfirmed) {
        await deleteAuthor(authorId);
      }
    };

    const handleUpdateAuthor = async (authorId) => {
      const authorToEdit = authors.value.find(
        (author) => author._id === authorId
      );

      if (authorToEdit) {
        editedAuthor.value = { ...authorToEdit };
      }
    };

    const deleteAuthor = async (authorId) => {
      try {
        const response = await apiAdmin.delete(`/authors/${authorId}`);
        if (response.status === 200) {
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
          getAuthors();
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    onMounted(() => {
      getAuthors();
    });

    return {
      getAuthors,
      authors,
      columns,
      editedAuthor,
      buttons,
      language,
      handleDeleteAuthor,
      handleUpdateAuthor,
    };
  },
};
</script>
<style>
@import "datatables.net-bs5";
</style>
