<template>
  <div class="container-fluid bg-primary py-4">
    <div class="container text-white">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex flex-column">
          <div class="fw-bold text-uppercase fs-5">Quên mât khẩu</div>
          <div>Khôi phục mật khẩu</div>
        </div>
        <div>
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
                  <form @submit.prevent="changePassword">
                    <div class="d-flex align-items-center mb-3 pb-1">
                      <span class="h2 fw-bold mb-0">NHG BOOKSTORE</span>
                    </div>

                    <h5
                      class="h3 fw-bold mb-3 pb-3"
                      style="letter-spacing: 1px"
                    >
                      Khôi phục mật khẩu
                    </h5>
                    <div class="form-group mb-3">
                      <label class="form-label" for="phoneNumber"
                        >Số điện thoại</label
                      >
                      <div class="row">
                        <div class="col-9">
                          <Field
                            v-model="user.phoneNumber"
                            :disabled="otpVerified"
                            type="text"
                            id="form2Example27"
                            class="form-control"
                            placeholder="Nhập số điện thoại"
                            name="phoneNumber"
                            :class="{
                              'is-invalid': errors.phoneNumber,
                              'is-valid':
                                !errors.phoneNumber && user.phoneNumber !== '',
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
                            id="form2Example27"
                            class="form-control"
                            placeholder="Nhập mã OTP"
                            name="otp"
                            :class="{
                              'is-invalid': errors.otp,
                              'is-valid': !errors.otp && user.otp !== '',
                            }"
                            :disabled="!otpSent || otpVerified"
                            v-model="user.otp"
                          />
                          <ErrorMessage name="otp" class="invalid-feedback" />
                        </div>
                        <div class="col-3">
                          <button
                            @click="checkOTP"
                            type="button"
                            class="btn btn-primary w-100"
                            :disabled="isLoading || otpVerified"
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
                      <label class="form-label" for="password"
                        >Mật khẩu mới</label
                      >
                      <Field
                        type="password"
                        id="form2Example27"
                        class="form-control"
                        placeholder="Nhập mật khẩu"
                        name="password"
                        :class="{
                          'is-invalid': errors.password,
                          'is-valid': !errors.password && user.password !== '',
                        }"
                        :disabled="!otpVerified"
                        v-model="user.password"
                      />
                      <ErrorMessage name="password" class="invalid-feedback" />
                    </div>
                    <div class="form-group mb-3">
                      <label class="form-label" for="cfpassword"
                        >Xác nhận mật khẩu mới</label
                      >
                      <Field
                        type="password"
                        id="form2Example27"
                        class="form-control"
                        placeholder="Nhập mật khẩu"
                        name="cfpassword"
                        :class="{
                          'is-invalid': errors.cfpassword,
                          'is-valid':
                            !errors.cfpassword && user.cfpassword !== '',
                        }"
                        :disabled="!otpVerified"
                        v-model="user.cfpassword"
                      />
                      <ErrorMessage
                        name="cfpassword"
                        class="invalid-feedback"
                      />
                    </div>

                    <div class="pt-1 mb-3">
                      <button
                        :disabled="
                          isLoading ||
                          !otpSent ||
                          !otpVerified ||
                          user.password === '' ||
                          user.cfpassword === ''
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
                        <span class="text-white" v-else> Lưu </span>
                      </button>
                    </div>

                    <p class="mb-5" style="color: #393f81">
                      Bạn đã có tài khoản?
                      <router-link to="login" style="color: #393f81"
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
import { toast } from "vue3-toastify";
import validation from "@/utils/validate.util";
import { useRouter } from "vue-router";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { forgotPasswordSchema } from "@/utils/schema.util";
import { handleNavigate } from "@/utils/utils";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

const { errors, validateField, validate, resetForm } = useForm({
  validationSchema: forgotPasswordSchema,
});

const apiUser = new ApiUser();
const isLoading = ref(false);
const isLoadingSendOTP = ref(false);
const isLoadingCheckOTP = ref(false);
const otpVerified = ref(false);
const otpSent = ref(false);
const router = useRouter();
const user = ref({
  otp: "",
  phoneNumber: "",
  password: "",
  cfpassword: "",
});

const sendOTP = async () => {
  const { valid, errors } = await validateField("phoneNumber");
  if (!valid) {
    return;
  }

  try {
    isLoadingSendOTP.value = true;
    const response = await apiUser.post("/auth/createOTP", {
      phoneNumber: user.value.phoneNumber,
      method: "forgotPassword",
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    otpSent.value = true;
    if (response?.status === 200) {
      otpSent.value = response.data.otpSent;
      showSuccessToast(response?.data?.message);
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    console.log(errorMessage);
    showErrorToast(errorMessage);
  } finally {
    isLoadingSendOTP.value = false;
  }
};

const changePassword = async () => {
  const { valid } = await validate();
  if (!valid) return;
  try {
    isLoading.value = true;
    const response = await apiUser.post("/auth/forgotPassword", {
      password: user.value.password,
      phoneNumber: user.value.phoneNumber,
      cfpassword: user.value.cfpassword,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (response.status == 200) {
      showSuccessToast(response?.data?.message);
      otpSent.value = false;
      otpVerified.value = false;
      resetForm();
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
    otpVerified.value = true;
    const response = await apiUser.post("/auth/verifyOTP", {
      phoneNumber: user.value.phoneNumber,
      otpSMS: user.value.otp,
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
