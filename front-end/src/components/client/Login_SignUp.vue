<template>
  <div :class="['container', { active: isSignInActive }]" class="mx-auto my-3">
    <div class="box">
      <div class="form sign_in">
        <h3>Đăng nhập</h3>
        <span>hoặc sử dụng tài khoản của bạn</span>

        <form action="#" id="form_input">
          <div class="type">
            <label for="exampleFormControlInput1" class="form-label float-start"
              >Số điện thoại/Email</label
            >
            <input
              class="form-control border border-2"
              type="email"
              name=""
              id="email"
            />
          </div>
          <div class="type">
            <label for="exampleFormControlInput1" class="form-label float-start"
              >Mật khẩu</label
            >
            <input
              class="border border-2 form-control"
              type="password"
              name=""
              id="password"
            />
          </div>

          <div class="forgot">
            <span>Quên mật khẩu?</span>
          </div>

          <button class="btn bkg">Đăng nhập</button>
        </form>
      </div>

      <div class="form sign_up">
        <h3>Đăng ký</h3>
        <span>or use your email for register</span>

        <form action="#" id="form_input">
          <div class="type_phone">
            <label for="exampleFormControlInput1" class="form-label float-start"
              >Số điện thoại</label
            >
            <input
              type="text"
              v-model="phone.phoneNumber"
              class="border border-2 form-control"
              name=""
              id="name"
            />
            <button
              @click="sendOTP"
              type="submit"
              class="btn_otp"
              :disabled="isLoading"
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
              v-model="otp.code"
              :disabled="!otpSent"
              @input="checkOTP"
              type="text"
              class="border border-2 form-control"
              placeholder="6 ký tự"
              name=""
              id="email"
            />
          </div>
          <div class="type">
            <label for="exampleFormControlInput1" class="form-label float-start"
              >Mật khẩu</label
            >
            <input
              :disabled="!otpVerified"
              class="border border-2 form-control"
              type="password"
              name=""
              id="password"
            />
          </div>

          <button class="btn bkg">Sign Up</button>
        </form>
      </div>
    </div>

    <div class="overlay">
      <div class="page page_signIn">
        <h3>Welcome Back!</h3>
        <p>To keep with us please login with your personal info</p>

        <button class="btn btnSign-in" @click="toggleSignIn">
          Sign Up <i class="bi bi-arrow-right"></i>
        </button>
      </div>

      <div class="page page_signUp">
        <h3>Hello Friend!</h3>
        <p>Enter your personal details and start journey with us</p>

        <button class="btn btnSign-up" @click="toggleSignUp">
          <i class="bi bi-arrow-left"></i> Sign In
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import ApiService from "@/service/ApiService";
export default {
  setup() {
    const api = new ApiService();
    const isSignInActive = ref(true);
    const phone = ref({
      phoneNumber: "",
    });
    const isLoading = ref(false);
    const otpSent = ref(false);
    const otp = ref({
      code: "",
    });
    const otpVerified = ref(false);

    const toggleSignIn = () => {
      isSignInActive.value = true;
    };

    const toggleSignUp = () => {
      isSignInActive.value = false;
    };

    const sendOTP = async () => {
      try {
        isLoading.value = true;
        const response = await api.post("/auth/signUp", phone.value);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (response?.status === 200) {
          otpSent.value = response.data.otpSent;
          alert(response.data.otpCode);
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const checkOTP = async () => {
      const otpNumber = Number(otp.value.code);
      if (otp.value.code.length === 6) {
        try {
          const response = await api.post("/auth/signUp/verifyOTP", {
            phoneNumber: phone.value.phoneNumber,
            otp: otpNumber,
          });
          if (response?.status === 200) {
            otpVerified.value = response.data.otpVerified;
            alert("OTP xác thực thành công!");
          }
        } catch (error) {
          console.error("Error verifying OTP:", error);
          alert("Mã OTP không chính xác hoặc đã hết hạn.");
        }
      } else {
        console.log(2);
      }
    };

    return {
      isSignInActive,
      toggleSignIn,
      toggleSignUp,
      sendOTP,
      phone,
      isLoading,
      otpSent,
      checkOTP,
      otp,
      otpVerified,
    };
  },
};
</script>
<style scoped>
@import "../../assets/css/login_signup.css";
</style>
