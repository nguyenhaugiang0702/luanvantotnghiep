<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý sách
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Sách</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <DataTable
                id="mytable"
                :columns="columns"
                :data="books"
                :options="{
                  responsive: false,
                  autoWidth: true,
                  dom: 'lBfrtip',
                  buttons: buttons,
                  language: language
                }"
                class="display table table-striped table-bordered"
                :scroll="{ x: 576 }"
              >
                <thead>
                  <tr>
                    <th class="text-start">#</th>
                    <th class="text-start">Tên</th>
                    <th class="text-start">Danh mục</th>
                    <th class="text-start">Hình thức</th>
                    <th class="text-start">Nhà xuất bản</th>
                    <th class="text-start">Tác giả</th>
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
import AuthorsService from "@/service/author.service";
import BookService from "@/service/book.service";
import { showConfirmation } from "@/utils/swalUtils";
import { toast } from "vue3-toastify";
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
export default {
  components: {
    DataTable,
  },
  setup() {
    const router = useRouter();
    const store = useMenu();
    store.onSelectedKeys(["admin-books-list"]);
    const authorService = new AuthorsService();
    const bookService = new BookService();
    const editedAuthor = ref({});
    const columns = [
      {
        data: null,
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${meta.row + 1}</div>`;
        },
      },
      {
        data: "name",
        width: '25%',
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${data}</div>`;
        },
      },
      {
        data: "categoryID.name",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${data}</div>`;
        },
      },
      {
        data: "formalityID.name",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${data}</div>`;
        },
      },
      {
        data: "publisherID.name",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${data}</div>`;
        },
      },
      {
        data: "authorID.name",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${data}</div>`;
        },
      },
      {
        data: "_id",
        render: (data, type, row, meta) => {
          return `<div class="row">
            <div class="col-sm-2 me-3">
                  <button type="button" id="viewDetail" class="btn btn-secondary" data-id=${data} data-bs-toggle="tooltip" 
                        data-bs-placement="top" data-bs-title="Tooltip on top">
                    <i class="fa-solid fa-circle-info"></i>
                  </button>
              </div>
              <div class="col-sm-2 me-3">
                  <button id="editBook" class="btn btn-warning" data-id=${data}>
                     <i class="fa-solid fa-pencil"></i>
                  </button>
              </div>
              <div class="col-sm-2">
                  <button  class="btn btn-danger" id="deleteBook" data-id=${data}>
                      <i class="fa-solid fa-trash"></i>
                  </button>
              </div>
            </div>`;
        },
      },
    ];

    const books = ref([]);
    const getBooks = async () => {
      const response = await bookService.get("/");
      if (response.status === 200) {
        books.value = response.data;
        console.log(response.data);
      }
    };

    $(document).on("click", "#editBook", (event) => {
      let bookId = $(event.currentTarget).data("id");
      router.push({ name: "admin-books-edit", params: { bookID: bookId } });
    });

    $(document).on("click", "#viewDetail", async (event) => {
      let bookId = $(event.currentTarget).data("id");
      router.push({ name: "admin-books-edit-detail", params: { bookID: bookId } });
    });

    onMounted(() => {
      getBooks();
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
      getBooks,
      books,
      columns,
      buttons,
      language
    };
  },
};
</script>
<style>
@import "datatables.net-bs5";
</style>
