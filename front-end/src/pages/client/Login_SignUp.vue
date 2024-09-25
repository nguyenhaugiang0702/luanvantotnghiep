<template>
  <div :class="['container', { active: isSignInActive }]" class="mx-auto my-3">
    <div class="box">
      <div class="form sign_in">
        <h3>Đăng nhập</h3>
        <span>hoặc sử dụng tài khoản của bạn</span>

        <form @submit.prevent="signIn" class="form_input">
          <div class="type">
            <label for="exampleFormControlInput1" class="form-label float-start"
              >Số điện thoại</label
            >
            <input
              v-model="phoneNumber.phoneNumberSignIn"
              class="form-control border border-2"
              type="text"
              name=""
              id=""
            />
          </div>
          <div class="type">
            <label for="exampleFormControlInput1" class="form-label float-start"
              >Mật khẩu</label
            >
            <input
              v-model="password.passwordSignIn"
              class="border border-2 form-control"
              name=""
              id="password"
              :type="showPasswordSignIn ? 'text' : 'password'"
            />
            <i
              @click="togglePasswordSignInVisibility"
              :class="['fa', showPasswordSignIn ? 'fa-eye-slash' : 'fa-eye']"
              class="password-toggle iconPassword"
            ></i>
          </div>

          <div class="forgot">
            <span>Quên mật khẩu?</span>
          </div>
          <button
            type="submit"
            class="btn bkg"
            :disabled="isLoadingSignIn || !isSignInFormValid"
          >
            <span
              v-if="isLoadingSignIn"
              class="spinner-border spinner-border-sm text-white"
              role="status"
              aria-hidden="true"
            ></span>
            <span class="text-white" v-else> Đăng nhập </span>
          </button>
        </form>
      </div>

      <div class="form sign_up">
        <h3>Đăng ký</h3>
        <span>Hoặc sử dụng email của bạn để đăng ký</span>

        <form @submit.prevent="signUp" class="form_input">
          <div class="type_phone">
            <label for="exampleFormControlInput1" class="form-label float-start"
              >Số điện thoại</label
            >
            <input
              type="text"
              :disabled="otpVerified"
              v-model="phoneNumber.phoneNumberSignUp"
              class="border border-2 form-control"
              name="phoneNumberSignUp"
              id="phoneNumberSignUp"
              :class="{
                'border border-danger': errors.phoneNumber.phoneNumberSignUp,
                'border-success':
                  !errors.phoneNumber.phoneNumberSignUp &&
                  phoneNumber.phoneNumberSignUp !== '',
              }"
            />
            <button
              @click="sendOTP"
              type="button"
              class="btn_otp"
              :disabled="isLoading || otpVerified"
            >
              <span
                v-if="isLoading"
                class="spinner-border spinner-border-sm text-white"
                role="status"
                aria-hidden="true"
              ></span>
              <span class="text-white" v-else>
                <i class="fa-solid fa-paper-plane text-white"></i> OTP
              </span>
            </button>
          </div>
          <div class="type">
            <label for="exampleFormControlInput1" class="form-label float-start"
              >Mã xác nhận OTP</label
            >
            <input
              v-model="otp"
              :disabled="!otpSent || otpVerified"
              @keyup.enter="checkOTP"
              type="text"
              class="border border-2 form-control"
              :class="{
                'border border-danger': errors.otp,
                'border-success': !errors.otp && otp !== '' && otpSent,
              }"
              placeholder="6 ký tự"
              name="otp"
              id="otp"
            />
            <span class="text-danger float-start"></span>
          </div>
          <div class="type">
            <label for="exampleFormControlInput1" class="form-label float-start"
              >Mật khẩu</label
            >
            <input
              :disabled="!otpVerified"
              v-model="password.passwordSignUp"
              class="border border-2 form-control"
              :class="{
                'border-danger': errors.password.passwordSignUp,
                'border-success':
                  !errors.password.passwordSignUp &&
                  password.passwordSignUp !== '',
              }"
              :type="showPasswordSignUp ? 'text' : 'password'"
              name="passwordSignUp"
              id="passwordSignUp"
            />
            <i
              @click="togglePasswordSignUpVisibility"
              :class="['fa', showPasswordSignUp ? 'fa-eye-slash' : 'fa-eye']"
              class="password-toggle iconPassword"
            ></i>
            <span class="text-danger float-start"></span>
          </div>
          <button
            type="submit"
            class="btn bkg"
            :disabled="isLoadingSignUp || !password.passwordSignUp"
          >
            <span
              v-if="isLoadingSignUp"
              class="spinner-border spinner-border-sm text-white"
              role="status"
              aria-hidden="true"
            ></span>
            <span class="text-white" v-else> Đăng ký </span>
          </button>
        </form>
      </div>
    </div>

    <div class="overlay">
      <div class="page page_signIn">
        <h3>Chào mừng trở lại!</h3>
        <p>
          Để giữ chúng tôi, vui lòng đăng nhập với thông tin cá nhân của bạn
        </p>

        <button class="btn btnSign-in" @click="toggleSignIn">
          Đăng ký <i class="bi bi-arrow-right"></i>
        </button>
      </div>

      <div class="page page_signUp">
        <h3>Chào bạn!</h3>
        <p>Nhập chi tiết cá nhân của bạn và bắt đầu hành trình với chúng tôi</p>

        <button class="btn btnSign-up" @click="toggleSignUp">
          <i class="bi bi-arrow-left"></i> Đăng nhập
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  ref,
  computed,
  onMounted,
  watch,
  watchEffect,
  inject,
  nextTick,
} from "vue";
import AuthUserService from "@/service/auth/authUser.service";
import { toast } from "vue3-toastify";
import validation from "@/utils/validate.util";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";

