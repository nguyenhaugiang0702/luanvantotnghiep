import moment from "moment";

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

// Cấu hình các nút xuất dữ liệu
export const buttonsReceiptDetail = (createdAt) => [
  {
    extend: "copy",
    bom: true,
    text: "Sao chép",
    title: () => {
      const formattedDate = moment(createdAt).format("DD-MM-YYYY");
      return `Danh sách chi tiết phiếu nhập - ${formattedDate}`;
    },
    customize: (csv) => {
      const formattedDate = moment(createdAt).format("DD-MM-YYYY HH:mm:ss");
      const dateLine = `Ngày nhập: ${formattedDate}\n`;
      return dateLine + csv;
    },
  },
  {
    extend: "csv",
    bom: true,
    text: "Xuất CSV",
    title: () => {
      const formattedDate = moment(createdAt).format("DD-MM-YYYY");
      return `Danh sách chi tiết phiếu nhập - ${formattedDate}`;
    },
    customize: (csv) => {
      const formattedDate = moment(createdAt).format("DD-MM-YYYY HH:mm:ss");
      const dateLine = `Ngày nhập: ${formattedDate}\n`;
      return dateLine + csv;
    },
  },
  {
    extend: "pdf",
    bom: true,
    text: "Xuất PDF",
    title: () => {
      const formattedDate = moment(createdAt).format("DD-MM-YYYY");
      return `Danh sách chi tiết phiếu nhập - ${formattedDate}`;
    },
    customize: (doc) => {
      const formattedDateTime = moment(createdAt).format("DD-MM-YYYY HH:mm:ss");
      doc.content.splice(0, 0, {
        text: `Ngày nhập: ${formattedDateTime}`,
        margin: [0, 0, 0, 12],
        alignment: "left",
      });
    },
  },
  {
    extend: "print",
    bom: true,
    text: "In",
    title: () => {
      const formattedDate = moment(createdAt).format("DD-MM-YYYY");
      return `Danh sách chi tiết phiếu nhập - ${formattedDate}`;
    },
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
