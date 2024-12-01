<template>
  <div class="container-fluid bg-primary">
    <div class="row mx-auto">
      <div class="col-sm-2 mt-4">
        <img
          class="w-100 bg-white rounded rounded-4"
          src="../../assets/images/logo1.png"
          alt=""
        />
        <h4 class="text-white mt-4 text-center">
          Website bán sách số 1 Việt Nam
        </h4>
      </div>

      <div class="col-sm-3 text-white mt-4">
        <h5 class="mb-4">Thông tin liên hệ</h5>
        <hr class="text-white" />
        <p><i class="fa-solid fa-phone fs-5"></i> : 0384804407</p>
        <p>
          <i class="fa-solid fa-location-dot fs-5"></i> : Khu II, Đ. 3 Tháng 2,
          Xuân Khánh, Ninh Kiều, Cần Thơ
        </p>
        <p>
          <i class="fa-solid fa-envelope fs-5"></i> : bookstore112233@gmail.com
        </p>
        <a href="#" class="text-decoration-none">
          <i
            class="fa-brands fa-facebook fs-3 text-white icon_footer_contact"
          ></i>
        </a>
        <a href="#" class="text-decoration-none">
          <i
            class="fa-brands fa-youtube ms-3 fs-3 text-white icon_footer_contact"
          ></i>
        </a>
        <a href="#" class="text-decoration-none">
          <i
            class="fa-brands fa-twitter ms-3 fs-3 text-white icon_footer_contact"
          ></i>
        </a>
      </div>

      <div class="col-sm-2 text-white mt-4">
        <h5 class="mb-4">Chính sách bán hàng</h5>
        <hr class="text-white" />
        <ul class="list-unstyled">
          <li>
            <p>Hướng dẫn mua hàng</p>
          </li>
          <li>
            <p>Hướng dẫn thanh toán</p>
          </li>
          <li>
            <p>Chính sách vận chuyển</p>
          </li>
          <li>
            <p>Điều khoản dịch vụ</p>
          </li>
          <li>
            <p>Chính sách bảo mật</p>
          </li>
          <li>
            <p>Chính sách đổi trả</p>
          </li>
        </ul>
      </div>

      <div class="col-sm-2 text-white mt-4">
        <h5 class="mb-4">Hỗ trợ khách hàng</h5>
        <hr class="text-white" />
        <ul class="list-unstyled">
          <li>
            <p>Trang chủ</p>
          </li>
          <li>
            <p>Cửa hàng</p>
          </li>
          <li>
            <p>Mã giảm giá</p>
          </li>
          <li>
            <p>Giới thiệu</p>
          </li>
          <li>
            <p>Liên hệ</p>
          </li>
        </ul>
      </div>

      <div class="col-sm-2 text-white mt-4">
        <h5 class="mb-4">Bản đồ</h5>
        <hr class="text-white" />
        <div id="map">
          <iframe
            class="w-100"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d245.55804535365044!2d105.76820174754104!3d10.02274050793034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1675434954291!5m2!1svi!2s"
            style="border: 0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
    <hr class="text-white" />
    <div class="row mx-auto">
      <div class="col-3"></div>
      <div class="col-5 text-center text-white">&copy 2024 My Website</div>
      <div class="col-3"></div>
      <div class="col-1 text-end">
        <a href="#top" class="text-decoration-none text-end"
          ><i class="fa-solid fa-arrow-up text-white fs-2"></i>
        </a>
      </div>
    </div>
    <!-- Chat component fixed at the bottom-right -->
    <div class="position-fixed bottom-0 end-0">
      <!-- Chat button -->
      <div v-if="isChatButtonVisible" class="mb-2">
        <button class="btn btn-primary rounded-circle p-3" @click="toggleChat">
          <i class="fa-regular fa-comments fs-4"></i>
          <span
            v-if="hasNewMessage"
            class="notifycation translate-middle p-2 bg-danger border border-light rounded-circle"
          >
            <span class="visually-hidden"></span>
          </span>
        </button>
      </div>
      <!-- Chat AI button -->
      <div v-if="isChatAIButtonVisible">
        <button
          class="btn btn-primary rounded-circle p-3"
          @click="toggleChatAI"
        >
          <i class="fa-solid fa-robot fs-4"></i>
        </button>
      </div>

      <!-- Chat and ChatAI components -->
      <Chat
        v-if="isChatOpen"
        @close-chat="handleCloseChat"
        class="my-3"
      />
      <ChatAI v-if="isChatAIOpen" @close-chat="handleCloseChat" class="my-3" />
    </div>
  </div>
</template>
<script setup>
import Cookies from "js-cookie";
import Chat from "./Chat.vue";
import ChatAI from "./ChatAI.vue";
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { io } from "socket.io-client";
import ApiUser from "@/service/user/apiUser.service";

// Variables to track the visibility of buttons and whether the chats are open
const isChatButtonVisible = ref(true);
const isChatAIButtonVisible = ref(true);
const isChatOpen = ref(false);
const isChatAIOpen = ref(false);
const hasNewMessage = ref(false);
const socket = ref(null);
const token = Cookies.get("accessToken");
const chatRoomId = ref("");
const apiUser = new ApiUser();

// Toggle for Chat (regular chat)
const toggleChat = async () => {
  isChatButtonVisible.value = false; // ẩn button Chat
  isChatAIButtonVisible.value = false; // ẩn button chat AI
  isChatOpen.value = true; // hiện chat
  isChatAIOpen.value = false; // ẩn chat AI
  await openChat();
};

// Toggle for Chat AI
const toggleChatAI = () => {
  isChatButtonVisible.value = false;
  isChatAIButtonVisible.value = false;
  isChatOpen.value = false;
  isChatAIOpen.value = true;
};

watch(isChatAIOpen, (newValue) => {
  if (newValue) {
    isChatAIOpen.value = newValue;
  }
});

watch(isChatOpen, (newValue) => {
  if (newValue) {
    isChatOpen.value = newValue;
  }
});

const handleCloseChat = () => {
  isChatOpen.value = false;
  isChatAIOpen.value = false;
  isChatButtonVisible.value = true;
  isChatAIButtonVisible.value = true;
};

const checkRoomChat = async () => {
  if (token) {
    const response = await apiUser.get("/chats/checkRoomChat");
    if (response.status === 200) {
      chatRoomId.value = response.data.chatRoomID;
      hasNewMessage.value = response.data.hasNewMessage;
    }
  }
};

const openChat = async () => {
  scrollToBottom();
  await apiUser.put(`/chats/chatrooms/${chatRoomId.value}`, {
    isReaded: true,
  });
  await checkRoomChat();
};

onMounted(async () => {
  if (token) {
    await checkRoomChat();
    // Kết nối socket
    socket.value = io("http://localhost:3000", {
      timeout: 20000, // Tăng thời gian chờ lên 20 giây
    });

    // Nhận tin nhắn từ server
    socket.value.on("receiveMessage", (message) => {
      if (message.sender === "admin") {
        hasNewMessage.value = true;
        console.log(object);
      }
    });

    // Tham gia phòng chat
    socket.value.emit("joinRoom", chatRoomId.value);
  }
});

onBeforeUnmount(() => {
  // Đóng kết nối khi component bị hủy
  if (socket.value) {
    socket.value.disconnect();
  }
});
</script>
