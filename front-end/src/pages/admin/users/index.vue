<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý người dùng
    </a-layout-header>
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
                <thead>
                  <tr >
                    <th class="text-start">#</th>
                    <th class="text-start">Tên</th>
                    <th class="text-start">Giới Tính</th>
                    <th class="text-start">Số Điện Thoại</th>
                    <th class="text-start">Email</th>
                    <th class="text-start">Ngày Sinh</th>
                    <th class="text-start">Trạng Thái</th>
                    <!-- <th>Tạo</th>
                    <th>Cập nhật</th> -->
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
            return `<div style="color: green; font-weight: 650;">Đã kích hoạt<div>`;
          } else {
            return `<div style="color: red; font-weight: 650;">Đã Khóa</div>`;
          }
        },
      },
      {
        data: "_id",
        render: (data, type, row, meta) => {
          if (row.isActive == 1) {
            return `
          <div class="btn-group">
  <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Action
  </button>
  <ul class="dropdown-menu">
    <li id="deletuser" data-id=${data} ><a class="dropdown-item" href="#">
      <i style="color: red" class="fa-solid fa-trash"></i> Xóa tài khoản
      </a></li>
    <li id="blockuser" data-id=${data}><a class="dropdown-item" href="#"><i class="fa-solid fa-lock"></i> Khóa tài khoản</a></li>
  </ul>
</div>
          `;
          } else if (row.isActive == 2) {
            return `
          <div class="btn-group">
  <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Action
  </button>
  <ul class="dropdown-menu">
    <li id="deletuser" data-id=${data} ><a class="dropdown-item" href="#">
      <i style="color: red" class="fa-solid fa-trash"></i> Xóa tài khoản
      </a></li>
    <li id="unblockuser" data-id=${data}><a class="dropdown-item" href="#"><i class="fa-solid fa-unlock"></i> Mở khóa</a></li>
  </ul>
</div>
          `;
          }
          return `
          <div class="btn-group">
  <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Action
  </button>
  <ul class="dropdown-menu">
    <li id="deletuser" data-id=${data} ><a class="dropdown-item" href="#">
      <i style="color: red" class="fa-solid fa-trash"></i> Xóa tài khoản
      </a></li>
  </ul>
</div>
          `;
        },
      },
    ];
    const users = ref([]);

    const getUsers = async () => {
      const response = await apiAdmin.get("/users");
      if (response.status == 200) {
        users.value = response.data;
      }
    };

    const deletuser = async (userID) => {
      const token = Cookies.get("accessToken");
      const response = await apiAdmin.delete(`/users/${userID}`, token);
      if (response.status == 200) {
        await showSuccess({
          text: "Dữ liệu đã được xóa thành công.",
        });
        getUsers();
      }
    };

    const blockUser = async (userID) => {
      const token = Cookies.get("accessToken");
      const response = await apiAdmin.put(`/users/blockAccount/${userID}`, token);
      if (response.status == 200) {
        await showSuccess({
          text: "Người dùng đã bị khóa",
        });
        getUsers();
      }
    };

    const unBlockUser = async (userID) => {
      const token = Cookies.get("accessToken");
      const response = await apiAdmin.put(`/users/unBlockAccount/${userID}`, token);
      if (response.status == 200) {
        await showSuccess({
          text: "Người dùng đã được mở khóa",
        });
        getUsers();
      }
    };

    $(document).on("click", "#deletuser", async (event) => {
      const userId = $(event.currentTarget).data("id");
      await showConfirmation({
        text: "Người dùng này sẽ bị xóa!",
      }).then((result) => {
        if (result.isConfirmed) {
          deletuser(userId);
        }
      });
    });

    $(document).on("click", "#blockuser", async (event) => {
      const userId = $(event.currentTarget).data("id");
      await showConfirmation({
        text: "Người dùng này sẽ bị khóa !",
      }).then((result) => {
        if (result.isConfirmed) {
          blockUser(userId);
        }
      });
    });

    $(document).on("click", "#unblockuser", async (event) => {
      const userId = $(event.currentTarget).data("id");
      await showConfirmation({
        text: "Người dùng này sẽ đuợc mở khóa !",
      }).then((result) => {
        if (result.isConfirmed) {
          unBlockUser(userId);
        }
      });
    });

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
    };
  },
});
</script>
<style>
@import "datatables.net-bs5";
</style>
