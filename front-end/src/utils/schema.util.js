import * as yup from "yup";

export const updateUserSchema = yup.object({
  firstName: yup.string().required("Họ là bắt buộc"),
  lastName: yup.string().required("Tên là bắt buộc"),
  phoneNumber: yup.string(),
  email: yup.string().email("Địa chỉ email không hợp lệ"),
  gender: yup.string().required("Giới tính là bắt buộc"),
  dayOfBirthday: yup
    .number("Ngày sinh phải là số")
    .typeError("Ngày sinh phải là số")
    .required("Ngày sinh là bắt buộc")
    .min(1, "Ngày không hợp lệ")
    .max(31, "Ngày không hợp lệ"),
  monthOfBirthday: yup
    .number("Tháng sinh phải là số")
    .typeError("Ngày sinh phải là số")
    .required("Tháng sinh là bắt buộc")
    .min(1, "Tháng không hợp lệ")
    .max(12, "Tháng không hợp lệ"),
  yearOfBirthday: yup
    .number("Năm sinh phải là số")
    .typeError("Ngày sinh phải là số")
    .required("Năm sinh là bắt buộc")
    .min(1900, "Năm không hợp lệ")
    .max(new Date().getFullYear(), "Năm không hợp lệ"),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("Mật khẩu hiện tại là bắt buộc"),
  newPassword: yup.string().required("Mật khẩu mới là bắt buộc"),
  cfNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
});

export const changePhoneNumberSchema = yup.object({
  newPhoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),

  otpSMS: yup
    .string()
    .matches(/^\d{6}$/, "Mã OTP phải gồm 6 chữ số")
    .required("Mã OTP không được để trống"),
});

export const changeEmailSchema = yup.object({
  otpEmail: yup
    .string()
    .matches(/^\d{6}$/, "Mã OTP phải gồm 6 chữ số")
    .required("Mã OTP không được để trống"),

  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
});

export const supllierSchema = yup.object({
  name: yup.string().required("Tên nhà cung cấp là bắt buộc"),

  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  address: yup.string().required("Địa chỉ nhà cung cấp là bắt buộc"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
});

export const publisherSchema = yup.object({
  name: yup.string().required("Tên nhà xuất bản là bắt buộc"),

  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  address: yup.string().required("Địa chỉ nhà xuất bản là bắt buộc"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
});

export const receiptSchema = yup.object({
  supplierName: yup.string().required("Tên nhà cung cấp là bắt buộc"),

  bookName: yup.string().required("Tên sách là bắt buộc"),
  quantity: yup
    .number("Số lượng phải là số")
    .typeError("Số lượng phải là số")
    .required("Số lượng là bắt buộc")
    .min(1, "Số lượng không nhỏ hơn 1"),
  price: yup
    .number("Giá phải là số")
    .typeError("Giá phải là số")
    .required("Giá là bắt buộc")
    .min(1, "Giá không nhỏ hơn 1"),
});

export const authorSchema = yup.object({
  authorName: yup.string().required("Tên nhà cung cấp là bắt buộc"),

  authorDob: yup.string().required("Ngày sinh là bắt buộc"),
});

export const categorySchema = yup.object({
  name: yup.string().required("Tên danh mục là bắt buộc"),
});

export const formalitySchema = yup.object({
  name: yup.string().required("Tên hình thức là bắt buộc"),
});

export const bookSchema = yup.object({
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
  images: yup.array().required('Ảnh là bắt buộc')
  
});

export const updateBookSchema = yup.object({
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
});

