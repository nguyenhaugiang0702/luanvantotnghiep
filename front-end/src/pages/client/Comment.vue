<template>
  <div class="comment-section">
    <h3 class="my-4">Đánh giá sản phẩm</h3>
    <hr />
    <div class="bg-white p-3 rounded comments-wrapper">
      <!-- Hiển thị các bình luận -->
      <div v-for="(comment, index) in comments" :key="index" class="mb-4">
        <div class="d-flex align-items-center gap-3">
          <!-- Avatar người dùng -->
          <div class="position-relative">
            <img
              :src="`${config.imgUrl}/` + comment.userID?.avatar"
              alt="User Avatar"
              class="rounded-circle user-avatar"
              style="width: 50px; height: 50px"
            />
          </div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h5 class="mb-1 fw-semibold">
                  {{
                    comment.userID?.firstName + " " + comment.userID?.lastName
                  }}
                </h5>
                <!-- Số sao đánh giá -->
                <div class="d-flex align-items-center gap-2">
                  <div class="stars text-warning">
                    <i
                      v-for="n in comment.star"
                      :key="n"
                      class="fa-solid fa-star"
                    ></i>
                    <i
                      v-for="n in 5 - comment.star"
                      :key="n"
                      class="fa-solid fa-star text-secondary"
                    ></i>
                  </div>
                  <small class="text-muted">{{
                    moment(comment.createdAt).fromNow()
                  }}</small>
                </div>
              </div>
            </div>
          </div>
          <!-- Like/Dislike Section -->
          <div class="reaction-buttons d-flex gap-3">
            <div class="reaction-button d-flex align-items-center">
              <a-tooltip title="Hữu ích">
                <button
                  class="btn btn-link p-0 d-flex align-items-center text-decoration-none"
                  @click="like(comment._id)"
                >
                  <template v-if="comment.isLiked">
                    <LikeFilled class="reaction-icon liked" />
                  </template>
                  <template v-else>
                    <LikeOutlined class="reaction-icon" />
                  </template>
                  <span class="reaction-count ms-2">{{ comment.liked }}</span>
                </button>
              </a-tooltip>
            </div>
            <div class="reaction-button d-flex align-items-center">
              <a-tooltip title="Không hữu ích">
                <button
                  class="btn btn-link p-0 d-flex align-items-center text-decoration-none"
                  @click="dislike(comment._id)"
                >
                  <template v-if="comment.isDisliked">
                    <DislikeFilled class="reaction-icon disliked" />
                  </template>
                  <template v-else>
                    <DislikeOutlined class="reaction-icon" />
                  </template>
                  <span class="reaction-count ms-2">{{
                    comment.disLiked
                  }}</span>
                </button>
              </a-tooltip>
            </div>
          </div>
        </div>

        <!-- Comment Content -->
        <div class="mt-3">
          <p class="mb-3">{{ comment.content }}</p>
        </div>

        <!-- Hiển thị ảnh sản phẩm đã mua -->
        <div
          v-if="comment.images.length !== 0"
          class="product-images bg-light rounded-3 p-3 mt-3"
        >
          <h6 class="mb-3 text-secondary fw-semibold">Ảnh sản phẩm đã mua:</h6>
          <div class="row g-2">
            <div v-for="image in comment.images" class="col-auto me-2">
              <a-image
                :src="`${config.imgUrl}/` + image.path"
                :width="100"
                :height="120"
                class="rounded-3"
              />
            </div>
          </div>
        </div>

        <!-- Phần phản hồi của admin -->
        <div v-if="comment.replies.length" class="replies-section">
          <div
            v-for="(reply, rIndex) in comment.replies"
            :key="rIndex"
            class="admin-reply"
          >
            <div class="reply-container">
              <div class="admin-info">
                <div class="admin-avatar-wrapper">
                  <img
                    src="../../assets/images/logo.jpg"
                    alt="Admin Avatar"
                    class="admin-avatar"
                  />
                  <span class="status-dot"></span>
                </div>

                <div class="admin-details">
                  <div class="admin-name">
                    <span class="badge">Official</span>
                    <h6>NHG BOOKSTORE</h6>
                  </div>
                  <span class="timestamp">{{
                    moment(comment.createdAt).fromNow()
                  }}</span>
                </div>
              </div>

              <div class="reply-message">
                <div class="message-content">
                  {{ reply.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
    <Pagination
    :currentPage="currentPage"
    :totalPages="totalPages"
    @updatePage="handlePageChange"
  />

    <!-- Phần thêm bình luận -->
    <div class="add-comment-section bg-light rounded-3 p-4 mt-4">
      <h4 class="mb-4 fw-semibold">Thêm bình luận của bạn</h4>
      <div class="mb-3">
        <textarea
          v-model="newComment.content"
          class="form-control"
          rows="3"
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
        ></textarea>
      </div>

      <!-- Chọn số sao -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Đánh giá:</label>
        <div class="d-flex align-items-center gap-2">
          <a-rate v-model:value="newComment.rating" :tooltips="desc" />
          <span class="text-muted small">{{ desc[value - 1] }}</span>
        </div>
      </div>

      <div class="upload-section bg-white rounded-3 p-3 mb-3">
        <a-upload
          :multiple="true"
          :maxCount="5"
          v-model:file-list="fileList"
          :beforeUpload="() => false"
          list-type="picture-card"
          @preview="handlePreview"
        >
          <div v-if="fileList.length < 8">
            <plus-outlined />
            <div class="mt-2 text-secondary">
              Upload
              <div class="small">(Max: 5)</div>
            </div>
          </div>
        </a-upload>
      </div>

      <!-- Nút gửi bình luận -->
      <button @click="addComment" class="btn btn-primary px-4">
        Gửi bình luận
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, defineProps, toRefs, onMounted } from "vue";
import { formatDate } from "@/utils/utils";
import ApiUser from "@/service/user/apiUser.service";
import Cookies from "js-cookie";
import moment from "moment";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import config from "@/config/index";
import Pagination from '../../components/Pagination.vue';

const value = ref(0);
const desc = ref(["terrible", "bad", "normal", "good", "wonderful"]);
const apiUser = new ApiUser();
const token = Cookies.get("accessToken");
const isLoggedIn = Cookies.get("isLoggedIn");
const comments = ref([]);
const props = defineProps({
  bookID: String,
});
const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(3);

const { bookID } = toRefs(props);

watch(value, (newVal) => {
  newComment.value.rating = newVal;
});

const getComments = async (page, limit) => {
  const response = await apiUser.get(`/comments?page=${page}&limit=${limit}`);
  if (response.status === 200) {
    comments.value = response.data.comments;
    currentPage.value = response.data.currentPage;
    totalPages.value = response.data.totalPages;
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
  getComments(currentPage.value, limit.value);
};

onMounted(() => {
  getComments(currentPage.value, limit.value);
});
const isAdmin = ref(true);

const newComment = ref({
  content: "",
  rating: 0,
});

// Thêm bình luận mới
const addComment = async () => {
  if (!token || !isLoggedIn) {
    return showErrorToast("Vui lòng đăng nhập");
  }

  if (newComment.value.content && newComment.value.rating > 0) {
    const formData = new FormData();
    formData.append("fileType", "comment");
    formData.append("content", newComment.value.content);
    formData.append("rating", newComment.value.rating);
    if (fileList.value.length > 0) {
      console.log(fileList.value);
      fileList.value.forEach((file) => {
        formData.append("images", file.originFileObj); // Lấy file gốc để gửi đi
      });
    }
    try {
      const response = await apiUser.put(
        `/comments/${bookID.value}`,
        formData,
        "multipart/form-data"
      );
      if (response.status === 200) {
        showSuccessToast(response?.data?.message);
        newComment.value.content = "";
        newComment.value.rating = "";
        fileList.value = [];
        getComments();
      }
    } catch (error) {
      console.log(error);
      showErrorToast(error.response?.data?.message);
    }
  } else {
    showErrorToast("Kiểm tra lại nội dung đánh giá");
  }
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");
const fileList = ref([]);
const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value =
    file.name || file.url.substring(file.url.lastIndexOf("/") + 1);
};

const action = ref("");
const likes = ref(0);
const dislikes = ref(0);

const like = async (commentId) => {
  if (!token || !isLoggedIn) {
    return showErrorToast("Vui lòng đăng nhập");
  }
  let response;
  try {
    if (action.value === "liked") {
      action.value = "";
      likes.value -= 1;
      response = await apiUser.put(`/comments/${commentId}/like`, {
        action: "unlike",
      });
    } else {
      action.value = "liked";
      likes.value += 1;
      response = await apiUser.put(`/comments/${commentId}/like`, {
        action: "like",
      });
      if (action.value === "disliked") {
        dislikes.value -= 1;
      }
    }
    await getComments();
  } catch (error) {
    console.log(error);
    showErrorToast(error.response?.data?.message);
  }
};

const dislike = async (commentId) => {
  if (!token || !isLoggedIn) {
    return showErrorToast("Vui lòng đăng nhập");
  }
  try {
    if (action.value === "disliked") {
      action.value = "";
      dislikes.value -= 1;
      await apiUser.put(`/comments/${commentId}/dislike`, {
        action: "undislike",
      });
    } else {
      action.value = "disliked";
      dislikes.value += 1;
      await apiUser.put(`/comments/${commentId}/dislike`, {
        action: "dislike",
      });

      if (action.value === "liked") {
        likes.value -= 1;
      }
    }
    await getComments();
  } catch (error) {
    console.log(error);
    showErrorToast(error.response?.data?.message);
  }
};
</script>

<style scoped>
@import "../../assets/css/client/comment/comment.css";
.reaction-button {
  transition: all 0.2s ease;
}

.reaction-icon {
  font-size: 18px;
  color: #6c757d;
  transition: all 0.2s ease;
}

.reaction-icon:hover {
  transform: scale(1.1);
}

.reaction-count {
  font-size: 14px;
  color: #6c757d;
  min-width: 20px;
}

.liked {
  color: #0d6efd;
}

.disliked {
  color: #dc3545;
}

/* Hiệu ứng hover cho nút reaction */
.reaction-button:hover .reaction-icon:not(.liked):not(.disliked) {
  color: #495057;
}

.reaction-button:hover .reaction-count {
  color: #495057;
}

/* Animation khi click */
.reaction-button:active .reaction-icon {
  transform: scale(0.95);
}
</style>
