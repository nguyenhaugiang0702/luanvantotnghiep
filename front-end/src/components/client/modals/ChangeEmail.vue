<template>
  <button
    type="button"
    data-bs-toggle="modal"
    data-bs-target="#changeEmail"
    class="btn btn-secondary float-end"
  >
    Thay đổi
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="changeEmail"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-uppercase" id="exampleModalLabel">
            Thay đổi email
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form
            @submit.prevent="changeEmail"
            :validation-schema="changeEmailSchema"
          >
            <div class="row my-3">
              <label for="">Email</label>
              <div class="form-input col-9">
                <Field
                  class="form-control"
                  :class="{
                    'is-invalid': errors.email,
                    'is-valid': !errors.email && userUpdate.email !== '',
                  }"
                  type="text"
                  name="email"
                  value=""
                  placehoolder="Enter Email"
                  v-model="userUpdate.email"
                />
                <ErrorMessage name="email" class="invalid-feedback" />
              </div>
              <div class="col-3">
                <button
                  class="btn btn-primary float-end"
                  type="button"
                  @click="sendOTPToActiveEmail"
                  :disabled="isLoading"
                >
                  <span
                    v-if="isLoading"
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
            <div class="row my-3">
              <div class="form-input">
                <label for="">Mã xác nhận OTP</label>
                <Field
                  class="form-control"
                  :class="{
                    'is-invalid': errors.otpEmail && otpSent,
                    'is-valid': !errors.otpEmail && userUpdate.otpEmail !== '',
                  }"
                  type="text"
                  :disabled="!otpSent"
                  name="otpEmail"
                  value=""
                  v-model="userUpdate.otpEmail"
                />
                <ErrorMessage name="otpEmail" class="invalid-feedback" />
              </div>
            </div>
            <div class="row d-flex justify-content-center mt-4">
              <button
                type="submit"
                class="btn btn-primary col-3"
                :disabled="isLoadingUpdate || !otpSent"
              >
                <span
                  v-if="isLoadingUpdate"
                  class="spinner-border spinner-border-sm text-white"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span class="text-white" v-else> Xác nhận </span>
              </button>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import Cookies from "js-cookie";
import ApiService from "@/service/ApiService";
import { toast } from "vue3-toastify";
import validation from "@/utils/validate.util";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { changeEmailSchema } from "@/utils/schema.util";
import UserService from "@/service/user.service";
import AuthService from "@/service/auth/authUser.service";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emit: ["refreshUser"],
  setup(props, { emit }) {
    const userUpdate = ref({
      email: "",
      otpEmail: "",
    });
    const { errors, validate, validateField } = useForm({
      validationSchema: changeEmailSchema,
    });
    const token = Cookies.get("accessToken");
    const userService = new UserService();
    const authService = new AuthService();
    const otpSent = ref(false);
    const isLoading = ref(false);
    const isLoadingUpdate = ref(false);
    const isModalOpen = ref(false);

    const sendOTPToActiveEmail = async () => {
      try {
        isLoading.value = true;
        const { valid } = await validateField("email");
        if (!valid) {
          return;
        }
        const data = {
          email: userUpdate.value.email,
        };

        const response = await authService.post("/createOTP", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (response?.status === 200) {
          otpSent.value = response.data.otpSent;
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
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

    const changeEmail = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      try {
        isLoadingUpdate.value = true;
        const response = await userService.put("/updatePhoneAndEmail", userUpdate.value);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (response?.status === 200) {
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
          // $("#changeEmail").modal("hide");
          isModalOpen.value = false;
          emit("refreshUser");
        }
      } catch (error) {
        toast(error.response?.data?.message, {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      } finally {
        isLoadingUpdate.value = false;
      }
    };
    return {
      changeEmailSchema,
      changeEmail,
      errors,
      userUpdate,
      sendOTPToActiveEmail,
      otpSent,
      isLoading,
      isLoadingUpdate,
      isModalOpen
    };
  },
};
</script>
