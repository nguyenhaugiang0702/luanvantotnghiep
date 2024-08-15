import * as yup from "yup";

// export const updateUserSchema = yup.object({
//   firstName: yup.string().required("Họ là bắt buộc"),
//   lastName: yup.string().required("Tên là bắt buộc"),
//   // phoneNumber: yup
//   //   .string()
//   //   .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ")
//   //   .required("Số điện thoại là bắt buộc"),
//   // email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
//   gender: yup.string().required("Giới tính là bắt buộc"),
//   dayOfBirthday: yup
//     .number("Ngày sinh phải là số")
//     .transform((value, originalValue) => (originalValue === "" ? null : value))
//     .required("Ngày sinh là bắt buộc")
//     .min(1, "Ngày không hợp lệ")
//     .max(31, "Ngày không hợp lệ"),
//   monthOfBirthday: yup
//     .number("Tháng sinh phải là số")
//     .transform((value, originalValue) => (originalValue === "" ? null : value))
//     .required("Tháng sinh là bắt buộc")
//     .min(1, "Tháng không hợp lệ")
//     .max(12, "Tháng không hợp lệ"),
//   yearOfBirthday: yup
//     .number("Năm sinh phải là số")
//     .transform((value, originalValue) => (originalValue === "" ? null : value))
//     .required("Năm sinh là bắt buộc")
//     .min(1900, "Năm không hợp lệ")
//     .max(new Date().getFullYear(), "Năm không hợp lệ"),
//   currentPassword: yup.string().required("Mật khẩu hiện tại là bắt buộc"),
//   newPassword: yup.string().required("Mật khẩu mới là bắt buộc"),
//   cfNewPassword: yup
//     .string()
//     .oneOf([yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
//     .required("Xác nhận mật khẩu là bắt buộc"),
// currentPassword: yup.string().when('changePassword.isChanged', {
//   is: true,
//   then: yup.string().required("Mật khẩu hiện tại là bắt buộc"),
//   otherwise: yup.string().notRequired()
// }),
// newPassword: yup.string().when('changePassword.isChanged', {
//   is: true,
//   then: yup.string().required("Mật khẩu mới là bắt buộc"),
//   otherwise: yup.string().notRequired()
// }),
// cfNewPassword: yup.string().when('changePassword.isChanged', {
//   is: true,
//   then: yup.string()
//     .oneOf([yup.ref('changePassword.newPassword'), null], "Mật khẩu xác nhận không khớp")
//     .required("Xác nhận mật khẩu là bắt buộc"),
//   otherwise: yup.string().notRequired()
// })
// });
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

  otp: yup
    .string()
    .matches(/^\d{6}$/, "Mã OTP phải gồm 6 chữ số")
    .required("Mã OTP không được để trống"),

  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
});
