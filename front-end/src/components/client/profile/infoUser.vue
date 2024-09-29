<template>
  <div class="container bg-white pb-3">
    <h4 class="p-3">THÔNG TIN TÀI KHOẢN</h4>
    <form @submit.prevent="updateUser" :validation-schema="updateUserSchema">
      <div class="d-flex flex-column flex-md-row">
        <div class="col-12 col-md-3 text-center my-auto">
          <i
            v-if="!user.avatar"
            class="fa-solid fa-user avt icon-avatar pt-4"
          ></i>
          <img
            v-else
            :src="`http://localhost:3000/` + user.avatar"
            alt=""
            class="avt"
          />
          <input type="file" class="my-4 mx-2" @change="handleChangeFile" />
        </div>
        <div class="col-12 col-md-9">
          <div class="form-group row mx-2">
            <label for="firstName" class="col-3">Họ</label>
            <div class="col-8">
              <Field
                type="text"
                v-model="user.firstName"
                :class="{
                  'form-control': true,
                  'is-invalid': errors.firstName,
                  'is-valid': !errors.firstName && user.firstName !== '',
                }"
                id="firstName"
                name="firstName"
                placeholder="Nhập họ"
              />
              <ErrorMessage class="invalid-feedback" name="firstName" />
            </div>
          </div>

          <div class="form-group row mt-4 mx-2">
            <label for="lastName" class="col-3">Tên</label>
            <div class="col-8">
              <Field
                type="text"
                v-model="user.lastName"
                :class="{
                  'form-control': true,
                  'is-invalid': errors.lastName,
                  'is-valid': !errors.lastName && user.lastName !== '',
                }"
                id="lastName"
                placeholder="Nhập tên"
                name="lastName"
              />
              <ErrorMessage class="invalid-feedback" name="lastName" />
            </div>
          </div>
          <div class="form-group row mt-4 mx-2">
            <label for="phoneNumber" class="col-3">Số điện thoại</label>
            <div class="col-8">
              <div class="row">
                <div class="col-9">
                  <Field
                    type="tel"
                    :class="{
                      'form-control': true,
                      'is-invalid': errors.phoneNumber,
                      'is-valid':
                        !errors.phoneNumber && user.phoneNumber !== '',
                    }"
                    id="phoneNumber"
                    readonly
                    name="phoneNumber"
                    placeholder="nhap so dien thoai"
                    v-model="user.phoneNumber"
                  />
                  <ErrorMessage class="invalid-feedback" name="phoneNumber" />
                </div>
                <div class="col-3">
                  <ChangPhoneNumber @refreshUser="getUser" />
                </div>
              </div>
            </div>
          </div>

          <div class="form-group row mt-4 mx-2">
            <label for="email" class="col-3">Email</label>
            <div class="col-8">
              <div class="row">
                <div class="col-9">
                  <Field
                    type="email"
                    :class="{
                      'form-control': true,
                      'is-invalid': errors.email,
                      'is-valid': !errors.email && user.email !== '',
                    }"
                    id="email"
                    v-model="user.email"
                    readonly
                    name="email"
                    placeholder="Địa chỉ email"
                  />
                  <ErrorMessage class="invalid-feedback" name="email" />
                </div>
                <div class="col-3">
                  <ChangeEmail @refreshUser="getUser" />
                </div>
              </div>
            </div>
          </div>
          <div class="form-group row mt-4 mx-2">
            <label class="col-3">Giới tính*</label><br />
            <div class="col-8">
              <div class="row">
                <div class="col-2">
                  <div class="form-check">
                    <Field
                      type="radio"
                      class="form-check-input"
                      :class="{
                        'is-invalid': errors.gender,
                        'is-valid': !errors.gender && user.gender !== '',
                      }"
                      id="validationFormCheck1"
                      name="gender"
                      value="male"
                      v-model="user.gender"
                    />
                    <label class="form-check-label" for="validationFormCheck2"
                      >Nam</label
                    >
                  </div>
                </div>
                <div class="col-2">
                  <div class="form-check">
                    <Field
                      type="radio"
                      class="form-check-input"
                      :class="{
                        'is-invalid': errors.gender,
                        'is-valid': !errors.gender && user.gender !== '',
                      }"
                      id="validationFormCheck2"
                      name="gender"
                      value="female"
                      v-model="user.gender"
                    />
                    <label class="form-check-label" for="validationFormCheck2"
                      >Nữ</label
                    >
                  </div>
                </div>
                <div class="col-8">
                  <ErrorMessage
                    class="invalid-feedback d-block"
                    name="gender"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="form-group row mt-4 mx-2">
            <label for="birthday" class="col-3">Birthday*</label>
            <div class="col-8">
              <div class="row">
                <div class="col">
                  <Field
                    type="text"
                    :class="{
                      'form-control': true,
                      'is-invalid': errors.dayOfBirthday,
                      'is-valid':
                        !errors.dayOfBirthday && user.dayOfBirthday !== '',
                    }"
                    placeholder="DD"
                    name="dayOfBirthday"
                    v-model="user.dayOfBirthday"
                  />
                </div>
                <div class="col">
                  <Field
                    type="text"
                    :class="{
                      'form-control': true,
                      'is-invalid': errors.monthOfBirthday,
                      'is-valid':
                        !errors.monthOfBirthday && user.monthOfBirthday !== '',
                    }"
                    placeholder="MM"
                    name="monthOfBirthday"
                    v-model="user.monthOfBirthday"
                  />
                </div>
                <div class="col">
                  <Field
                    type="text"
                    :class="{
                      'form-control': true,
                      'is-invalid': errors.yearOfBirthday,
                      'is-valid':
                        !errors.yearOfBirthday && user.yearOfBirthday !== '',
                    }"
                    placeholder="YYYY"
                    name="yearOfBirthday"
                    v-model="user.yearOfBirthday"
                  />
                </div>
              </div>
              <div class="row mx-2">
                <ErrorMessage
                  class="invalid-feedback d-block"
                  name="dayOfBirthday"
                />
                <ErrorMessage
                  class="invalid-feedback d-block"
                  name="monthOfBirthday"
                />
                <ErrorMessage
                  class="invalid-feedback d-block"
                  name="yearOfBirthday"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-center">
        <button
          type="submit"
          class="btn btn-primary mt-4 col-3 text-center"
          :disabled="isLoadingUpdate"
        >
          <span
            v-if="isLoadingUpdate"
            class="spinner-border spinner-border-sm text-white"
            role="status"
            aria-hidden="true"
          ></span>
          <span class="text-white" v-else> Lưu thay đổi </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Cookies from "js-cookie";
