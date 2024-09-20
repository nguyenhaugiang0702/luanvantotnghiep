<template>
  <div class="container">
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
</template>
<script setup>
import { ref, onMounted } from "vue";
import { handleNavigate } from "@/utils/utils";
const countdown = ref(10);
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
      handleNavigate("cart");
    }
  }, 1000);
});
</script>
<style scoped>
.container {
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
