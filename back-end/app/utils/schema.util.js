const yup = require("yup");

const supplierSchema = yup.object({
  name: yup.string().required("Tên nhà cung cấp là bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  address: yup.string().required("Địa chỉ nhà cung cấp là bắt buộc"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
});

const authorSchema = yup.object({
  name: yup.string().required("Tên tác giả là bắt buộc"),
  dob: yup.string().required("Ngày sinh là bắt buộc"),
});

const publisherSchema = yup.object({
  name: yup.string().required("Tên nhà xuất bản là bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  address: yup.string().required("Địa chỉ nhà xuất bản là bắt buộc"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
});

const bookSchema = yup.object({
  bookName: yup.string().required("Tên sách là bắt buộc"),
  authorName: yup.string().required("Tên tác giả là bắt buộc"),
  publisherName: yup.string().required("Tên nhà xuất bản là bắt buộc"),
  categoryName: yup.string().required("Tên danh mục là bắt buộc"),
  formalityName: yup.string().required("Tên hình thức là bắt buộc"),
  publisherYear: yup.number().typeError("Năm xuất bản phải là số").required("Năm xuất bản là bắt buộc"),
  weight: yup.number().typeError("Trọng lượng phải là số").required("Trọng lượng là bắt buộc"),
  pageNumber: yup.number().typeError("Số trang phải là số").required("Số trang là bắt buộc"),
  length: yup.number().typeError("Chiều dài phải là số").required("Chiều dài là bắt buộc"),
  width: yup.number().typeError("Chiều rộng phải là số").required("Chiều rộng là bắt buộc"),
  originalPrice: yup.number().typeError("Giá gốc phải là số").required("Giá gốc là bắt buộc"),
  discountPrice: yup.number().typeError("Giá khuyến mãi phải là số").required("Giá khuyến mãi là bắt buộc"),
  image: yup.string().required("Ảnh là bắt buộc"),
});

module.exports = {
  supplierSchema,
  authorSchema,
  publisherSchema,
  bookSchema,
};
