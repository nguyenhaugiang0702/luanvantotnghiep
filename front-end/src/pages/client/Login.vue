<template>
  <div class="container-fluid bg-primary py-4">
    <div class="container text-white">
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-start"
      >
        <div class="d-flex flex-column mb-3 mb-md-0">
          <div class="fw-bold text-uppercase fs-5">Đăng nhập</div>
          <div>Chào mừng bạn đến với NHG BOOKSTORE</div>
        </div>
        <div class="align-self-md-center">
          <span @click="handleNavigate(router, 'home')">Trang chủ </span>
          <span>/ Đăng nhập</span>
        </div>
      </div>
    </div>
  </div>
  <section>
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-xl-10">
          <div class="card" style="border-radius: 1rem">
            <div class="row g-0" style="padding-bottom: 22rem">
              <div class="col-md-6 col-lg-4 d-none d-md-block">
                <img
                  src="../../assets/images/logo1.png"
                  alt="login form"
                  class="img-fluid logo-login"
                  style="border-radius: 1rem; max-width: 100%; height: auto"
                />
              </div>
              <div class="col-md-6 col-lg-8 d-flex align-items-center">
                <div class="card-body p-4 p-lg-5 text-black">
                  <form @submit.prevent="Login">
                    <div class="d-flex align-items-center mb-3 pb-1">
                      <span class="h2 fw-bold mb-0"
                        >Chào mừng đến với NHG BOOKSTORE</span
                      >
                    </div>

                    <h5 class="h3 fw-bold my-3" style="letter-spacing: 1px">
                      Đăng nhập
                    </h5>
                    <div class="form-group mb-3">
                      <label class="form-label">Đăng nhập bằng</label>
                      <div>
                        <input
                          type="radio"
                          id="loginPhone"
                          value="phone"
                          v-model="loginMethod"
                          class="me-2"
                        />
                        <label for="loginPhone" class="me-3"
                          >Số điện thoại</label
                        >
                        <input
                          type="radio"
                          id="loginEmail"
                          value="email"
                          v-model="loginMethod"
                          class="me-2"
                        />
                        <label for="loginEmail">Email</label>
                      </div>
                    </div>

                    <!-- Conditionally render phone number input -->
                    <div v-if="loginMethod === 'phone'" class="form-group mb-3">
                      <label class="form-label" for="phoneNumber"
                        >Số điện thoại</label
                      >
                      <Field
                        type="text"
                        class="form-control"
                        placeholder="Nhập số điện thoại"
                        name="phoneNumber"
                        :class="{
                          'is-invalid': errors.phoneNumber,
                          'is-valid':
                            !errors.phoneNumber && user.phoneNumber !== '',
                        }"
                        v-model="user.phoneNumber"
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        class="invalid-feedback"
                      />
                    </div>

                    <!-- Conditionally render email input -->
                    <div v-if="loginMethod === 'email'" class="form-group mb-3">
                      <label class="form-label" for="email">Email</label>
                      <Field
                        type="text"
                        class="form-control"
                        placeholder="Nhập email"
                        name="email"
                        :class="{
                          'is-invalid': errors.email,
                          'is-valid': !errors.email && user.email !== '',
                        }"
                        v-model="user.email"
                      />
                      <ErrorMessage name="email" class="invalid-feedback" />
                    </div>

                    <div class="form-group mb-3">
                      <label class="form-label" for="password">Mật khẩu</label>
                      <Field
                        type="password"
                        name="password"
                        class="form-control"
                        placeholder="Nhập mật khẩu"
                        :class="{
                          'is-invalid': errors.password,
                          'is-valid': !errors.password && user.password !== '',
                        }"
                        v-model="user.password"
                      />
                      <ErrorMessage name="password" class="invalid-feedback" />
                    </div>

                    <div class="pt-1 mb-3">
                      <button type="submit" class="btn btn-primary col-md-3">
                        <span
                          v-if="isLoading"
                          class="spinner-border spinner-border-sm text-white"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span class="text-white" v-else> Đăng nhập </span>
                      </button>
                    </div>

                    <router-link
                      class="small text-muted"
                      :to="{ name: 'forgotPassword' }"
                      >Quên mật khẩu?</router-link
                    >
                    <p class="mb-5" style="color: #393f81">
                      Bạn chưa có tài khoản?
                      <router-link
                        :to="{ name: 'register' }"
                        style="color: #393f81"
                        >Đăng ký</router-link
                      >
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { useRouter } from "vue-router";
import ApiUser from "@/service/user/apiUser.service";
import {
  phoneLoginUserSchema,
  emailLoginUserSchema,
} from "@/utils/schema.util";
import Cookies from "js-cookie";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
const loginMethod = ref("phone");

const { errors, validate, resetForm } = useForm({
  validationSchema: computed(() => {
    return loginMethod.value === "phone"
      ? phoneLoginUserSchema
      : emailLoginUserSchema;
  }),
});
const apiUser = new ApiUser();
const isLoading = ref(false);
const router = useRouter();
const user = ref({
  phoneNumber: "",
  password: "",
  email: "",
});

watch(loginMethod, () => {
  resetForm();
});

const Login = async () => {
  const { valid } = await validate();
  if (!valid) {
    return;
  }
  try {
    isLoading.value = true;
    const loginData =
      loginMethod.value === "phone"
        ? {
            phoneNumber: user.value.phoneNumber,
            password: user.value.password,
            loginMethod: "phone",
          }
        : {
            email: user.value.email,
            password: user.value.password,
            loginMethod: "email",
          };
    const response = await apiUser.post("/auth/login", loginData);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (response.status == 200) {
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      const isLoggedIn = response.data.isLoggedIn;
      Cookies.set("accessToken", accessToken);
      Cookies.set("refreshToken", refreshToken);
      Cookies.set("isLoggedIn", isLoggedIn);
      router.push({ name: "profile" });
      window.location.href = "/customer/account/edit/";
    }
  } catch (error) {
    console.log(error);
    showErrorToast(error.response?.data?.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.logo-login {
  position: relative;
  top: 9rem;
}
</style>
