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
          <input
            type="file"
            ref="fileInput"
            class="my-4 mx-2"
            @change="handleChangeFile"
          />
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
            <label class="col-3">Giới tính</label><br />
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
                      value="Nam"
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
                      value="Nữ"
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
            <label for="birthday" class="col-3">Ngày sinh</label>
            <div class="col-8">
              <div class="col">
                <Field
                  type="text"
                  id="formatDOB"
                  :class="{
                    'form-control': true,
                    'is-invalid': errors.dob,
                    'is-valid': !errors.dob && user.dob !== '',
                  }"
                  placeholder="DD/MM/YYYY || ngày/tháng/năm"
                  name="dob"
                  v-model="user.dob"
                />
                <ErrorMessage class="invalid-feedback" name="dob" />
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
import { toast } from "vue3-toastify";
import validation from "@/utils/validate.util";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { updateUserSchema } from "@/utils/schema.util";
import ChangPhoneNumber from "../modals/ChangPhoneNumber.vue";
import ChangeEmail from "../modals/ChangeEmail.vue";
import ApiUser from "@/service/user/apiUser.service";
import moment from "moment";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

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
    const apiUser = new ApiUser();
    const image = ref("");
    const user = ref({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      gender: "",
      dob: "",
      avatar: "",
    });
    const isLoadingUpdate = ref(false);
    const fileInput = ref(null);
    const datepickerRef = ref(null);

    const { errors, validate, validateField } = useForm({
      validationSchema: updateUserSchema,
    });

    const getUser = async () => {
      const response = await apiUser.get("/profile/getInfoUser");
      if (response?.status === 200) {
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
        const formData = new FormData();
        formData.append("fileType", "avatar");
        if (image.value) {
          formData.append("avatar", image.value); // Thêm tệp ảnh
        }
        // Dùng vòng lặp để thêm các thuộc tính khác vào formData
        Object.keys(user.value).forEach((key) => {
          if (key !== "email" && key !== "phoneNumber") {
            formData.append(key, user.value[key]);
          }
        });
        const response = await apiUser.put(
          "/profile/updateProfile/",
          formData,
          "multipart/form-data"
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (response?.status === 200) {
          showSuccessToast(response?.data?.message);
          getUser();
          image.value = "";
          fileInput.value.value = "";
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      } finally {
        isLoadingUpdate.value = false;
      }
    };

    onMounted(() => {
      getUser();
      flatpickr("#formatDOB", {
        dateFormat: "d/m/Y",
      });
    });

    return {
      user,
      updateUser,
      errors,
      isLoadingUpdate,
      getUser,
      image,
      handleChangeFile,
      fileInput,
      datepickerRef,
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