export default {
  setup() {
    const authUserService = new AuthUserService();
    const isSignInActive = ref(true);
    const phoneNumber = ref({
      phoneNumberSignUp: "",
      phoneNumberSignIn: "",
    });
    const isLoading = ref(false);
    const otpSent = ref(false);
    const otp = ref("");
    const otpVerified = ref(false);
    const isLoadingSignUp = ref(false);
    const isLoadingSignIn = ref(false);
    const password = ref({
      passwordSignUp: "",
      passwordSignIn: "",
    });
    const errors = ref({
      phoneNumber: {
        phoneNumberSignIn: "",
        phoneNumberSignUp: "",
      },
      otp: "",
      password: {
        passwordSignIn: "",
        passwordSignUp: "",
      },
    });
    const router = useRouter();
    const updateCart = inject("updateCart");

    // Thêm biến để quản lý việc hiển thị mật khẩu
    const showPasswordSignUp = ref(false);

    const togglePasswordSignUpVisibility = () => {
      showPasswordSignUp.value = !showPasswordSignUp.value;
    };

    // Thêm biến để quản lý việc hiển thị mật khẩu
    const showPasswordSignIn = ref(false);

    const togglePasswordSignInVisibility = () => {
      showPasswordSignIn.value = !showPasswordSignIn.value;
    };

    const toggleSignIn = () => {
      isSignInActive.value = true;
      // localStorage.setItem("isSignInActive", true);
      // isSignInActive.value = localStorage.getItem("isSignInActive");
    };

    const toggleSignUp = () => {
      isSignInActive.value = false;

      // localStorage.setItem("isSignInActive", false);
      // isSignInActive.value = localStorage.getItem("isSignInActive");
    };

    const sendOTP = async () => {
      if (
        !validation.validatePhoneNumber(phoneNumber.value.phoneNumberSignUp)
      ) {
        errors.value.phoneNumber.phoneNumberSignUp = true;
        return;
      }
      try {
        isLoading.value = true;
        const response = await authUserService.post("/createOTP", {
          phoneNumber: phoneNumber.value.phoneNumberSignUp,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (response?.status === 200) {
          otpSent.value = response.data.otpSent;
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
          errors.value.phoneNumber.phoneNumberSignUp = "";
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message;
        errors.value.phoneNumber.phoneNumberSignUp = errorMessage;
        toast(errorMessage, {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      } finally {
        isLoading.value = false;
      }
    };

    const checkOTP = async () => {
      if (!validation.validateOTP(otp.value)) {
        errors.value.otp = true;
        return;
      }
      const otpNumber = Number(otp.value);
      try {
        const response = await authUserService.post("/signUp/verifyOTP", {
          phoneNumber: phoneNumber.value.phoneNumberSignUp,
          otp: otpNumber,
        });
        if (response?.status === 200) {
          otpVerified.value = response.data.otpVerified;
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
          errors.value.otp = "";
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message;
        errors.value.otp = errorMessage;
        toast(errorMessage, {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      }
    };

    const signUp = async () => {
      if (!validation.validatePassword(password.value.passwordSignUp)) {
        errors.value.password.passwordSignUp = true;
        return;
      }
      try {
        isLoadingSignUp.value = true;
        const response = await authUserService.post("/users", {
          password: password.value.passwordSignUp,
          phoneNumber: phoneNumber.value.phoneNumberSignUp,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (response.status == 200) {
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
          router.push({ name: "profile" });
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message;
        errors.value.password.passwordSignUp = errorMessage;
        toast(errorMessage, {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      } finally {
        isLoadingSignUp.value = false;
      }
    };

    const isSignInFormValid = computed(() => {
      return (
        phoneNumber.value.phoneNumberSignIn.trim() !== "" &&
        password.value.passwordSignIn.trim() !== ""
      );
    });

    const signIn = async () => {
      try {
        isLoadingSignIn.value = true;
        const response = await authUserService.post("/", {
          password: password.value.passwordSignIn,
          phoneNumber: phoneNumber.value.phoneNumberSignIn,
        });
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
        const errorMessage = error.response?.data?.message;
        errors.value.password.passwordSignUp = errorMessage;
        toast(errorMessage, {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      } finally {
        isLoadingSignIn.value = false;
      }
    };

    // watch(isSignInActive, (newValue) => {
    //   localStorage.setItem("isSignInActive", newValue);
    //   isSignInActive.value = localStorage.getItem("isSignInActive");
    // });

    return {
      isSignInActive,
      toggleSignIn,
      toggleSignUp,
      sendOTP,
      phoneNumber,
      isLoading,
      otpSent,
      checkOTP,
      otp,
      otpVerified,
      signUp,
      isLoadingSignIn,
      isLoadingSignUp,
      password,
      signIn,
      errors,
      showPasswordSignUp,
      togglePasswordSignUpVisibility,
      togglePasswordSignInVisibility,
      showPasswordSignIn,
      isSignInFormValid,
    };
  },
};
</script>
<style scoped>
@import "../../assets/css/login_signup.css";
</style>
