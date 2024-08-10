<template>
  <div>
    <button @click="handleLoginByFB" class="btn btn-primary">
      LOGIN BY FB
    </button>
  </div>
</template>

<script>
import ApiService from "@/service/ApiService";
export default {
  setup() {
    const api = new ApiService();
    const handleLoginByFB = async () => {
    //   const response = await api.get("/auth/facebook");
    //   if (response.status == 200) {
    //     alert("OK FACEBOOK");
    //   }
    window.open("http://localhost:3000/api/v1/auth/facebook", "_self");
    };
    return {
      handleLoginByFB,
    };
  },
};
</script>
