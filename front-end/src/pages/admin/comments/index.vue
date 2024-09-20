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
        <!-- <ModalAddAuthor @refreshAuthors="getAuthors" />
        <ModalUpdateAuthor
          :authorToEdit="editedAuthor"
          @refreshAuthors="getAuthors"
        /> -->
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <DataTable
                id="mytable"
                :columns="columns"
                :data="comments"
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
                    <th class="text-start">Khách hàng</th>
                    <th class="text-start">Nội dung</th>
                    <th class="text-start">Đánh giá</th>
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
import CommentService from "@/service/comment.service";
import { showConfirmation } from "@/utils/swalUtils";
import { toast } from "vue3-toastify";
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
export default {
  components: {
    DataTable,
    ModalAddAuthor,
    ModalUpdateAuthor,
  },
  setup() {
    const router = useRouter();
    const store = useMenu();
    store.onSelectedKeys(["admin-comments-list"]);
    const commentService = new CommentService();
    const editedAuthor = ref({});
    const columns = [
      {
        data: null,
        width: "5%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${meta.row + 1}</div>`;
        },
      },
      {
        data: "userID",
        width: "20%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${
            data.firstName + " " + data.lastName
          }
            <div>(${data.phoneNumber})</div></div>`;
        },
      },
      {
        data: "content",
        width: "50%",
        render: (data, type, row, meta) => {
          return `<div class='text-start'>${data}</div>`;
        },
      },
      {
        data: "star",
        width: "10%",
        render: (data, type, row, meta) => {
          let divStar = "";
          for (let i = 1; i <= data; i++) {
            divStar += `<i class="fa-solid fa-star text-warning"></i>`;
          }
          for (let i = 1; i <= 5 - data; i++) {
            divStar += `
            <i
              class="fa-solid fa-star text-secondary"
            ></i>`;
          }
          return divStar;
        },
      },
      {
        data: "_id",
        width: "30%",
        render: (data, type, row, meta) => {
          return `<div class="row">
              <div class="col-sm-1 me-3">
                  <button data-bs-toggle="modal" data-bs-target="#updateAuthor" ref="${data}" id="editAuthor" class="btn btn-warning" data-id=${data}>
                     <i class="fa-solid fa-pencil"></i>
                  </button>
              </div>
              <div class="col-sm-1">
                  <button  class="btn btn-danger" id="deleteAuthor" data-id=${data}>
                      <i class="fa-solid fa-trash"></i>
                  </button>
              </div>
            </div>`;
        },
      },
    ];

    // const editedNxb = ref({});
    const comments = ref([]);
    const getComments = async () => {
      const response = await commentService.get("/");
      if (response.status === 200) {
        console.log(response.data);
        comments.value = response.data;
      }
    };

    // $(document).on("click", "#editAuthor", (event) => {
    //   let authorId = $(event.currentTarget).data("id");
    //   const authorToEdit = authors.value.find(
    //     (author) => author._id === authorId
    //   );

    //   if (authorToEdit) {
    //     editedAuthor.value = { ...authorToEdit };
    //   }
    // });

    // const deleteAuthor = async (authorId) => {
    //   const response = await authorService.delete(`/${authorId}`);
    //   if (response.status === 200) {
    //     toast(response.data.message, {
    //       theme: "auto",
    //       type: "success",
    //       dangerouslyHTMLString: true,
    //     });
    //     getComments();
    //   }
    // };

    // $(document).on("click", "#deleteAuthor", async (event) => {
    //   const authorId = $(event.currentTarget).data("id");
    //   const isConfirmed = await showConfirmation({
    //     title: "Bạn chắc chắn muốn xóa tác giả này",
    //   });
    //   if (isConfirmed.isConfirmed) {
    //     await deleteAuthor(authorId);
    //   }
    // });

    onMounted(() => {
      getComments();
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
      getComments,
      comments,
      columns,
      editedAuthor,
      buttons,
      language,
    };
  },
};
</script>
<style>
@import "datatables.net-bs5";
</style>
