<template>
  <div class="container-fluid bg-primary py-4">
    <div class="container text-white">
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-start"
      >
        <div class="d-flex flex-column mb-3 mb-md-0">
          <div class="fw-bold text-uppercase fs-5">Đăng ký</div>
          <div>Chào mừng bạn đến với NHG BOOKSTORE</div>
        </div>
        <div class="align-self-md-center">
          <span @click="handleNavigate(router, 'home')">Trang chủ </span>
          <span>/ Đăng ký</span>
        </div>
      </div>
    </div>
  </div>
  <section>
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-xl-10">
          <div class="card" style="border-radius: 1rem">
            <div class="row g-0" style="padding-bottom: 30rem">
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
                  <form @submit.prevent="signUp">
                    <div class="d-flex align-items-center mb-3 pb-1">
                      <span class="h2 fw-bold mb-0">NHG BOOKSTORE</span>
                    </div>

                    <h5
                      class="h3 fw-bold mb-3 pb-3"
                      style="letter-spacing: 1px"
                    >
                      Đăng ký tài khoản
                    </h5>
                    <div class="row mb-3">
                      <div class="col-6">
                        <div class="form-group">
                          <label class="form-label" for="firstName">Họ</label>
                          <Field
                            type="text"
                            class="form-control"
                            placeholder="Nhập họ"
                            name="firstName"
                            :class="{
                              'is-invalid': errors.firstName,
                              'is-valid':
                                !errors.firstName && newUser.firstName !== '',
                            }"
                            v-model="newUser.firstName"
                          />
                          <ErrorMessage
                            name="firstName"
                            class="invalid-feedback"
                          />
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="form-group">
                          <label class="form-label" for="lastName">Tên</label>
                          <Field
                            type="text"
                            class="form-control"
                            placeholder="Nhập tên"
                            name="lastName"
                            :class="{
                              'is-invalid': errors.lastName,
                              'is-valid':
                                !errors.lastName && newUser.lastName !== '',
                            }"
                            v-model="newUser.lastName"
                          />
                          <ErrorMessage
                            name="lastName"
                            class="invalid-feedback"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="form-group mb-3">
                      <label class="form-label" for="phoneNumber"
                        >Số điện thoại</label
                      >
                      <div class="row">
                        <div class="col-9">
                          <Field
                            v-model="newUser.phoneNumber"
                            :disabled="otpVerified"
                            type="text"
                            class="form-control"
                            placeholder="Nhập số điện thoại"
                            name="phoneNumber"
                            :class="{
                              'is-invalid': errors.phoneNumber,
                              'is-valid':
                                !errors.phoneNumber &&
                                newUser.phoneNumber !== '',
                            }"
                          />
                          <ErrorMessage
                            name="phoneNumber"
                            class="invalid-feedback"
                          />
                        </div>
                        <div class="col-3">
                          <button
                            @click="sendOTP"
                            type="button"
                            class="btn btn-primary w-100"
                            :disabled="isLoading || otpVerified"
                          >
                            <span
                              v-if="isLoadingSendOTP"
                              class="spinner-border spinner-border-sm text-white"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            <span class="text-white" v-else>
                              <i class="fa-solid fa-paper-plane text-white"></i>
                              OTP
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="form-group mb-3">
                      <label class="form-label" for="otp">Mã OTP</label>
                      <div class="row">
                        <div class="col-9">
                          <Field
                            type="text"
                            class="form-control"
                            placeholder="Nhập mã OTP"
                            name="otp"
                            :class="{
                              'is-invalid': errors.otp,
                              'is-valid': !errors.otp && newUser.otp !== '',
                            }"
                            :disabled="!otpSent || otpVerified"
                            v-model="newUser.otp"
                          />
                          <ErrorMessage name="otp" class="invalid-feedback" />
                        </div>
                        <div class="col-3">
                          <button
                            @click="checkOTP"
                            type="button"
                            class="btn btn-primary w-100"
                            :disabled="
                              isLoadingCheckOTP || !otpSent || otpVerified
                            "
                          >
                            <span
                              v-if="isLoadingCheckOTP"
                              class="spinner-border spinner-border-sm text-white"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            <span class="text-white" v-else>
                              <i class="fa-solid fa-check"></i>
                              Check OTP
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="form-group mb-3">
                      <label class="form-label" for="password">Mật khẩu</label>
                      <Field
                        type="password"
                        class="form-control"
                        placeholder="Nhập mật khẩu"
                        name="password"
                        :class="{
                          'is-invalid': errors.password,
                          'is-valid':
                            !errors.password && newUser.password !== '',
                        }"
                        :disabled="!otpVerified"
                        v-model="newUser.password"
                      />
                      <ErrorMessage name="password" class="invalid-feedback" />
                    </div>

                    <div class="pt-1 mb-3">
                      <button
                        :disabled="
                          isLoading ||
                          !otpSent ||
                          !otpVerified ||
                          !newUser.password
                        "
                        class="btn btn-primary col-3"
                        type="submit"
                      >
                        <span
                          v-if="isLoading"
                          class="spinner-border spinner-border-sm text-white"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span class="text-white" v-else> Đăng ký </span>
                      </button>
                    </div>

                    <p class="mb-5" style="color: #393f81">
                      Bạn đã có tài khoản?
                      <router-link
                        :to="{ name: 'login' }"
                        style="color: #393f81"
                        >Đăng nhập</router-link
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
import ApiUser from "@/service/user/apiUser.service";
import validation from "@/utils/validate.util";
import { useRouter } from "vue-router";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { registerUserSchema } from "@/utils/schema.util";
import { handleNavigate } from "@/utils/utils";

