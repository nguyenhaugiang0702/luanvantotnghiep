<template>
  <div>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Phân quyền</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <div class="row">
          <div class="col-12">
            <ModalAddAdmin @refreshEmployee="getAdmins" />
            <ModalUpdateAdmin
              :adminToEdit="editedAdmin"
              @refreshEmployee="getAdmins"
            />
            <ModalResetPasswordAdmin
              :adminToEdit="editedAdmin"
              @refreshEmployee="getAdmins"
            />
            <div class="table-responsive">
              <DataTable
                id="mytable"
                :columns="columns"
                :data="admins"
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
                        @click="handleUpdateAdmin(props.rowData._id)"
                        data-bs-toggle="modal"
                        data-bs-target="#updateAdmin"
                        id="editRole"
                        class="badge text-bg-warning p-2"
                      >
                        <i class="fa-solid fa-pencil"></i> Edit
                      </button>
                    </div>
                    <div class="me-3">
                      <button
                        @click="handleUpdateAdmin(props.rowData._id)"
                        data-bs-toggle="modal"
                        data-bs-target="#resetPassword"
                        id="editRole"
                        class="badge text-bg-info p-2"
                      >
                        <i class="fa-solid fa-lock"></i> Reset Password
                      </button>
                    </div>
                    <div class="">
                      <button
                        type="button"
                        @click="handleDeleteAdmin(props.rowData._id)"
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
                    <th class="text-start">Số Điện Thoại</th>
                    <th class="text-start">Email</th>
                    <th class="text-start">Quyền</th>
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
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
import JsZip from "jszip";
window.JsZip = JsZip;
DataTable.use(DataTableLib);
DataTable.use(pdfmake);
DataTable.use(ButtonsHtml5);
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import { showSuccess, showConfirmation } from "@/utils/swalUtils";
import ApiAdmin from "../../../service/admin/apiAdmin.service.js";
import ModalAddAdmin from "../../../components/admin/modals/role-management/roleListEmployee/ModalAddAdmin.vue";
import ModalUpdateAdmin from "../../../components/admin/modals/role-management/roleListEmployee/ModalUpdateAdmin.vue";
import ModalResetPasswordAdmin from "../../../components/admin/modals/role-management/roleListEmployee/ModalResetPassword.vue";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import { buttons, language } from "@/utils/datatable";

export default defineComponent({
  components: {
    DataTable,
    ModalAddAdmin,
    ModalUpdateAdmin,
    ModalResetPasswordAdmin,
  },
  setup() {
    const router = useRouter();
    const store = useMenu();
    store.onSelectedKeys(["admin-role-management-employee"]);
    const apiAdmin = new ApiAdmin();
    const editedAdmin = ref({});
    const columns = [
      {
        data: null,
        render: (data, type, row, meta) => {
          return `<div class="text-start">${meta.row + 1}</div>`;
        },
      },
      {
        data: null,
        render: (data, type, row, meta) => {
          return `<div class="text-start">${row.firstName} ${row.lastName}</div>`;
        },
      },
      {
        data: "phoneNumber",
        render: (data, type, row, meta) => {
          return `<div class="text-start">${data}</div>`;
        },
      },
      {
        data: "email",
        render: (data, type, row, meta) => {
          if (!data) {
            return `<div class="text-start">Chưa biết</div>`;
          }
          return `<div class="text-start">${data}</div>`;
        },
      },
      {
        data: "role",
        render: (data, type, row, meta) => {
          return `<div class="text-start">${data ? data : "Chưa biết"}</div>`;
        },
      },
      {
        data: "_id",
        render: "#action",
        title: "Thao tác",
      },
    ];
    const admins = ref([]);

    const getAdmins = async () => {
      const response = await apiAdmin.get("/admins");
      if (response.status == 200) {
        admins.value = response.data;
      }
    };

    const handleUpdateAdmin = (adminID) => {
      const adminToEdit = admins.value.find((admin) => admin._id === adminID);
      if (adminToEdit) {
        editedAdmin.value = { ...adminToEdit };
      }
    };

    const deletAdmin = async (adminID) => {
      try {
        const response = await apiAdmin.delete(`/admins/${adminID}`);
        if (response.status == 200) {
          showSuccessToast(response?.data?.message);
          getAdmins();
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    const handleDeleteAdmin = async (adminID) => {
      const isConfirmed = await showConfirmation({
        text: "Nhân viên này sẽ bị xóa",
      });
      if (isConfirmed.isConfirmed) {
        await deletAdmin(adminID);
      }
    };

    onMounted(() => {
      getAdmins();
    });

    return {
      getAdmins,
      columns,
      admins,
      buttons,
      language,
      editedAdmin,
      handleUpdateAdmin,
      handleDeleteAdmin,
    };
  },
});
</script>
<style>
@import "datatables.net-bs5";
</style>
