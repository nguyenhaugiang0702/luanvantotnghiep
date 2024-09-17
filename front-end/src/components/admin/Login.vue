<template>
  <div class="container-fluid text-center py-4 bg-primary text-white fs-3">
    Welcome to admin control panel
  </div>
  <div class="center">
    <h1>Đăng nhập</h1>
    <Form class="form" @submit="loginAdmin">
      <div class="txt_field mt-5">
        <Field
          as="input"
          class="input"
          v-model="admin.email"
          type="email"
          name="admin_email"
          required
        />
        <span class="under-line"></span>
        <label>Email</label>
        <ErrorMessage name="admin_email" class="text-danger" />
      </div>
      <div class="txt_field mt-5">
        <Field
          as="input"
          class="input-password input"
          v-model="admin.password"
          :type="showPassword ? 'text' : 'password'"
          name="admin_password"
          required
        />
        <span class="under-line"></span>
        <label>Password</label>
        <button type="button" @click="togglePasswordVisibility">
          <i v-if="!showPassword" class="fa-solid fa-eye-slash text-dark"></i>
          <i v-else class="fa-solid fa-eye text-dark"></i>
        </button>
        <ErrorMessage name="admin_password" class="text-danger" />
      </div>
      <button class="btn_login mt-4" :disabled="isLoading">
        <span
          v-if="isLoading"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        <span v-else>Đăng nhập</span>
      </button>
      <div class="text_bottom">
        Quên mật khẩu?
        <a class="forgot_route">Click Here</a>
        <br />
      </div>
    </Form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import AuthAdminService from "@/service/auth/authAdmin.service";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useAuthStore } from "../../stores/auth";

const admin = ref({
  email: "",
  password: "",
});
const authAdminService = new AuthAdminService();
const router = useRouter();
const showPassword = ref(false);
const isLoading = ref(false);
const authStore = useAuthStore();

const loginAdmin = async () => {
  isLoading.value = true;
  try {
    const apiCall = await authAdminService.post("/", admin.value);
    const delay = new Promise((resolve) => setTimeout(resolve, 1500));
    const [response] = await Promise.all([apiCall, delay]);
    if (response?.status == 200) {
      admin.value = {
        admin_email: "",
        admin_password: "",
      };
      const token = response.data.accessToken;
      Cookies.set("accessToken", token, { expires: 365 });
      Cookies.set("isLoggedIn", response.data.isLoggedIn, { expires: 365 });

      // Cập nhật trạng thái đăng nhập trong auth store
      authStore.login(response.data.user); // Giả sử API trả về thông tin user

      // Chuyển hướng đến trang admin
      router.push({ name: "admin" });
    }
  } catch (error) {
    console.log(error);
    // Có thể thêm xử lý lỗi ở đây, ví dụ hiển thị thông báo lỗi
  } finally {
    isLoading.value = false;
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
@import "../../assets/css/login.css";
@import "@fortawesome/fontawesome-free/css/all.min.css";
.text-danger {
  position: absolute;
  top: 45px;
  left: 0;
}
</style>
