const yup = require("yup");

const registerUserSchema = yup.object({
  firstName: yup.string().required("Họ là bắt buộc"),
  lastName: yup.string().required("Tên là bắt buộc"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phair từ 8 ký tự"),
});

const loginUserSchema = yup.object({
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phair từ 8 ký tự"),
});

const forgotPasswordSchema = yup.object({
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải từ 8 ký tự"),
  cfpassword: yup
    .string()
    .required("Xác nhận mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải từ 8 ký tự")
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp"),
});

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
  name: yup.string().required("Tên sách là bắt buộc"),
  categoryID: yup.string().required("Danh mục là bắt buộc"),
  publisherID: yup.string().required("Nhà xuất bản là bắt buộc"),
  authorID: yup.string().required("Tác giả là bắt buộc"),
  formalityID: yup.string().required("Hình thức là bắt buộc"),
  description: yup.string().required("Mô tả là bắt buộc"),
  detail: yup.object({
    publisherYear: yup
      .number()
      .typeError("Năm xuất bản phải là số")
      .required("Năm xuất bản là bắt buộc"),
    weight: yup
      .number()
      .typeError("Trọng lượng phải là số")
      .required("Trọng lượng là bắt buộc"),
    pageNumber: yup
      .number()
      .typeError("Số trang phải là số")
      .required("Số trang là bắt buộc"),
    length: yup
      .number()
      .typeError("Chiều dài phải là số")
      .required("Chiều dài là bắt buộc"),
    width: yup
      .number()
      .typeError("Chiều rộng phải là số")
      .required("Chiều rộng là bắt buộc"),
    originalPrice: yup
      .number()
      .typeError("Giá gốc phải là số")
      .required("Giá gốc là bắt buộc"),
    discountPrice: yup
      .number()
      .typeError("Giá khuyến mãi phải là số")
      .required("Giá khuyến mãi là bắt buộc"),
  }),
  images: yup
    .array()
    .of(yup.mixed().required("Ảnh là bắt buộc"))
    .min(1, "Cần ít nhất một ảnh"),
});

const updateBookSchema = yup.object({
  name: yup.string().required("Tên sách là bắt buộc"),
  categoryID: yup.string().required("Danh mục là bắt buộc"),
  publisherID: yup.string().required("Nhà xuất bản là bắt buộc"),
  authorID: yup.string().required("Tác giả là bắt buộc"),
  formalityID: yup.string().required("Hình thức là bắt buộc"),
  description: yup.string().required("Mô tả là bắt buộc"),
  detail: yup.object({
    publisherYear: yup
      .number()
      .typeError("Năm xuất bản phải là số")
      .required("Năm xuất bản là bắt buộc"),
    weight: yup
      .number()
      .typeError("Trọng lượng phải là số")
      .required("Trọng lượng là bắt buộc"),
    pageNumber: yup
      .number()
      .typeError("Số trang phải là số")
      .required("Số trang là bắt buộc"),
    length: yup
      .number()
      .typeError("Chiều dài phải là số")
      .required("Chiều dài là bắt buộc"),
    width: yup
      .number()
      .typeError("Chiều rộng phải là số")
      .required("Chiều rộng là bắt buộc"),
    originalPrice: yup
      .number()
      .typeError("Giá gốc phải là số")
      .required("Giá gốc là bắt buộc"),
    discountPrice: yup
      .number()
      .typeError("Giá khuyến mãi phải là số")
      .required("Giá khuyến mãi là bắt buộc"),
  }),
});

const priceRangeSchema = yup.object({
  startPrice: yup
    .number()
    .typeError("Giá bắt đầu phải là số")
    .required("Giá bắt đầu là bắt buộc"),
  endPrice: yup
    .number()
    .typeError("Giá kết thúc phải là số")
    .required("Giá kết thúc là bắt buộc"),
});

const addressSchema = yup.object({
  firstName: yup.string().required("Họ là bắt buộc"),
  lastName: yup.string().required("Tên là bắt buộc"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  province: yup.string().required("Tên tỉnh là bắt buộc"),
  district: yup.string().required("Tên quận/huyện là bắt buộc"),
  ward: yup.string().required("Tên xã là bắt buộc"),
  detailAddress: yup
    .string()
    .required("Thông tin này quan trọng.Vui lòng không để trống."),
});

module.exports = {
  supplierSchema,
  authorSchema,
  publisherSchema,
  bookSchema,
  updateBookSchema,
  priceRangeSchema,
  addressSchema,
  registerUserSchema,
  loginUserSchema,
  forgotPasswordSchema
};
