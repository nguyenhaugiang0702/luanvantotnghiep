<template>
  <h4>THÔNG TIN TÀI KHOẢN</h4>
  <form @submit.prevent="updateUser" :validation-schema="updateUserSchema">
    <div class="form-group row mt-5">
      <label for="firstName" class="col-3">Họ*</label>
      <div class="col-8">
        <!-- <input
          type="text"
          v-model="user.firstName"
          :class="{
            'form-control border': true,
            'border-danger': errors.firstName,
            'border-success': !errors.firstName && user.firstName !== '',
          }"
          id="firstName"
          name="firstName"
          placeholder="Nhập họ"
        /> -->
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

    <div class="form-group row mt-4">
      <label for="lastName" class="col-3">Tên*</label>
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
    <div class="form-group row mt-4">
      <label for="phoneNumber" class="col-3">Số điện thoại</label>
      <div class="col-8">
        <Field
          type="tel"
          :class="{
            'form-control': true,
            'is-invalid': errors.phoneNumber,
            'is-valid': !errors.phoneNumber && user.phoneNumber !== '',
          }"
          id="phoneNumber"
          name="phoneNumber"
          placeholder="nhap so dien thoai"
          v-model="user.phoneNumber"
        />
        <ErrorMessage class="invalid-feedback" name="phoneNumber" />
      </div>
    </div>
    <div class="form-group row mt-4">
      <label for="email" class="col-3">Email</label>
      <div class="col-8">
        <Field
          type="email"
          :class="{
            'form-control': true,
            'is-invalid': errors.email,
            'is-valid': !errors.email && user.email !== '',
          }"
          id="email"
          v-model="user.email"
          name="email"
          placeholder="Địa chỉ email"
        />
        <ErrorMessage class="invalid-feedback" name="email" />
      </div>
    </div>
    <div class="form-group row mt-4">
      <label class="col-3">Giới tính*</label><br />
      <div class="col-8">
        <div class="row">
          <div class="col-3">
            <div class="form-check">
              <Field
                type="radio"
                class="form-check-input"
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
          <div class="col-3">
            <div class="form-check">
              <Field
                type="radio"
                class="form-check-input"
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
            <ErrorMessage class="invalid-feedback" name="gender" />
          </div>
        </div>
      </div>
    </div>
    <div class="form-group row mt-4">
      <label for="birthday" class="col-3">Birthday*</label>
      <div class="col-8">
        <div class="row">
          <div class="col">
            <Field
              type="text"
              :class="{
                'form-control': true,
                'is-invalid': errors.dayOfBirthday,
                'is-valid': !errors.dayOfBirthday && user.dayOfBirthday !== '',
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
        <div class="row">
          <ErrorMessage class="invalid-feedback" name="dayOfBirthday" />
          <ErrorMessage class="invalid-feedback" name="monthOfBirthday" />
          <ErrorMessage class="invalid-feedback" name="yearOfBirthday" />
        </div>
      </div>
    </div>

    <div class="form-group row mt-4">
      <span class="col-3"></span>
      <div class="col-8">
        <input
          @click="handleShowPasswordSection"
          class="form-check-input me-2 border border-dark"
          v-model="showPasswordSection"
          type="checkbox"
          id="invalidCheck3"
          aria-describedby="invalidCheck3Feedback"
        />
        <label class="col-8"> Đổi mật khẩu</label>
      </div>
    </div>

    <div
      class="password-section"
      id="passwordSection"
      v-if="showPasswordSection"
    >
      <div class="form-group row mt-4">
        <label for="currentPassword" class="col-3">Mật khẩu hiện tại*</label>
        <div class="col-8">
          <Field
            type="password"
            :class="{
              'form-control': true,
              'is-invalid':
                errors.cfNewPassword && user.changePassword.isChanged,
              'is-valid':
                !errors.currentPassword &&
                user.changePassword.isChanged &&
                user.changePassword.currentPassword !== '',
            }"
            id="currentPassword"
            placeholder="Mật khẩu hiện tại"
            name="currentPassword"
            v-model="user.changePassword.currentPassword"
          />
          <ErrorMessage class="invalid-feedback" name="currentPassword" />
        </div>
      </div>
      <div class="form-group row mt-4">
        <label for="newPassword" class="col-3">Mật khẩu mới*</label>
        <div class="col-8">
          <Field
            type="password"
            :class="{
              'form-control': true,
              'is-invalid':
                errors.cfNewPassword && user.changePassword.isChanged,
              'is-valid':
                !errors.newPassword &&
                user.changePassword.isChanged &&
                user.changePassword.newPassword !== '',
            }"
            id="newPassword"
            placeholder="Mật khẩu mới"
            name="newPassword"
            v-model="user.changePassword.newPassword"
          />
          <ErrorMessage class="invalid-feedback" name="newPassword" />
        </div>
      </div>
      <div class="form-group row mt-4">
        <label for="cfNewPassword" class="col-3">Nhập lại mật khẩu mới*</label>
        <div class="col-8">
          <Field
            type="password"
            :class="{
              'form-control': true,
              'is-invalid':
                errors.cfNewPassword && user.changePassword.isChanged,
              'is-valid':
                !errors.cfNewPassword &&
                user.changePassword.isChanged &&
                user.changePassword.cfNewPassword !== '',
            }"
            id="cfNewPassword"
            name="cfNewPassword"
            placeholder="Nhập lại mật khẩu mới"
            v-model="user.changePassword.cfNewPassword"
          />
          <ErrorMessage class="invalid-feedback" name="cfNewPassword" />
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <button type="submit" class="btn btn-primary mt-4 col-3 text-center">
        Lưu thay đổi
      </button>
    </div>
  </form>
