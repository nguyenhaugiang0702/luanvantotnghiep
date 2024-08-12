import * as yup from "yup";

export const subjectSchema = yup.object().shape({
  subject_name: yup
    .string()
    .required("Vui lòng nhập tên môn học")
    .min(5, "Tên phải ít nhất 5 ký tự")
    .max(50, "Tên có tối đa 50 ký tự"),
  subject_code: yup
    .string()
    .required("Vui lòng nhập mã môn học")
    .min(5, "Mã phải ít nhất 5 ký tự")
    .max(10, "Mã có tối đa 10 ký tự"),
});

export const createTeacherSchema = yup.object().shape({
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
  admin_password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải ít nhất 8 ký tự")
    .max(50, "Mật khẩu tối đa 50 ký tự"),
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

export const signUpSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .min(10, "Số điện thoại không hợp lệ")
    .max(10, "Số điện thoại không hợp lệ"),
  otp: yup
    .string()
    .required("Vui lòng nhập mã OTP để tiếp tục")
    .max(6, "Mã OTP tối đa 6 ký tự"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải từ 6 ký tự"),
});

export const forgotPasswordSchema = yup.object().shape({
  admin_email: yup
    .string()
    .required("Vui lòng nhập E-mail")
    .email("E-mail không đúng.")
    .max(50, "E-mail tối đa 50 ký tự."),
});
