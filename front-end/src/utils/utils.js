import router from "@/router";
import { useRouter } from "vue-router";

export const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const handleNavigate = (nameRoute) => {
  router.push({ name: nameRoute });
};