</template>

<script>
import { ref, onMounted } from "vue";
import Cookies from "js-cookie";
import ApiService from "@/service/ApiService";
import { toast } from "vue3-toastify";
import validation from "@/utils/validate.util";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { updateUserSchema } from "@/utils/schema.util";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const showPasswordSection = ref(false);
    const handleShowPasswordSection = () => {
      showPasswordSection.value = !showPasswordSection.value;
      user.value.changePassword.isChanged = showPasswordSection.value;
    };
    const token = Cookies.get("accessToken");
    const api = new ApiService();
    const user = ref({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      gender: "",
      dayOfBirthday: "",
      monthOfBirthday: "",
      yearOfBirthday: "",
      changePassword: {
        isChanged: false,
        currentPassword: "",
        newPassword: "",
        cfNewPassword: "",
      },
    });

    const { errors, validate } = useForm({
      validationSchema: updateUserSchema,
      initialValues: user.value,
    });

    const errorsValidate = ref({});

    // const errors = ref({
    //   firstName: "",
    //   lastName: "",
    //   phoneNumber: "",
    //   email: "",
    //   gender: "",
    //   dayOfBirthday: "",
    //   monthOfBirthday: "",
    //   yearOfBirthday: "",
    //   changePassword: {
    //     isChanged: "",
    //     currentPassword: "",
    //     newPassword: "",
    //     cfNewPassword: "",
    //   },
    // });

    const getUser = async () => {
      const response = await api.get(`/users/${token}`);
      if (response?.status === 200) {
        // user.value = response.data;
        Object.assign(user.value, response.data);
      }
    };

    const updateUser = async () => {
      // const validationErrors = validation.validateUpdateUser(user.value);
      // if (Object.keys(validationErrors).length > 0) {
      //   errors.value = validationErrors;
      //   return;
      // }
      const { valid, errors } = await validate();
      if (!valid) {
        errorsValidate.value = errors;
        return;
      }

      const response = await api.put(`/users/${token}`);
      if (response?.status === 200) {
        toast("Cập nhật thành công", {
          theme: "auto",
          type: "success",
          dangerouslyHTMLString: true,
        });
        getUser();
      }
    };

    onMounted(() => {
      getUser();
    });

    return {
      showPasswordSection,
      user,
      updateUser,
      errors,
      handleShowPasswordSection,
    };
  },
};
</script>
