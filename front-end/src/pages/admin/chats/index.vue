<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý tin nhắn
    </a-layout-header>
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
                <div class="col-md-3 bg-white border-end p-0">
                  <div class="p-3 border-bottom">
                    <!-- <h2 class="h5 mb-3">Conversations</h2> -->
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Search conversations..."
                        v-model="searchTerm"
                      />
                    </div>
                  </div>
                  <div class="overflow-auto" style="height: calc(100% - 100px)">
                    <div
                      v-for="conv in filteredConversations"
                      :key="conv.id"
                      class="p-3 border-bottom cursor-pointer"
                      :class="{
                        'bg-light': selectedConversation?.id === conv.id,
                      }"
                      @click="selectConversation(conv)"
                    >
                      <div class="d-flex align-items-center">
                        <img
                          :src="conv.user.avatar"
                          :alt="conv.user.name"
                          class="rounded-circle me-3"
                          width="40"
                          height="40"
                        />
                        <div class="flex-grow-1 min-width-0">
                          <p class="mb-0 font-weight-medium text-truncate">
                            {{ conv.user.name }}
                          </p>
                          <p class="mb-0 small text-muted text-truncate">
                            {{ conv.lastMessage }}
                          </p>
                        </div>
                        <small class="text-muted">{{ conv.timestamp }}</small>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Main Chat Area -->
                <div class="col-md-9 d-flex flex-column p-0">
                  <template v-if="selectedConversation">
                    <!-- Chat Header -->
                    <div
                      class="p-3 border-bottom bg-white d-flex justify-content-between align-items-center"
                    >
                      <div class="d-flex align-items-center">
                        <img
                          :src="selectedConversation.user.avatar"
                          :alt="selectedConversation.user.name"
                          class="rounded-circle me-3"
                          width="40"
                          height="40"
                        />
                        <div>
                          <h2 class="h5 mb-0">
                            {{ selectedConversation.user.name }}
                          </h2>
                          <p class="mb-0 small text-muted">
                            {{ selectedConversation.user.email }}
                          </p>
                        </div>
                      </div>
                      <div>
                        <button class="btn btn-outline-secondary me-2">
                          <i class="bi bi-telephone"></i>
                        </button>
                        <button class="btn btn-outline-secondary">
                          <i class="bi bi-camera-video"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Messages -->
                    <div class="flex-grow-1 p-3 bg-light overflow-auto">
                      <div
                        v-for="(
                          message, index
                        ) in selectedConversation.messages"
                        :key="index"
                        :class="[
                          'mb-3',
                          message.sender === 'admin'
                            ? 'text-end'
                            : 'text-start',
                        ]"
                      >
                        <div
                          :class="[
                            'd-inline-block p-2 rounded',
                            message.sender === 'admin'
                              ? 'bg-primary text-white'
                              : 'bg-white border',
                          ]"
                        >
                          <p class="mb-0">{{ message.text }}</p>
                          <small class="text-muted d-block mt-1">{{
                            message.timestamp
                          }}</small>
                        </div>
                      </div>
                    </div>

                    <!-- Message Input -->
                    <form
                      @submit.prevent="handleSendMessage"
                      class="p-3 bg-white border-top"
                    >
                      <div class="input-group">
                        <input
                          v-model="newMessage"
                          type="text"
                          class="form-control"
                          placeholder="Type your message..."
                        />
                        <button type="submit" class="btn btn-primary">
                          <i class="bi bi-send me-2"></i>
                          Send
                        </button>
                      </div>
                    </form>
                  </template>
                  <div
                    v-else
                    class="flex-grow-1 d-flex align-items-center justify-content-center bg-light"
                  >
                    <p class="text-muted">
                      Select a conversation to start chatting
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
import { ref, computed, onMounted } from "vue";

const conversations = ref([
  {
    id: "1",
    user: {
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    messages: [
      {
        sender: "user",
        text: "Hi, I have a question about my order",
        timestamp: "10:00 AM",
      },
      {
        sender: "admin",
        text: "Hello Alice, I'd be happy to help. What's your order number?",
        timestamp: "10:02 AM",
      },
      { sender: "user", text: "It's #12345", timestamp: "10:03 AM" },
    ],
    lastMessage: "It's #12345",
    timestamp: "10:03 AM",
  },
  {
    id: "2",
    user: {
      name: "Bob Smith",
      email: "bob@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    messages: [
      {
        sender: "user",
        text: "Hello, is the blue shirt in stock?",
        timestamp: "9:45 AM",
      },
      {
        sender: "admin",
        text: "Hi Bob, let me check that for you.",
        timestamp: "9:47 AM",
      },
    ],
    lastMessage: "Hi Bob, let me check that for you.",
    timestamp: "9:47 AM",
  },
]);

const selectedConversation = ref(conversations.value[0]);
const newMessage = ref("");
const searchTerm = ref("");

const filteredConversations = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return conversations.value.filter(
    (conv) =>
      conv.user.name.toLowerCase().includes(term) ||
      conv.user.email.toLowerCase().includes(term) ||
      conv.messages.some((msg) => msg.text.toLowerCase().includes(term))
  );
});

const selectConversation = (conversation) => {
  selectedConversation.value = conversation;
};

const handleSendMessage = () => {
  if (newMessage.value.trim() && selectedConversation.value) {
    // In a real application, you would send this message to a backend
    console.log("Sending message:", newMessage.value);
    newMessage.value = "";
  }
};

onMounted(() => {
  // Any initialization logic can go here
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.min-width-0 {
  min-width: 0;
}
</style>
