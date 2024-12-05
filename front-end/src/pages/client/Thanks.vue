<template>
  <div class="container-fluid bg-primary py-4">
    <div class="container text-white">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex flex-column col-12">
          <div class="fw-bold text-uppercase fs-5 ">Cảm ơn bạn</div>
          <div>Chúng tôi xin chân thành cảm ơn bạn đã tin tưởng và ủng hộ</div>
        </div>
      </div>
    </div>
  </div>
  <div class="py-4">
    <div class="container container-thanks">
      <div class="thank-you">Cảm Ơn Bạn!</div>
      <div class="message">
        Bạn đã đặt hàng thành công tại NHGBookstore.<br />Chúng tôi sẽ xử lý đơn
        hàng của bạn sớm nhất có thể!
      </div>
      <img
        src="../../assets/images/logo.jpg"
        alt="NHGBookstore Logo"
        class="logo"
      />
      <!-- Thay đổi URL hình ảnh ở đây -->
      <div class="footer mt-4">
        Hẹn gặp lại bạn trong những lần sau!<br />
        <span
          >Bạn sẽ được chuyển hướng về trang giỏ hàng sau
          <span class="text-primary">{{ countdown }} giây.</span>
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { handleNavigate } from "@/utils/utils";
import {useRouter} from 'vue-router';
const countdown = ref(10);
const router = useRouter();
onMounted(() => {
  if (window.location.href.includes("?")) {
    // Chuyển hướng lần nữa mà không có tham số URL
    window.history.replaceState({}, document.title, "/thanks");
  }
  const interval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(interval); // Dừng bộ đếm khi countdown = 0
      handleNavigate(router, "cart");
    }
  }, 1000);
});
</script>
<style scoped>
.container-thanks {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.thank-you {
  font-size: 2rem;
  margin-bottom: 10px;
}
.message {
  font-size: 1.25rem;
  margin-bottom: 20px;
}
.logo {
  width: 150px;
  margin-top: 20px;
  animation: bounce 1s infinite alternate;
}
@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10px);
  }
}
</style>
