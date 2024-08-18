<template>
  <h4>ĐỔI MẬT KHẨU</h4>
  <form
    @submit.prevent="changePassword"
    :validation-schema="changePasswordSchema"
  >
    <div class="form-group row mt-5">
      <label for="currentPassword" class="col-3">Mật khẩu hiện tại*</label>
      <div class="col-8">
        <div class="row">
          <div class="col-11">
            <Field
              :type="showCurrentPassword ? 'text' : 'password'"
              :class="{
                'form-control': true,
                'is-invalid': errors.currentPassword,
                'is-valid':
                  !errors.currentPassword && user.currentPassword !== '',
              }"
              id="currentPassword"
              placeholder="Mật khẩu hiện tại"
              name="currentPassword"
              v-model="user.currentPassword"
            />
          </div>
          <div
            class="col-1 btn btn-secondary"
            @click="handleShowCurrentPassword"
          >
            <i
              :class="['fa', showCurrentPassword ? 'fa-eye-slash' : 'fa-eye']"
              class="password-toggle"
            ></i>
          </div>
        </div>

        <div class="row">
          <ErrorMessage
            class="invalid-feedback col-12 d-block"
            name="currentPassword"
          />
        </div>
      </div>
    </div>
    <div class="form-group row mt-4">
      <label for="newPassword" class="col-3">Mật khẩu mới*</label>
      <div class="col-8">
        <div class="row">
          <div class="col-11">
            <Field
              :type="showNewPassword ? 'text' : 'password'"
              :class="{
                'form-control': true,
                'is-invalid': errors.newPassword,
                'is-valid': !errors.newPassword && user.newPassword !== '',
              }"
              id="newPassword"
              placeholder="Mật khẩu mới"
              name="newPassword"
              v-model="user.newPassword"
            />
          </div>
          <div class="col-1 btn btn-secondary" @click="handleShowNewPassword">
            <i
              :class="['fa', showNewPassword ? 'fa-eye-slash' : 'fa-eye']"
              class="password-toggle"
            ></i>
          </div>
        </div>

        <div class="row">
          <ErrorMessage
            class="invalid-feedback col-12 d-block"
            name="newPassword"
          />
        </div>
      </div>
    </div>
    <div class="form-group row mt-4">
      <label for="cfNewPassword" class="col-3">Nhập lại mật khẩu*</label>
      <div class="col-8">
        <div class="row">
          <div class="col-11">
            <Field
              :type="showCfNewPassword ? 'text' : 'password'"
              :class="{
                'form-control': true,
                'is-invalid': errors.cfNewPassword,
                'is-valid': !errors.cfNewPassword && user.cfNewPassword !== '',
              }"
              id="cfNewPassword"
              name="cfNewPassword"
              placeholder="Nhập lại mật khẩu mới"
              v-model="user.cfNewPassword"
            />
          </div>

          <div
            class="col-sm-1 btn btn-secondary"
            @click="handleShowCfNewPassword"
          >
            <i
              :class="['fa', showCfNewPassword ? 'fa-eye-slash' : 'fa-eye']"
              class="password-toggle"
            ></i>
          </div>
        </div>
        <div class="row">
          <ErrorMessage
            class="invalid-feedback col-12 d-block"
            name="cfNewPassword"
          />
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <button
        type="submit"
        class="btn btn-primary mt-4 col-3 text-center"
        :disabled="isLoading"
      >
        <span
          v-if="isLoading"
          class="spinner-border spinner-border-sm text-white"
          role="status"
          aria-hidden="true"
        ></span>
        <span class="text-white" v-else> Lưu thay đổi </span>
      </button>
    </div>
  </form>
</template>
<script>
import UserService from "@/service/user.service";
import { changePasswordSchema } from "@/utils/schema.util";
import Cookies from "js-cookie";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue3-toastify";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const { errors, validate } = useForm({
      validationSchema: changePasswordSchema,
    });
    const isLoading = ref(false);
    const userService = new UserService();
    const token = Cookies.get("accessToken");
    const user = ref({
      currentPassword: "",
      newPassword: "",
      cfNewPassword: "",
    });
    const showCurrentPassword = ref(false);
    const showNewPassword = ref(false);
    const showCfNewPassword = ref(false);

    const changePassword = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      try {
        isLoading.value = true;
        const response = await userService.put(
          `/changePassword/${token}`,
          user.value
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (response?.status === 200) {
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
        }
        return;
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

    const handleShowCurrentPassword = () => {
      showCurrentPassword.value = !showCurrentPassword.value;
    };
    const handleShowNewPassword = () => {
      showNewPassword.value = !showNewPassword.value;
    };
    const handleShowCfNewPassword = () => {
      showCfNewPassword.value = !showCfNewPassword.value;
    };
    return {
      changePasswordSchema,
      errors,
      isLoading,
      changePassword,
      user,
      showCurrentPassword,
      showNewPassword,
      showCfNewPassword,
      handleShowCurrentPassword,
      handleShowNewPassword,
      handleShowCfNewPassword,
    };
  },
};
</script>
