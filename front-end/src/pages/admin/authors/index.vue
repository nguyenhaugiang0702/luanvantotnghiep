<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý tác giả
    </a-layout-header>
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
        <div class="table-responsive">
          <DataTable
            id="mytable"
            :columns="columns"
            :data="authors"
            :options="{
              responsive: true,
              autoWidth: true,
              dom: 'lBfrtip',
              buttons: buttons,
            }"
            class="display table table-striped table-bordered"
            :scroll="{ x: 576 }"
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Tên</th>
                <th>Ngày Sinh</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody></tbody>
          </DataTable>
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
import ModalAddAuthor from "@/components/admin/modals/authors/ModalAddAuthor.vue";
import ModalUpdateAuthor from "@/components/admin/modals/authors/ModalUpdateAuthor.vue";
import AuthorsService from "@/service/author.service";
import { showConfirmation } from "@/utils/swalUtils";
import { toast } from "vue3-toastify";

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
    const authorService = new AuthorsService();
    const editedAuthor = ref({});
    const columns = [
      {
        data: null,
        render: (data, type, row, meta) => {
          return meta.row + 1;
        },
      },
      { data: "name" },
      { data: "dob" },
      {
        data: "_id",
        render: (data, type, row, meta) => {
          return `
                <button data-bs-toggle="modal" data-bs-target="#updateAuthor" id="editAuthor" data-id="${data}" class="btn btn-warning" >
                        <i class="fa-solid fa-pencil"></i> Sửa
                        </button>
                        <button id="deleteAuthor" data-id="${data}" class="btn btn-danger" >
                            <i class="fa-solid fa-trash"></i> Xóa
                        </button>
                    `;
        },
      },
    ];

    // const editedNxb = ref({});
    const authors = ref([]);
    const getAuthors = async () => {
      const response = await authorService.get("/");
      if (response.status === 200) {
        authors.value = response.data;
      }
    };

    $(document).on("click", "#editAuthor", (event) => {
      let authorId = $(event.currentTarget).data("id");
      const authorToEdit = authors.value.find(
        (author) => author._id === authorId
      );
      if (authorToEdit) {
        editedAuthor.value = { ...authorToEdit };
      }
    });

    const deleteAuthor = async (authorId) => {
      const response = await authorService.delete(`/${authorId}`);
      if (response.status === 200) {
        toast(response.data.message, {
          theme: "auto",
          type: "success",
          dangerouslyHTMLString: true,
        });
        getAuthors();
      }
    };

    const confirmDelete = (authorId) => {
      confirm.require({
        message: "Bạn có chắc chắn muốn xóa tác giả này?",
        header: "Xác nhận xóa",
        icon: "pi pi-info-circle",
        rejectLabel: "Hủy",
        rejectProps: {
          label: "Hủy",
          severity: "secondary",
          outlined: true,
        },
        acceptProps: {
          label: "Xóa",
          severity: "danger",
        },
        accept: async () => {
          await deleteAuthor(authorId);
        },
      });
    };

    $(document).on("click", "#deleteAuthor", async (event) => {
      const authorId = $(event.currentTarget).data("id");
      //   confirmDelete(authorId);
      const isConfirmed = await showConfirmation({
        title: "Bạn chắc chắn muốn xóa tác giả này",
      });
      if (isConfirmed.isConfirmed) {
        await deleteAuthor(authorId);
      }
    });

    onMounted(() => {
      getAuthors();
    });

    return {
      getAuthors,
      authors,
      columns,
      editedAuthor,
    };
  },
};
</script>
<style>
@import "datatables.net-bs5";
</style>
