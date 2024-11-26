<template>
  <div>
    <!-- Chat box -->
    <div class="card" style="width: 27rem; height: 30rem">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5 class="mb-0">NHG BOOKSTORE CHAT BOT</h5>
        <button class="btn btn-light btn-sm" @click="closeChat">
          <i class="fa-solid fa-x"></i>
        </button>
      </div>
      <div
        ref="chatContainer"
        class="card-body overflow-auto"
        style="max-height: 25rem"
      >
        <div class="flex-grow-1">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[message.sender === 'user' ? 'text-end' : 'text-start']"
            class="mt-3"
          >
            <div
              :class="[
                'd-inline-block p-2 rounded',
                message.sender === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-white border',
              ]"
            >
              <!-- Kiểm tra xem nếu message.text là một mảng sách -->
              <div v-if="Array.isArray(message.books)">
                <p>{{ message.text }}</p>
                <div
                  class="d-flex my-3"
                  v-for="(book, idx) in message.books"
                  :key="idx"
                >
                  <router-link
                    class="d-flex text-decoration-none"
                    :to="{ name: 'book-detail', params: { bookID: book._id } }"
                  >
                    <img
                      :src="config.imgUrl + '/' + book.image"
                      alt="book image"
                      style="width: 100px; height: auto"
                    />
                    <div class="d-flex flex-column ms-3">
                      <p class="mb-0">
                        {{ book.name }}
                      </p>
                      <p class="mb-0 text-danger">
                        Giá: {{ formatPrice(book.price) }}
                      </p>
                    </div>
                  </router-link>
                </div>
              </div>
              <!-- Nếu message.books là object -->
              <div v-else-if="typeof message.books === 'object' && message.books !== null">
                <p>{{ message.text }}</p>
                <div class="d-flex my-3">
                  <router-link
                    class="d-flex text-decoration-none"
                    :to="{ name: 'book-detail', params: { bookID: message.books._id } }"
                  >
                    <img
                      :src="config.imgUrl + '/' + message.books.image"
                      alt="book image"
                      style="width: 100px; height: auto"
                    />
                    <div class="d-flex flex-column ms-3">
                      <p class="mb-0">
                        {{ message.books.book_name }}
                      </p>
                      <p class="mb-0 text-danger ">
                        Giá: {{ formatPrice(message.books.finalPrice) }}
                      </p>
                      <p class="mb-0">
                        Tác giả: {{ message.books.author }}
                      </p>
                      <p class="mb-0">
                        Nhà xuất bản: {{ message.books.publisher }}
                      </p>
                      <p class="mb-0">
                        Hình thức: {{ message.books.formality }}
                      </p>
                      <p class="mb-0">
                        Năm XB: {{ message.books.publisher_year }}
                      </p>
                      <p class="mb-0">
                        Thể loại: {{ message.books.category }}
                      </p>
                      <p class="mb-0">
                        Số lượng còn lại: {{ message.books.quantityAvailable }}
                      </p>
                    </div>
                  </router-link>
                </div>
              </div>
              <div v-else>
                <p class="mb-0">{{ message.text }}</p>
                <small
                  class="text-white"
                  :class="[
                    'd-block',
                    message.sender === 'user'
                      ? 'text-white opacity-75'
                      : 'text-muted',
                  ]"
                >
                  {{ formatDate(message.createdAt) }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <form @submit.prevent="sendMessage" class="d-flex">
          <input
            v-model="newMessage"
            type="text"
            class="form-control me-2"
            placeholder="Nhập tin nhắn..."
          />
          <button type="submit" class="btn btn-primary">
            <i class="fa-regular fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import axios from "axios"; // Import axios
import { formatDate } from "@/utils/utils";
import { v4 as uuidv4 } from "uuid";
import { formatPrice } from "@/utils/utils";
import config from "@/config/index";
import { handleNavigate } from "@/utils/utils";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";

const isOpen = ref(false);
const newMessage = ref("");
const messages = ref([]); // Lưu lịch sử tin nhắn
const chatContainer = ref(null);
const sessionId = ref("");
const router = useRouter();
const emit = defineEmits("close-chat");

// Gửi tin nhắn tới Rasa
const sendMessage = async () => {
  if (newMessage.value.trim() !== "") {
    // Thêm tin nhắn người dùng vào danh sách

    messages.value.push({
      sender: "user",
      text: newMessage.value,
      createdAt: new Date(),
    });

    // Gửi tin nhắn tới Rasa qua API REST
    try {
      const response = await axios.post(
        "http://localhost:5005/webhooks/rest/webhook",
        {
          sender: sessionId.value,
          message: newMessage.value,
        }
      );
      // Xóa nội dung nhập
      newMessage.value = "";
      // Lưu tin nhắn vào localStorage
      localStorage.setItem("chatMessages", JSON.stringify(messages.value));

      // Đảm bảo bot phản hồi
      response.data.forEach((message) => {
        console.log(message);
        // Kiểm tra nếu message chứa thông tin sách (giả sử bot trả về mảng các đối tượng)
        if (message.custom) {
          // Nếu là mảng, mỗi phần tử chứa thông tin sách
          if (Array.isArray(message.custom.books)) {
            messages.value.push({
              sender: "bot",
              books: message.custom.books, 
              text: message.custom.text, 
              createdAt: new Date(),
            });
          } else if (
            typeof message.custom.books === "object" &&
            message.custom.books !== null
          ) {
            // Xử lý nếu books là object
            messages.value.push({
              sender: "bot",
              books: message.custom.books, // Chuyển books thành mảng với một phần tử là object
              text: message.custom.text, // Văn bản đi kèm
              createdAt: new Date(),
            });
          }
        } else {
          // Nếu chỉ là một thông báo đơn giản từ bot
          messages.value.push({
            sender: "bot",
            text: message.text || "Đang cập nhật",
            createdAt: new Date(),
          });
        }
      });
      // Lưu tin nhắn vào localStorage sau khi nhận phản hồi từ bot
      localStorage.setItem("chatMessages", JSON.stringify(messages.value));

      scrollToBottom();
    } catch (error) {
      console.error("Error sending message to Rasa:", error);
    }
  }
};

const closeChat = () => {
  emit("close-chat");
};

// Cuộn tới cuối phần hiển thị tin nhắn
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

// Khởi tạo sessionId nếu chưa có
onMounted(async () => {
  const savedMessages = localStorage.getItem("chatMessages");
  if (savedMessages) {
    messages.value = JSON.parse(savedMessages); // Đọc dữ liệu từ localStorage và gán lại cho messages
  } else {
    messages.value = [];
    messages.value.push({
      sender: "bot",
      text: "NHG BOOKSTORE rất hân hạnh được phục vụ quý khách",
      createdAt: new Date(),
    });
  }
  sessionId.value = localStorage.getItem("sessionId") || uuidv4();
  localStorage.setItem("sessionId", sessionId.value);
  scrollToBottom();
});

// Ngắt kết nối WebSocket khi component bị hủy
onBeforeUnmount(() => {});
</script>

<style scoped>
.card-body {
  max-height: 14rem;
}

button.btn-rounded {
  border-radius: 50%;
}
</style>
