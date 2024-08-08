<template>
  <div class="container-fluid bg-primary">
    <div class="row">
      <div
        class="col-1 d-flex d-sm-none align-items-center justify-content-center"
      >
        <span @click="showDrawerMenu()">
          <i class="fa-solid fa-bars fa-xl text-white"></i>
        </span>
      </div>
      <div
        class="col-10 col-sm-9 d-flex align-items-center justify-content-center justify-content-sm-start p-4"
      >
        <span class="d-sm-flex text-white fw-bold fs-5"
          >Trường chính trị Thành phố Cần Thơ | Quản Trị
        </span>
      </div>
    </div>
  </div>
  <a-drawer v-model:open="open_menu" title="Danh Mục" placement="left">
    <!-- <TheMenuResponsive /> -->
  </a-drawer>
</template>
<script>
import { ref } from "vue";
// import TheMenuResponsive from "./TheMenuResponsive.vue";
export default {
  components: {
    // TheMenuResponsive,
  },
  setup() {
    const open_menu = ref(false);
    const showDrawerMenu = () => {
      open_menu.value = true;
    };

    const logout = () => {
      document.cookie =
        "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
      document.cookie =
        "user_name=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
      delete axios.defaults.headers.common["Authorization"];
      window.location.href = "/";
    };
    return {
      open_menu,
      showDrawerMenu,
      logout,
    };
  },
};
</script>
<style scoped>
.dropdown:hover .dropdown-menu {
  display: block;
  animation: fadeInUp 0.35s ease-in-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
