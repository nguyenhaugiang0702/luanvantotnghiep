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

export default {
  validatePhoneNumber,
  validateOTP,
  validatePassword,
};
