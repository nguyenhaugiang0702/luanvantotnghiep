import moment from "moment";
export const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const handleNavigate = (
  router,
  nameRoute,
  paramName = null,
  paramID = null
) => {
  if (paramID && paramName) {
    router.push({ name: nameRoute, params: { [paramName]: paramID } });
  } else {
    router.push({ name: nameRoute });
  }
};

export const formatDate = (date, time = true) => {
  if (time) {
    return moment(date).format("DD/MM/YYYY HH:mm:ss");
  }
  return moment(date).format("DD/MM/YYYY");
};
