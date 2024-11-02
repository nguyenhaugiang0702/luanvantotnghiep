<template>
  <div>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Người dùng</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <DataTable
                id="mytable"
                :columns="columns"
                :data="users"
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
                    <div v-if="props.rowData.isActive === 1" class="me-3">
                      <button
                        type="button"
                        @click="
                          handleBlockAndUnBlockUser(props.rowData._id, (method = 'block'))
                        "
                        class="badge text-bg-warning p-2"
                      >
                        <i class="fa-solid fa-lock"></i> Block
                      </button>
                    </div>
                    <div v-else-if="props.rowData.isActive === 2" class="me-3">
                      <button
                        type="button"
                        @click="
                          handleBlockAndUnBlockUser(
                            props.rowData._id,
                            (method = 'unblock')
                          )
                        "
                        class="badge text-bg-warning p-2"
                      >
                        <i class="fa-solid fa-lock-open"></i> UnBlock
                      </button>
                    </div>
                    <div class="me-3">
                      <button
                        @click="handleDeleteUser(props.rowData._id)"
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
                    <th class="text-start">Giới Tính</th>
                    <th class="text-start">Số Điện Thoại</th>
                    <th class="text-start">Email</th>
                    <th class="text-start">Ngày Sinh</th>
                    <th class="text-start">Trạng Thái</th>
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
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import { showErrorToast, showSuccessToast } from "@/utils/toast.util";

export default defineComponent({
  components: {
    DataTable,
  },
  setup() {
    const router = useRouter();
    const store = useMenu();
    store.onSelectedKeys(["admin-users"]);
    const apiAdmin = new ApiAdmin();
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
        data: "gender",
        render: (data) => {
          if (!data) {
            return `<div class="text-start">Chưa biết</div>`;
          }
          if (data === "male") {
            data = "Nam";
            return `<div class="text-start">${data}</div>`;
          } else {
            data = "Nữ";
            return `<div class="text-start">${data}</div>`;
          }
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
        data: "dob",
        render: (data, type, row, meta) => {
          if (!data) {
            return `<div class="text-start">Chưa biết</div>`;
          }
          return `<div class="text-start">${data}</div>`;
        },
      },
      {
        data: "isActive",
        render: (data, type, row, meta) => {
          if (data <= 0) {
            return `<div>Chưa kích hoạt</div>`;
          } else if (data == 1) {
            return `<div class='text-start badge text-bg-success p-2'>Đã kích hoạt<div>`;
          } else {
            return `<div class='text-start badge text-bg-danger p-2'>Đã Khóa</div>`;
          }
        },
      },
      {
        data: "_id",
        render: "#action",
        title: "Thao tác",
      },
    ];
    const users = ref([]);

    const getUsers = async () => {
      const response = await apiAdmin.get("/users");
      if (response.status == 200) {
        users.value = response.data;
      }
    };

    // Block And UnBlock
    const blockAndUnBlockUser = async (userID, method) => {
      let response;
      try {
        if (method === "block") {
          response = await apiAdmin.put(`/users/blockAccount/${userID}`, { isActive: 2 });
        } else {
          response = await apiAdmin.put(`/users/unBlockAccount/${userID}`, {
            isActive: 1,
          });
        }
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          await getUsers();
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    const handleBlockAndUnBlockUser = async (userID, method) => {
      const isConfirmed = await showConfirmation({
        text:
          method === "block"
            ? "Tài khoản này sẽ bị khóa"
            : "Tài khoản này sẽ được mở khóa",
      });
      if (isConfirmed.isConfirmed) {
        await blockAndUnBlockUser(userID, method);
      }
    };
    // End Block And UnBlock

    // Delete User
    const deletUser = async (userID) => {
      try {
        const response = await apiAdmin.delete(`/users/${userID}`);
        if (response.status == 200) {
          showSuccessToast(response?.data?.message);
          getUsers();
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    const handleDeleteUser = async (userID) => {
      const isConfirmed = await showConfirmation({
        text: "Người dùng này sẽ bi xóa khỏi hệ thống",
      });
      if (isConfirmed.isConfirmed) {
        await deletUser(userID);
      }
    };
    // End Delete User

    onMounted(() => {
      getUsers();
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
      getUsers,
      columns,
      users,
      buttons,
      exportOptions,
      language,
      handleBlockAndUnBlockUser,
      handleDeleteUser,
    };
  },
});
</script>
<style>
@import "datatables.net-bs5";
</style>
