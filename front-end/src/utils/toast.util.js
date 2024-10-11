// src/utils/toast.js
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const toastOptions = {
  theme: "auto",
  dangerouslyHTMLString: true,
  "position": "bottom-right",
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    ...toastOptions,
    type: "success",
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    ...toastOptions,
    type: "error",
  });
};

export const showWarningToast = (message) => {
  toast.warning(message, {
    ...toastOptions,
    type: "warning",
  });
};

export const showInfoToast = (message) => {
  toast.info(message, {
    ...toastOptions,
    type: "info",
  });
};
