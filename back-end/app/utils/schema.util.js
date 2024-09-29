const yup = require("yup");

// Schema Register
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

// Schema Login
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

// Schema Fogot Password
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

// Schema Change Password
const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required("Mật khẩu hiện tại là bắt buộc")
    .min(8, "Mật khẩu phair từ 8 ký tự"),
  newPassword: yup
    .string()
    .required("Mật khẩu mới là bắt buộc")
    .min(8, "Mật khẩu phair từ 8 ký tự"),
  cfNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phair từ 8 ký tự"),
});

// Schema Update User
const updateUserSchema = yup.object({
  firstName: yup.string().required("Họ là bắt buộc"),
  lastName: yup.string().required("Tên là bắt buộc"),
  gender: yup.string().required("Giới tính là bắt buộc"),
  dob: yup.string().required("Ngày sinh là bắt buộc"),
});

// Schema Address
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

// Schema Order
const orderSchema = yup.object().shape({
  addressID: yup.string().required("Cần nhập mã địa chỉ"), // Chuỗi, bắt buộc
  detail: yup
    .array()
    .of(
      yup.object().shape({
        bookID: yup.string().required("Cần nhập mã sách"), // Chuỗi, bắt buộc
        quantity: yup
          .number()
          .required("Cần nhập số lượng") // Số nguyên >= 1, bắt buộc
          .min(1, "Số lượng phải lớn hơn hoặc bằng 1")
          .typeError("Số lượng phải là một số nguyên."),
        realPrice: yup
          .number()
          .typeError("Số lượng phải là một số nguyên.")
          .min(0, "Giá phải lớn hơn hoặc bằng 0")
          .required("Cần nhập giá sách"), // Số >= 0, bắt buộc
      })
    )
    .required("Cần nhập thông tin chi tiết đơn hàng"), // Mảng các object, bắt buộc
  totalPrice: yup
    .number()
    .typeError("Số lượng phải là một số nguyên.")
    .min(0, "Tổng giá trị phải lớn hơn hoặc bằng 0")
    .required("Cần nhập tổng giá trị đơn hàng"), // Tổng giá trị >= 0, bắt buộc
  totalQuantity: yup
    .number()
    .typeError("Số lượng phải là một số nguyên.")
    .min(1, "Tổng số lượng phải lớn hơn hoặc bằng 1")
    .required("Cần nhập tổng số lượng"), // Tổng số lượng >= 1, bắt buộc
  notes: yup.string().optional(), // Chuỗi, không bắt buộc
  payment: yup
    .string()
    .oneOf(["COD", "online"], "Hình thức thanh toán phải là COD hoặc online")
    .required("Cần nhập phương thức thanh toán"), // Chuỗi, chỉ được là 'COD' hoặc 'online', bắt buộc
});

// Schema Supplier
const supplierSchema = yup.object({
  name: yup.string().required("Tên nhà cung cấp là bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  address: yup.string().required("Địa chỉ nhà cung cấp là bắt buộc"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
});

// Schema Author
const authorSchema = yup.object({
  name: yup.string().required("Tên tác giả là bắt buộc"),
  dob: yup.string().required("Ngày sinh là bắt buộc"),
});

// Schema Publisher
const publisherSchema = yup.object({
  name: yup.string().required("Tên nhà xuất bản là bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  address: yup.string().required("Địa chỉ nhà xuất bản là bắt buộc"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
});

// Schema Book
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

// Schema Update Book
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

// Schema Price Range
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
  forgotPasswordSchema,
  changePasswordSchema,
  updateUserSchema,
  orderSchema,
};
