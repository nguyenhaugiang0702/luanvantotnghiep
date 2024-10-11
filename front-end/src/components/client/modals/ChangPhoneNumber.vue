<template>
  <button
    type="button"
    data-bs-toggle="modal"
    data-bs-target="#changPhoneNumber"
    class="btn btn-secondary float-end"
  >
    Thay đổi
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="changPhoneNumber"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-uppercase" id="exampleModalLabel">
            Thay đổi số điện thoại
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
            @submit.prevent="changePhoneNumber"
            :validation-schema="changePhoneNumberSchema"
          >
            <div class="row my-3">
              <label for="">Số điện thoại mới</label>
              <div class="form-input col-9">
                <Field
                  class="form-control"
                  :class="{
                    'is-invalid': errors.newPhoneNumber,
                    'is-valid':
                      !errors.newPhoneNumber &&
                      userUpdate.newPhoneNumber !== '',
                  }"
                  type="text"
                  name="newPhoneNumber"
                  value=""
                  v-model="userUpdate.newPhoneNumber"
                />
                <ErrorMessage name="newPhoneNumber" class="invalid-feedback" />
              </div>
              <div class="col-3">
                <button
                  class="btn btn-primary float-end"
                  type="button"
                  @click="sendOTPChangePhoneNmber"
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
                    'is-invalid': errors.otpSMS && otpSent,
                    'is-valid': !errors.otpSMS && userUpdate.otpSMS !== '',
                  }"
                  type="text"
                  :disabled="!otpSent"
                  name="otpSMS"
                  value=""
                  v-model="userUpdate.otpSMS"
                />
                <ErrorMessage name="otpSMS" class="invalid-feedback" />
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
import { ref } from "vue";
import Cookies from "js-cookie";
import { toast } from "vue3-toastify";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { changePhoneNumberSchema } from "@/utils/schema.util";
import ApiUser from "@/service/user/apiUser.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emit: ["refreshUser"],
  setup(props, { emit }) {
    const userUpdate = ref({
      newPhoneNumber: "",
      otpSMS: "",
    });
    const { errors, validate, validateField } = useForm({
      validationSchema: changePhoneNumberSchema,
    });
    const token = Cookies.get("accessToken");
    const apiUser = new ApiUser();
    const otpSent = ref(false);
    const isLoading = ref(false);
    const isLoadingUpdate = ref(false);

    const sendOTPChangePhoneNmber = async () => {
      try {
        isLoading.value = true;
        const { valid } = await validateField("newPhoneNumber");
        if (!valid) {
          return;
        }
        const data = {
          phoneNumber: userUpdate.value.newPhoneNumber,
          method: "changePhoneNumber",
        };

        const response = await apiUser.post("/auth/createOTP", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (response?.status === 200) {
          otpSent.value = response.data.otpSent;
          showSuccessToast(response?.data?.message);
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      } finally {
        isLoading.value = false;
      }
    };

    const changePhoneNumber = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      try {
        isLoadingUpdate.value = true;
        const response = await apiUser.put(
          "/profile/updatePhoneAndEmail",
          userUpdate.value
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (response?.status === 200) {
          showSuccessToast(response?.data?.message);
          $("#changPhoneNumber").modal("hide");
          emit("refreshUser");
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      } finally {
        isLoadingUpdate.value = false;
      }
    };

    return {
      changePhoneNumberSchema,
      changePhoneNumber,
      errors,
      userUpdate,
      sendOTPChangePhoneNmber,
      otpSent,
      isLoading,
      isLoadingUpdate,
    };
  },
};
</script>
