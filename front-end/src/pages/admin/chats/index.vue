<template>
  <div>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Tin nhắn</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <div class="row">
          <div class="col-12">
            <div class="container-fluid h-100">
              <div class="row h-100">
                <!-- Conversation List -->
                <SidebarChat />

                <!-- Main Chat Area -->
                <div class="col-md-9 d-flex flex-column p-0">
                  <div
                    class="flex-grow-1 d-flex align-items-center justify-content-center bg-light"
                  >
                    <p class="text-muted">
                      Chọn một cuộc trò chuyện để bắt đầu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-layout-content>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { io } from "socket.io-client";
import ApiAdmin from "../../../service/admin/apiAdmin.service";
import moment from "moment";
import { formatDate } from "@/utils/utils";
import { useRouter } from "vue-router";
import SidebarChat from "../../../components/admin/chats/SidebarChat.vue";
//
const apiAdmin = new ApiAdmin();
const conversations = ref([]);
const socket = ref(null);
const selectedConversation = ref(null);
const newMessage = ref("");
const searchTerm = ref("");
const chatContainer = ref(null);
const router = useRouter();
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.min-width-0 {
  min-width: 0;
}
</style>
