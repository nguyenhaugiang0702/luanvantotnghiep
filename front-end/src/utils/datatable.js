// Cấu hình bỏ cột thao tác trong bảng
export const exportOptions = {
  columns: ":not(:last-child)",
};

// Cấu hình các nút xuất dữ liệu
export const buttons = [
  {
    extend: "copy",
    exportOptions: exportOptions,
    bom: true,
  },
  {
    extend: "csv",
    exportOptions: exportOptions,
    bom: true,
  },
  {
    extend: "pdf",
    exportOptions: exportOptions,
    bom: true,
  },
  {
    extend: "print",
    exportOptions: exportOptions,
    bom: true,
  },
];

// Cấu hình ngôn ngữ cho DataTable
export const language = {
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
