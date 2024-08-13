import { toast } from "vue3-toastify";

const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^0\d{9}$/;
  if (!phoneNumber) {
    toast("Số điện thoại không được để trống", {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
    return false;
  }
  if (!phoneRegex.test(phoneNumber)) {
    toast("Số điện thoại không hợp lệ", {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
    return false;
  }

  return true;
};

const validateOTP = (otp) => {
  if (!otp) {
    toast("Mã OTP không được để trống", {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
    return false;
  }

  const otpRegex = /^\d{6}$/;
  if (!otpRegex.test(otp)) {
    toast("Mã OTP phải gồm 6 chữ số", {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
    return false;
  }

  return true;
};

const validatePassword = (password) => {
  if (!password) {
    toast("Mật khẩu không được để trống", {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
    return false;
  }

  if (password.length !== 8) {
    toast("Mật khẩu phải gồm 8 ký tự", {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
    return false;
  }

  return true;
};

const validateUpdateUser = (userData) => {
  let errors = {};
  if (!userData.firstName) {
    toast("Họ không được để trống", {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
    errors.firstName = "Họ không được để trống";
  }

  if (!userData.lastName) {
    toast("Tên không được để trống", {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
    errors.lastName = "Tên không được để trống";
  }

  const phoneRegex = /^0\d{9}$/;
  if (!userData.phoneNumber) {
    errors.phoneNumber = "Số điện thoại không được để trống";
  }
  if (!phoneRegex.test(userData.phoneNumber)) {
    errors.phoneNumber = "Số điện thoại không hợp lệ";
  }

  if (!userData.email) {
    errors.email = "Email không được để trống";
  }

  if (!userData.gender || (userData.gender !== "male" && userData.gender !== "female")) {
    errors.gender = "Vui lòng chọn giới tính.";
  }

  if (!userData.dayOfBirthday || !/^\d{2}$/.test(userData.dayOfBirthday)) {
    errors.dayOfBirthday = "Ngày sinh không hợp lệ.";
  }
  if (!userData.monthOfBirthday || !/^\d{2}$/.test(userData.monthOfBirthday)) {
    errors.monthOfBirthday = "Tháng sinh không hợp lệ.";
  }
  if (!userData.yearOfBirthday || !/^\d{4}$/.test(userData.yearOfBirthday)) {
    errors.yearOfBirthday = "Năm sinh không hợp lệ.";
  }

  if (userData.changePassword && userData.changePassword.isChanged) {
    if (!userData.changePassword.currentPassword) {
      errors.currentPassword = "Mật khẩu không được để trống";
    }
    if (!userData.changePassword.currentPassword.length < 8) {
      errors.currentPassword = "Mật khẩu phải từ 8 ký tự";
    }

    if (!userData.changePassword.newPassword) {
      errors.newPassword = "Mật khẩu mới không được để trống";
    }
    if (!userData.changePassword.newPassword.length < 8) {
      errors.newPassword = "Mật khẩu mới phải từ 8 ký tự";
    }

    if (!userData.changePassword.cfNewPassword) {
      errors.cfNewPassword = "Xác nhận mật khẩu mới không được để trống";
    }
    if (!userData.changePassword.cfNewPassword.length < 8) {
      errors.cfNewPassword = "Xác nhận mật khẩu phải từ 8 ký tự";
    }

    if (
      userData.changePassword.cfNewPassword !==
      userData.changePassword.newPassword
    ) {
      errors.cfNewPassword = "Kiểm tra lại mật khẩu";
    }
  }

  return errors;
};

export default {
  validatePhoneNumber,
  validateOTP,
  validatePassword,
  validateUpdateUser,
};