import ApiService from "@/service/ApiService";
import { toast } from "vue3-toastify";
import validation from "@/utils/validate.util";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { updateUserSchema } from "@/utils/schema.util";
import ChangPhoneNumber from "../modals/ChangPhoneNumber.vue";
import ChangeEmail from "../modals/ChangeEmail.vue";

import UserService from "@/service/user.service";
import moment from "moment";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    ChangPhoneNumber,
    ChangeEmail,
  },
  setup() {
    const token = Cookies.get("accessToken");
    const userService = new UserService();
    const image = ref(null);
    const user = ref({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      gender: "",
      dayOfBirthday: "",
      monthOfBirthday: "",
      yearOfBirthday: "",
      avatar: "",
    });
    const isLoadingUpdate = ref(false);

    const { errors, validate, validateField } = useForm({
      validationSchema: updateUserSchema,
    });

    const getUser = async () => {
      const response = await userService.get("/getInfoUser");
      if (response?.status === 200) {
        const dobMoment = moment(response.data.dob, "DD/MM/YYYY");
        user.value.dayOfBirthday = dobMoment.date(); // Ngày
        user.value.monthOfBirthday = dobMoment.month() + 1; // Tháng (cần +1 vì month() trả về giá trị 0-11)
        user.value.yearOfBirthday = dobMoment.year(); // Năm
        Object.assign(user.value, response.data);
      }
    };

    const handleChangeFile = (event) => {
      image.value = event.target.files[0];
    };

    const updateUser = async () => {
      try {
        isLoadingUpdate.value = true;

        const { valid } = await validate();
        if (!valid) {
          return;
        }

        // Định dạng ngày sinh
        const dob = moment({
          day: user.value.dayOfBirthday,
          month: user.value.monthOfBirthday - 1, // Month is zero-indexed in moment.js
          year: user.value.yearOfBirthday,
        }).format("DD/MM/YYYY");
        console.log(dob);
        // Thêm dob vào formData trước
        // Kiểm tra nếu người dùng đã chọn file avatar
        const formData = new FormData();
        formData.append("fileType", "avatar");
        if (image.value) {
          formData.append("avatar", image.value); // Thêm tệp ảnh
        }
        formData.append("dob", dob);
        // Dùng vòng lặp để thêm các thuộc tính khác vào formData
        Object.keys(user.value).forEach((key) => {
          if (
            key !== "dayOfBirthday" &&
            key !== "monthOfBirthday" &&
            key !== "yearOfBirthday" &&
            key !== "email" &&
            key !== "phoneNumber" &&
            key !== "dob"
          ) {
            formData.append(key, user.value[key]);
          }
        });
        const response = await userService.put("/updateProfile/", formData);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (response?.status === 200) {
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
          getUser();
          image.value = null;
        }
      } catch (error) {
        toast(error.response?.data?.message, {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      } finally {
        isLoadingUpdate.value = false;
      }
    };

    onMounted(() => {
      getUser();
    });

    return {
      user,
      updateUser,
      errors,
      isLoadingUpdate,
      getUser,
      image,
      handleChangeFile,
    };
  },
};
</script>
<style scoped>
.icon-avatar {
  font-size: 8rem;
}

.avt {
  width: 12rem;
  height: 12rem;
  border-radius: 50%;
  border: 2px solid #000;
  object-fit: contain;
}

/* Avatar nằm giữa khi màn hình nhỏ */
@media (max-width: 768px) {
  .icon-avatar,
  .avt {
    margin: 0 auto;
  }
}
</style>
