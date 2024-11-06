<template>
  <div>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Quyền</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <ModalAddRole @refreshRoles="getRoles" />
        <ModalUpdateRole :roleToEdit="editedRole" @refreshRoles="getRoles" />
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <DataTable
                id="mytable"
                :columns="columns"
                :data="roles"
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
                        @click="handleUpdateRole(props.rowData._id)"
                        data-bs-toggle="modal"
                        data-bs-target="#updateRole"
                        id="editRole"
                        class="badge text-bg-warning p-2"
                      >
                        <i class="fa-solid fa-pencil"></i> Edit
                      </button>
                    </div>
                    <div class="">
                      <button
                        type="button"
                        @click="handleDeleteRole(props.rowData._id)"
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
import { ref, onMounted, nextTick } from "vue";
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
import ModalAddRole from "@/components/admin/modals/role-management/roleList/ModalAddRole.vue";
import ModalUpdateRole from "@/components/admin/modals/role-management/roleList/ModalUpdateRole.vue";
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import { showConfirmation } from "@/utils/swalUtils";
import { toast } from "vue3-toastify";
import "datatables.net-responsive-bs5";
import "datatables.net-select-bs5";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import { buttons, language } from "@/utils/datatable";

export default {
  components: {
    DataTable,
    ModalAddRole,
    ModalUpdateRole,
  },
  setup() {
    const router = useRouter();
    const store = useMenu();
    store.onSelectedKeys(["admin-role-management-list"]);
    const apiAdmin = new ApiAdmin();
    const editedRole = ref({});
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
        render: "#action",
        title: "Thao tác",
      },
    ];

    // const editedNxb = ref({});
    const roles = ref([]);
    const getRoles = async () => {
      const response = await apiAdmin.get("/roles");
      if (response.status === 200) {
        roles.value = response.data;
      }
    };
    const handleUpdateRole = (roleID) => {
      const roleToEdit = roles.value.find((role) => role._id === roleID);
      if (roleToEdit) {
        editedRole.value = { ...roleToEdit };
      }
    };

    const deleteRole = async (roleID) => {
      try {
        const response = await apiAdmin.delete(`/roles/${roleID}`);
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          getRoles();
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };
    const handleDeleteRole = async (roleID) => {
      const isConfirmed = await showConfirmation({
        text: "Quyền này sẽ bị xóa đi",
      });
      if (isConfirmed.isConfirmed) {
        await deleteRole(roleID);
        console.log(roleID);
      }
    };

    onMounted(() => {
      getRoles();
    });

    return {
      getRoles,
      roles,
      columns,
      editedRole,
      buttons,
      language,
      handleUpdateRole,
      handleDeleteRole,
    };
  },
};
</script>
<style>
@import "datatables.net-bs5";
</style>
