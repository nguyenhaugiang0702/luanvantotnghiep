const {MongoDBCollectionNamespace}=require("mongodb")
const yup = require("yup");

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

module.exports = {
  supplierSchema,
  authorSchema
};
