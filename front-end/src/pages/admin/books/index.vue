<template>
  <div>
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
                  language: language,
                }"
                class="display table table-striped table-bordered"
                :scroll="{ x: 576 }"
              >
                <template #action="props">
                  <div class="d-flex">
                    <div class="me-3">
                      <button
                        @click="handleViewImage(props.rowData._id)"
                        class="badge text-bg-secondary p-2"
                      >
                        <i class="fa-solid fa-image"></i> View Image
                      </button>
                    </div>
                    <div class="me-3">
                      <button
                        @click="handleEditBook(props.rowData._id)"
                        data-bs-toggle="modal"
                        data-bs-target="#updateAuthor"
                        id="editRole"
                        class="badge text-bg-warning p-2"
                      >
                        <i class="fa-solid fa-pencil"></i> Edit
                      </button>
                    </div>
                    <div v-if="props.rowData.isShowed" class="">
                      <button
                        type="button"
                        @click="
                          handleHideAndShowBook(props.rowData._id, (method = 'hide'))
                        "
                        class="badge text-bg-danger p-2"
                      >
                        <i class="fa-solid fa-eye-slash"></i> Hide
                      </button>
                    </div>
                    <div v-else class="">
                      <button
                        type="button"
                        @click="
                          handleHideAndShowBook(props.rowData._id, (method = 'show'))
                        "
                        class="badge text-bg-success p-2"
                      >
                        <i class="fa-solid fa-eye"></i> Show
                      </button>
                    </div>
                  </div>
                </template>
                <thead>
                  <tr>
                    <th class="text-start">#</th>
                    <th class="text-start">Tên</th>
                    <th class="text-start">Thể loại</th>
                    <th class="text-start">Hình thức</th>
                    <th class="text-start">Nhà xuất bản</th>
                    <th class="text-start">Tác giả</th>
                    <th class="text-start">Giá gốc</th>
                    <th class="text-start">Giá khuyến mãi</th>
                    <th class="text-start">Lượt xem</th>
                    <th class="text-start">Trạng thái</th>
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

<script setup>
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
import ApiAdmin from "@/service/admin/apiAdmin.service";
import { showConfirmation } from "@/utils/swalUtils";
import { toast } from "vue3-toastify";
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
import { handleNavigate } from "@/utils/utils";
import { showErrorToast, showSuccessToast } from "@/utils/toast.util";
import { formatPrice } from "@/utils/utils";
import { buttons, language } from "@/utils/datatable";

const router = useRouter();
const store = useMenu();
store.onSelectedKeys(["admin-books-list"]);
const apiAdmin = new ApiAdmin();
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
    data: "name",
    width: "20%",
    render: (data, type, row, meta) => {
      return `<div class='text-start'>${data}</div>`;
    },
  },
  {
    data: "categoryID.name",
    width: "10%",
    render: (data, type, row, meta) => {
      return `<div class='text-start'>${data ? data : "Đang cập nhật..."}</div>`;
    },
  },
  {
    data: "formalityID.name",
    width: "10%",
    render: (data, type, row, meta) => {
      return `<div class='text-start'>${data ? data : "Đang cập nhật..."}</div>`;
    },
  },
  {
    data: "publisherID.name",
    width: "10%",
    render: (data, type, row, meta) => {
      return `<div class='text-start'>${data ? data : "Đang cập nhật..."}</div>`;
    },
  },
  {
    data: "authorID.name",
    width: "10%",
    render: (data, type, row, meta) => {
      return `<div class='text-start'>${data ? data : "Đang cập nhật..."}</div>`;
    },
  },
  {
    data: "detail.originalPrice",
    width: "10%",
    render: (data, type, row, meta) => {
      return `<div class='text-start'>${
        data ? formatPrice(data) : "Đang cập nhật..."
      }</div>`;
    },
  },
  {
    data: "detail.discountPrice",
    width: "10%",
    render: (data, type, row, meta) => {
      return `<div class='text-start'>${
        data ? formatPrice(data) : "Đang cập nhật..."
      }</div>`;
    },
  },
  {
    data: "view",
    width: "10%",
    render: (data, type, row, meta) => {
      return `<div class='text-start'>${data}</div>`;
    },
  },
  {
    data: "isShowed",
    width: "10%",
    render: (data, type, row, meta) => {
      if (data) {
        return `<div class='text-start badge text-bg-success p-2'>Đang hiển thị</div>`;
      }
      return `<div class='text-start badge text-bg-danger p-2'>Dã ẩn</div>`;
    },
  },
  {
    data: "_id",
    width: "auto",
    render: "#action",
    title: "Thao tác",
  },
];

const books = ref([]);
const getBooks = async () => {
  const response = await apiAdmin.get("/books");
  if (response.status === 200) {
    books.value = response.data;
  }
};

const handleViewImage = (bookID) => {
  router.push({
    name: "admin-books-edit-detail",
    params: { bookID: bookID },
  });
};

const handleEditBook = (bookID) => {
  router.push({ name: "admin-books-edit", params: { bookID: bookID } });
};

const HideAndShowBook = async (bookID, method) => {
  try {
    let response;
    if (method === "hide") {
      response = await apiAdmin.put(`/books/hide/${bookID}`, {
        isShowed: false,
      });
    } else {
      response = await apiAdmin.put(`/books/hide/${bookID}`, {
        isShowed: true,
      });
    }
    if (response.status === 200) {
      showSuccessToast(response.data.message);
      getBooks();
    }
  } catch (error) {
    console.log(error);
    showErrorToast("Lỗi khi ẩn sách");
  }
};
const handleHideAndShowBook = async (bookID, method) => {
  const isConfirmed = await showConfirmation({
    text: method === "hide" ? "Sách này sẽ bị ẩn đi" : "Sách này sẽ được hiện ra",
  });
  if (isConfirmed.isConfirmed) {
    await HideAndShowBook(bookID, method);
  }
};

onMounted(() => {
  getBooks();
});
</script>
<style>
@import "datatables.net-bs5";
</style>
