import * as yup from "yup";
import moment from "moment";
export const registerUserSchema = yup.object({
  firstName: yup.string().required("Họ là bắt buộc"),
  lastName: yup.string().required("Tên là bắt buộc"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  otp: yup
    .string()
    .matches(/^\d{6}$/, "Mã OTP phải gồm 6 chữ số")
    .required("Mã OTP là bắt buộc"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải từ 8 ký tự"),
});

export const phoneLoginUserSchema = yup.object({
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải từ 8 ký tự"),
});

export const emailLoginUserSchema = yup.object({
  email: yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải từ 8 ký tự"),
});

export const forgotPasswordSchema = yup.object({
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  otp: yup
    .string()
    .matches(/^\d{6}$/, "Mã OTP phải gồm 6 chữ số")
    .required("Mã OTP là bắt buộc"),
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

export const updateUserSchema = yup.object({
  firstName: yup.string().required("Họ là bắt buộc"),
  lastName: yup.string().required("Tên là bắt buộc"),
  gender: yup.string().required("Giới tính là bắt buộc"),
  dob: yup.string().required("Ngày sinh là bắt buộc"),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required("Mật khẩu hiện tại là bắt buộc")
    .min(8, "Mật khẩu phải từ 8 ký tự"),
  newPassword: yup
    .string()
    .required("Mật khẩu mới là bắt buộc")
    .min(8, "Mật khẩu phải từ 8 ký tự"),
  cfNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải từ 8 ký tự"),
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

export const receiptAddproductSchema = yup.object({
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

export const addReceiptSchema = yup.object({
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

export const roleSchema = yup.object({
  name: yup.string().required("Tên quyền là bắt buộc"),
});

export const addAdminSchema = yup.object({
  firstName: yup.string().required("Họ là bắt buộc"),
  lastName: yup.string().required("Tên là bắt buộc"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  role: yup
    .string()
    .notOneOf([""], "Vui lòng chọn quyền")
    .required("Vui lòng chọn quyền"),
});

export const updateAdminSchema = yup.object({
  role: yup
    .string()
    .notOneOf([""], "Vui lòng chọn quyền")
    .required("Vui lòng chọn quyền"),
});

export const updateEmployeeSchema = yup.object({
  firstName: yup.string().required("Họ là bắt buộc"),
  lastName: yup.string().required("Tên là bắt buộc"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
});

export const bookSchema = yup.object({
  bookName: yup.string().required("Tên sách là bắt buộc"),
  authorName: yup.string().required("Tên tác giả là bắt buộc"),
  publisherName: yup.string().required("Tên nhà xuất bản là bắt buộc"),
  categoryName: yup.string().required("Tên danh mục là bắt buộc"),
  formalityName: yup.string().required("Tên hình thức là bắt buộc"),
  priceRangeName: yup.string().required("Tên khoản giá là bắt buộc"),
  publisherYear: yup
    .number()
    .typeError("Năm xuất bản phải là số")
    .min(1, "Năm xuất bản phải lớn hơn hoặc bằng 1")
    .required("Năm xuất bản là bắt buộc"),
  weight: yup
    .number()
    .typeError("Trọng lượng phải là số")
    .min(1, "Trọng lượng phải lớn hơn hoặc bằng 1")
    .required("Trọng lượng là bắt buộc"),
  pageNumber: yup
    .number()
    .typeError("Số trang phải là số")
    .min(1, "Số trang phải lớn hơn hoặc bằng 1")
    .required("Số trang là bắt buộc"),
  length: yup
    .number()
    .typeError("Chiều dài phải là số")
    .min(1, "Chiều dài phải lớn hơn hoặc bằng 1")
    .required("Chiều dài là bắt buộc"),
  width: yup
    .number()
    .typeError("Chiều rộng phải là số")
    .min(1, "Chiều rộng phải lớn hơn hoặc bằng 1")
    .required("Chiều rộng là bắt buộc"),
  originalPrice: yup
    .number()
    .typeError("Giá gốc phải là số")
    .min(1, "Giá gốc phải lớn hơn hoặc bằng 1")
    .required("Giá gốc là bắt buộc"),
  discountPrice: yup
    .number()
    .typeError("Giá khuyến mãi phải là số")
    .min(1, "Giá khuyến mãi phải lớn hơn hoặc bằng 1")
    .required("Giá khuyến mãi là bắt buộc"),
  images: yup.array().required("Ảnh là bắt buộc"),
});

export const updateBookSchema = yup.object({
  bookName: yup.string().required("Tên sách là bắt buộc"),
  authorName: yup.string().required("Tên tác giả là bắt buộc"),
  publisherName: yup.string().required("Tên nhà xuất bản là bắt buộc"),
  categoryName: yup.string().required("Tên danh mục là bắt buộc"),
  formalityName: yup.string().required("Tên hình thức là bắt buộc"),
  priceRangeName: yup.string().required("Tên khoản giá là bắt buộc"),
  publisherYear: yup
    .number()
    .typeError("Năm xuất bản phải là số")
    .min(1, "Năm xuất bản phải lớn hơn hoặc bằng 1")
    .required("Năm xuất bản là bắt buộc"),
  weight: yup
    .number()
    .typeError("Trọng lượng phải là số")
    .min(1, "Trọng lượng phải lớn hơn hoặc bằng 1")
    .required("Trọng lượng là bắt buộc"),
  pageNumber: yup
    .number()
    .typeError("Số trang phải là số")
    .min(1, "Số trang phải lớn hơn hoặc bằng 1")
    .required("Số trang là bắt buộc"),
  length: yup
    .number()
    .typeError("Chiều dài phải là số")
    .min(1, "Chiều dài phải lớn hơn hoặc bằng 1")
    .required("Chiều dài là bắt buộc"),
  width: yup
    .number()
    .typeError("Chiều rộng phải là số")
    .min(1, "Chiều rộng phải lớn hơn hoặc bằng 1")
    .required("Chiều rộng là bắt buộc"),
  originalPrice: yup
    .number()
    .typeError("Giá gốc phải là số")
    .min(1, "Giá gốc phải lớn hơn hoặc bằng 1")
    .required("Giá gốc là bắt buộc"),
  discountPrice: yup
    .number()
    .typeError("Giá khuyến mãi phải là số")
    .min(1, "Giá khuyến mãi phải lớn hơn hoặc bằng 1")
    .required("Giá khuyến mãi là bắt buộc"),
});

export const priceRangeSchema = yup.object({
  startPrice: yup
    .number()
    .typeError("Giá bắt đầu phải là số")
    .min(0, "Giá phải lớn hơn hoặc bằng 0")
    .required("Giá bắt đầu là bắt buộc"),
  endPrice: yup
    .number()
    .typeError("Giá kết thúc phải là số")
    .min(0, "Giá phải lớn hơn hoặc bằng 0")
    .required("Giá kết thúc là bắt buộc")
    .test(
      "is-greater-than-startPrice",
      "Giá kết thúc phải lớn hơn giá bắt đầu",
      function (value) {
        const { startPrice } = this.parent;
        return value > startPrice;
      }
    ),
});

export const addressSchema = yup.object({
  firstName: yup.string().required("Họ là bắt buộc"),
  lastName: yup.string().required("Tên là bắt buộc"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  province: yup
    .string()
    .notOneOf(["0"], "Vui lòng chọn tỉnh/thành phố") // Giá trị không phải là "0"
    .required("Vui lòng chọn tỉnh/thành phố"),
  district: yup
    .string()
    .notOneOf(["0"], "Vui lòng chọn quận/huyện") // Giá trị không phải là "0"
    .required("Vui lòng chọn quận/huyện"),
  ward: yup
    .string()
    .notOneOf(["0"], "Vui lòng chọn xã/phường") // Giá trị không phải là "0"
    .required("Vui lòng chọn xã/phường"),
  detailAddress: yup
    .string()
    .required("Thông tin này quan trọng.Vui lòng không để trống."),
});

// export const voucherCatgorySchema = yup.object({
//   discountType: yup
//     .string()
//     .oneOf(["percent", "amount"], "Kiểu giảm giá không hợp lệ")
//     .required("Loại giảm giá là bắt buộc"),
//   value: yup.number().when("discountType", {
//     is: "percent",
//     then: () =>
//       yup
//         .number()
//         .min(1, "Giá trị phải từ 1 đến 100")
//         .max(100, "Giá trị phải từ 1 đến 100")
//         .typeError("Giá trị phải là số")
//         .required("Giá trị là bắt buộc"),
//     otherwise: () =>
//       yup
//         .number()
//         .min(0, "Giá trị không được âm")
//         .typeError("Giá trị phải là số")
//         .required("Giá trị là bắt buộc"),
//   }),
//   minValue: yup
//     .number()
//     .min(0, "Giá trị tối thiểu không được âm")
//     .typeError("Giá trị phải là số")
//     .required("Giá trị tối thiểu là bắt buộc"),
//   maxValue: yup
//     .number()
//     .required("Giá giảm tối đa là bắt buộc")
//     .min(0, "Giá giảm tối đa phải lớn hơn hoặc bằng 0")
//     .typeError("Giá giảm tối đa phải là số"),
// });
export const voucherCatgorySchema = yup
  .object({
    discountType: yup
      .string()
      .oneOf(["percent", "amount"], "Kiểu giảm giá không hợp lệ")
      .required("Loại giảm giá là bắt buộc"),
    value: yup.number().when("discountType", {
      is: "percent",
      then: () =>
        yup
          .number()
          .min(1, "Giá trị phải từ 1 đến 100")
          .max(100, "Giá trị phải từ 1 đến 100")
          .typeError("Giá trị phải là số")
          .required("Giá trị là bắt buộc"),
      otherwise: () =>
        yup
          .number()
          .min(0, "Giá trị không được âm")
          .typeError("Giá trị phải là số")
          .required("Giá trị là bắt buộc"),
    }),
    minValue: yup
      .number()
      .min(0, "Giá trị tối thiểu không được âm")
      .typeError("Giá trị phải là số")
      .required("Giá trị tối thiểu là bắt buộc"),
    maxValue: yup
      .number()
      .required("Giá giảm tối đa là bắt buộc")
      .min(0, "Giá giảm tối đa phải lớn hơn hoặc bằng 0")
      .typeError("Giá giảm tối đa phải là số"),
  })
  .test("value-equals-maxValue", function (values) {
    const { discountType, value, maxValue } = values;

    // Custom error message for specific fields
    if (discountType === "amount" && value !== maxValue) {
      // Trả về lỗi cho cả value và maxValue
      return this.createError({
        path: "value",
        message: `Giá trị phải bằng Giá trị tối đa.`
      }) || this.createError({
        path: "maxValue",
        message: `Giá trị tối đa phải bằng Giá trị`
      });
    }
    return true; 
  });

export const voucherSchema = yup.object().shape({
  voucherCategoryID: yup.string().required("Loại giảm giá là bắt buộc"),

  quantity: yup
    .number()
    .required("Số lượng là bắt buộc")
    .min(0, "Số lượng phải lớn hơn hoặc bằng 0")
    .typeError("Số lượng phải là số"),

  startDate: yup
    .string()
    .required("Ngày bắt đầu là bắt buộc")
    .test("is-valid-date", "Ngày bắt đầu không hợp lệ", (value) => {
      return moment(value, "DD/MM/YYYY", true).isValid();
    }),

  endDate: yup
    .string()
    .required("Ngày kết thúc là bắt buộc")
    .test("is-valid-date", "Ngày kết thúc không hợp lệ", (value) => {
      return moment(value, "DD/MM/YYYY", true).isValid();
    })
    .test(
      "end-date-after-start-date",
      "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu",
      function (endDate) {
        const { startDate } = this.parent;
        const isValidStartDate = moment(
          startDate,
          "DD/MM/YYYY",
          true
        ).isValid();
        return isValidStartDate
          ? moment(endDate, "DD/MM/YYYY", true).isSameOrAfter(
              moment(startDate, "DD/MM/YYYY", true)
            )
          : true;
      }
    ),
});
