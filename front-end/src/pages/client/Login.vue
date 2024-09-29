<template>
  <div class="container-fluid bg-primary py-4">
    <div class="container text-white">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex flex-column">
          <div class="fw-bold text-uppercase fs-5">Đăng nhập</div>
          <div>Chào mừng bạn đến với NHG BOOKSTORE</div>
        </div>
        <div>
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
            <div class="row g-0" style="padding-bottom: 19rem">
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
                        <span class="text-white" v-else>
                          Đăng nhập
                        </span>
                      </button>
                    </div>

                    <a class="small text-muted" href="/forgotPassword">Quên mật khẩu?</a>
                    <p class="mb-5" style="color: #393f81">
                      Bạn chưa có tài khoản?
                      <a href="/register" style="color: #393f81">Đăng ký</a>
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
import AuthUserService from "@/service/auth/authUser.service";
import { toast } from "vue3-toastify";
import { loginUserSchema } from "@/utils/schema.util";
import Cookies from "js-cookie";

const { errors, validate } = useForm({
  validationSchema: loginUserSchema,
});
const authUserService = new AuthUserService();
const isLoading = ref(false);
const router = useRouter();
const user = ref({
  phoneNumber: "",
  password: "",
});

const Login = async () => {
  const { valid } = await validate();
  if (!valid) {
    return;
  }
  try {
    isLoading.value = true;
    const response = await authUserService.post("/login", user.value);
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
    toast(error.response?.data?.message, {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
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
