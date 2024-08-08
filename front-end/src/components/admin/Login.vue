<template>
  <div class="container-fluid text-center py-4 bg-primary text-white fs-3">
    Welcome to admin control panel
  </div>
  <div class="center">
    <h1>Đăng nhập</h1>
    <Form class="form" @submit.prevent="loginAdmin()" :validation-schema="loginSchema">
      
      <div class="txt_field mt-5">
        <Field
          as="input"
          class="input"
          v-model="admin.admin_email"
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
          v-model="admin.admin_password"
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
        <!-- <a class="forgot_route" @click="$router.push({ name: 'forgotpassword' })"
          >Click Here</a
        > -->
        <a class="forgot_route"
          >Click Here</a
        >
        <br />
      </div>
    </Form>
  </div>
</template>
<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import ApiService from "@/service/ApiService";
// import { showSuccess } from "@/utils/swalUtils";
import { loginSchema } from "@/utils/validate";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup(_, { emit }) {
    const admin = ref({
      admin_email: "",
      admin_password: "",
    });
    const router = useRouter();
    const api = new ApiService();
    const showPassword = ref(false);
    const isLoading = ref(false);

    const loginAdmin = async () => {
      isLoading.value = true;
      const adminData = {
        ...admin.value,
      };
      try {
        const apiCall = await api.post("admin/login", adminData);
        const delay = new Promise((resolve) => setTimeout(resolve, 1500));
        const [response] = await Promise.all([apiCall, delay]);
        if (response?.status == 200) {
          admin.value = {
            admin_email: "",
            admin_password: "",
          };
          const token = response.data.accessToken;
          Cookies.set("accessToken", token, { expires: 7 });
          // await showSuccess({
          //   text: "Đăng nhập thành công.",
          // });
          // router.push({ name: "admin" });
          window.location.reload();
        }
      } catch (error) {
        console.log(error);
      } finally {
        isLoading.value = false;
      }
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      loginAdmin,
      admin,
      showPassword,
      togglePasswordVisibility,
      loginSchema,
      isLoading,
    };
  },
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
