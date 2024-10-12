<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý danh mục
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Danh mục</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <ModalAddCategory @refreshCategories="getCategories" />
        <ModalUpdateCategory
          :categoryToEdit="editedCategory"
          @refreshCategories="getCategories"
        />
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <DataTable
                id="mytable"
                :columns="columns"
                :data="categories"
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
import JsZip from "jszip";
import { useRouter } from "vue-router";
window.JsZip = JsZip;
DataTable.use(DataTableLib);
DataTable.use(pdfmake);
DataTable.use(ButtonsHtml5);
import ModalAddCategory from "@/components/admin/modals/categories/ModalAddCategory.vue";
import ModalUpdateCategory from "@/components/admin/modals/categories/ModalUpdateCategory.vue";
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import { showConfirmation } from "@/utils/swalUtils";
import { toast } from "vue3-toastify";
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

export default {
  components: {
    DataTable,
    ModalAddCategory,
    ModalUpdateCategory,
  },
  setup() {
    const router = useRouter();
    const store = useMenu();
    store.onSelectedKeys(["admin-categories"]);
    const apiAdmin = new ApiAdmin();
    const editedCategory = ref({});
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
                    data-bs-target="#updateCategory" id="editCategory" class="badge text-bg-warning p-2" data-id=${data}>
                   <i class="fa-solid fa-pencil"></i> Edit
                </button>
            </div>
            <div class="">
                <button type="button" 
                    class="badge text-bg-danger p-2" id="deleteCategory" data-id=${data}>
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>
          </div>`;
        },
      },
    ];

    // const editedNxb = ref({});
    const categories = ref([]);
    const getCategories = async () => {
      const response = await apiAdmin.get("/categories");
      if (response.status === 200) {
        categories.value = response.data;
      }
    };

    $(document).on("click", "#editCategory", (event) => {
      let categoryID = $(event.currentTarget).data("id");
      const categoryToEdit = categories.value.find(
        (category) => category._id === categoryID
      );
      if (categoryToEdit) {
        editedCategory.value = { ...categoryToEdit };
      }
    });

    const deleteCategory = async (categoryID) => {
      try {
        const response = await apiAdmin.delete(`/categories/${categoryID}`);
        if (response.status === 200) {
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
          getCategories();
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    $(document).on("click", "#deleteCategory", async (event) => {
      const categoryID = $(event.currentTarget).data("id");
      const isConfirmed = await showConfirmation({
        title: "Bạn chắc chắn muốn xóa thể loại này",
      });
      if (isConfirmed.isConfirmed) {
        await deleteCategory(categoryID);
      }
    });

    onMounted(() => {
      getCategories();
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
      getCategories,
      categories,
      columns,
      editedCategory,
      buttons,
      language,
    };
  },
};
</script>
<style>
@import "datatables.net-bs5";
</style>
