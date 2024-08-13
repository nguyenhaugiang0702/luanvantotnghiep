import * as yup from "yup";

export const updateUserSchema = yup.object({
  firstName: yup.string().required("Họ là bắt buộc"),
  lastName: yup.string().required("Tên là bắt buộc"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại là bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  gender: yup.string().required("Giới tính là bắt buộc"),
  dayOfBirthday: yup
    .number()
    .min(1, "Ngày không hợp lệ")
    .max(31, "Ngày không hợp lệ")
    .required("Ngày sinh là bắt buộc"),
  monthOfBirthday: yup
    .number()
    .min(1, "Tháng không hợp lệ")
    .max(12, "Tháng không hợp lệ")
    .required("Tháng sinh là bắt buộc"),
  yearOfBirthday: yup
    .number()
    .min(1900, "Năm không hợp lệ")
    .max(new Date().getFullYear(), "Năm không hợp lệ")
    .required("Năm sinh là bắt buộc"),
//   changePassword: yup.object().shape({
//     currentPassword: yup.string().when("isChanged", {
//       is: true,
//       then: yup.string().required("Mật khẩu hiện tại là bắt buộc"),
//     }),
//     newPassword: yup.string().when("isChanged", {
//       is: true,
//       then: yup.string().required("Mật khẩu mới là bắt buộc"),
//     }),
//     cfNewPassword: yup.string()
//       .oneOf([yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
//       .when("isChanged", {
//         is: true,
//         then: yup.string().required("Mật khẩu xác nhận là bắt buộc"),
//       }),
//   }),
    currentPassword: yup.string().required("Mật khẩu hiện tại là bắt buộc"),
    newPassword: yup.string().required("Mật khẩu mới là bắt buộc"),
    cfNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
      .required("Xác nhận mật khẩu là bắt buộc"),
});

export const updateTeacherSchema = yup.object().shape({
  admin_id: yup
    .number()
    .required("Vui lòng nhập ID")
    .typeError("ID phải là số"),
  admin_name: yup
    .string()
    .required("Vui lòng nhập tên người dùng")
    .min(5, "Tên phải ít nhất 5 ký tự")
    .max(50, "Tên có tối đa 50 ký tự"),
  admin_email: yup
    .string()
    .required("Vui lòng nhập E-mail")
    .email("E-mail không đúng.")
    .max(50, "E-mail tối đa 50 ký tự."),
});

export const questionSchema = yup.object().shape({
  question_name: yup.string().required("Vui lòng nhập tên câu hỏi"),
  options: yup.array().of(
    yup.object().shape({
      answer: yup.string().required("Vui lòng nhập đáp án"),
    })
  ),
});

export const changePasswordSchema = yup.object().shape({
  admin_password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải từ 8 ký tự"),
  confirm_admin_password: yup
    .string()
    .oneOf([yup.ref("admin_password"), null], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải từ 8 ký tự"),
});

export const loginSchema = yup.object().shape({
  admin_id: yup
    .number()
    .required("Vui lòng nhập ID")
    .typeError("ID phải là số"),
  admin_email: yup
    .string()
    .required("Vui lòng nhập E-mail")
    .email("E-mail không đúng.")
    .max(50, "E-mail tối đa 50 ký tự."),
  admin_password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải từ 8 ký tự"),
});

export const forgotPasswordSchema = yup.object().shape({
  admin_email: yup
    .string()
    .required("Vui lòng nhập E-mail")
    .email("E-mail không đúng.")
    .max(50, "E-mail tối đa 50 ký tự."),
});
