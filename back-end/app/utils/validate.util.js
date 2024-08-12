const moment = require("moment-timezone");
const userService = require("../services/user.service");
class ValidateService {
  async validateSignUp(data) {
    let errors = [];
    const phoneRegex = /^0\d{9}$/;
    if (!data.phoneNumber || !phoneRegex.test(data.phoneNumber)) {
      errors.push("Số điện thoại không hợp lệ.");
    }

    // // Kiểm tra họ tên
    // if (!data.firstName) {
    //   errors.push("Họ không được để trống.");
    // }
    // if (!data.lastName) {
    //   errors.push("Tên không được để trống.");
    // }

    // // Kiểm tra giới tính
    // if (!data.gender) {
    //   errors.push("Giới tính không được để trống.");
    // }

    // Kiểm tra email
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // if (!data.email) {
    //   errors.push("Email không được để trống.");
    // } else if (!emailRegex.test(data.email)) {
    //   errors.push("Email không hợp lệ.");
    // }

    // Kiểm tra password
    // const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/;
    // if (!data.password || !passwordRegex.test(data.password)) {
    //   errors.push("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ, số và ký tự đặc biệt.");
    // }
    if (!data.password || data.password.length < 8) {
      errors.push("Mật khẩu phải có ít nhất 8 ký tự.");
    }

    // Kiểm tra ngày sinh
    // if (!data.dob || !moment(data.dob, "DD/MM/YYYY", true).isValid()) {
    //   errors.push("Ngày sinh phải có định dạng DD/MM/YYYY.");
    // }

    // const emailExists = await userService.checkEmailExist(data.email);
    // if (emailExists) {
    //   errors.push("Email đã tồn tại.");
    // }

    const phoneExists = await userService.checkPhoneNumberExist(
      data.phoneNumber
    );
    if (phoneExists) {
      errors.push("Số điện thoại đã tồn tại.");
    }

    return errors;
  }
}

module.exports = ValidateService;