const { errors, validateField, validate, resetForm } = useForm({
  validationSchema: registerUserSchema,
});

const apiUser = new ApiUser();
const isLoading = ref(false);
const isLoadingSendOTP = ref(false);
const isLoadingCheckOTP = ref(false);
const otpVerified = ref(false);
const otpSent = ref(false);
const router = useRouter();
const newUser = ref({
  firstName: "",
  lastName: "",
  otp: "",
  phoneNumber: "",
  password: "",
});

const sendOTP = async () => {
  const { valid, errors } = await validateField("phoneNumber");
  if (!valid) {
    return;
  }

  try {
    isLoadingSendOTP.value = true;
    const response = await apiUser.post("/auth/createOTP", {
      phoneNumber: newUser.value.phoneNumber,
      method: "register",
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (response?.status === 200) {
      otpSent.value = response.data.otpSent;
      showSuccessToast(response?.data?.message);
    }
  } catch (error) {
    console.log(error);
    showErrorToast(error.response?.data?.message);
  } finally {
    isLoadingSendOTP.value = false;
  }
};

const signUp = async () => {
  const { valid } = await validate();
  if (!valid) return;
  try {
    isLoading.value = true;
    const response = await apiUser.post("/auth/register", {
      password: newUser.value.password,
      phoneNumber: newUser.value.phoneNumber,
      firstName: newUser.value.firstName,
      lastName: newUser.value.lastName,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (response.status == 200) {
      showSuccessToast(response.data.message);
      resetForm();
      otpSent.value = false;
      otpVerified.value = false;
    }
  } catch (error) {
    console.log(error);
    showErrorToast(error.response?.data?.message);
  } finally {
    isLoading.value = false;
  }
};

const checkOTP = async () => {
  if (!otpSent.value) {
    return;
  }
  const { valid, errors } = await validateField("otp");
  if (!valid) {
    return;
  }
  try {
    isLoadingCheckOTP.value = true;
    const response = await apiUser.post("/auth/verifyOTP", {
      phoneNumber: newUser.value.phoneNumber,
      otpSMS: newUser.value.otp,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (response?.status === 200) {
      otpVerified.value = response.data.otpVerified;
      showSuccessToast(response?.data?.message);
    }
  } catch (error) {
    console.log(error);
    showErrorToast(error.response?.data?.message);
  } finally {
    isLoadingCheckOTP.value = false;
  }
};
</script>

<style scoped>
.logo-login {
  position: relative;
  top: 9rem;
}
</style>
