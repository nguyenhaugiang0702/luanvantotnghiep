<template>
  <div class="comment-section">
    <h3 class="my-4">Đánh giá sản phẩm</h3>
    <hr />
    <div class="bg-white p-3 rounded">
      <!-- Hiển thị các bình luận -->
      <div v-for="(comment, index) in comments" :key="index" class="mb-4">
        <div class="d-flex align-items-center">
          <!-- Avatar người dùng -->
          <img
            :src="`http://localhost:3000/` + comment.userID?.avatar"
            alt="User Avatar"
            class="rounded-circle me-3"
            style="width: 50px; height: 50px"
          />
          <div>
            <h5 class="mb-0">
              {{ comment.userID?.firstName + " " + comment.userID?.lastName }}
            </h5>
            <!-- Số sao đánh giá -->
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
            <p class="text-muted">{{ moment(comment.createdAt).fromNow() }}</p>
          </div>
        </div>
        <p class="mt-2">{{ comment.content }}</p>

        <!-- Hiển thị ảnh sản phẩm đã mua -->
        <div v-if="comment.images.length !== 0" class="product-images mt-3">
          <h6>Ảnh sản phẩm đã mua:</h6>
          <div class="row">
            <a-image
              v-for="image in comment.images"
              :src="`http://localhost:3000/` + image.path"
              :width="120"
              :height="100"
            />
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

    <!-- Phần thêm bình luận -->
    <div class="mt-4">
      <h4>Thêm bình luận của bạn</h4>
      <textarea
        v-model="newComment.content"
        class="form-control mb-2"
        rows="3"
        placeholder="Viết bình luận..."
      ></textarea>

      <!-- Chọn số sao -->
      <div class="mb-2">
        <label class="me-2">Đánh giá:</label>
        <span>
          <a-rate v-model:value="newComment.rating" :tooltips="desc" />
          <span class="ant-rate-text">{{ desc[value - 1] }}</span>
        </span>
      </div>

      <div class="clearfix">
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
            <div style="margin-top: 8px">
              Upload
              <div>(Max: 5)</div>
            </div>
          </div>
        </a-upload>
        <a-modal
          :open="previewVisible"
          :title="previewTitle"
          :footer="null"
          @cancel="handleCancel"
        >
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </div>

      <!-- Nút gửi bình luận -->
      <button @click="addComment" class="btn btn-primary">Gửi bình luận</button>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, defineProps, toRefs, onMounted } from "vue";
import { formatDate } from "@/utils/utils";
import ApiUser from "@/service/user/apiUser.service";
import Cookies from "js-cookie";
import { toast } from "vue3-toastify";
import moment from "moment";

const value = ref(0);
const desc = ref(["terrible", "bad", "normal", "good", "wonderful"]);
const apiUser = new ApiUser();
const token = Cookies.get("accessToken");
const isLoggedIn = Cookies.get("isLoggedIn");
const comments = ref([]);
const props = defineProps({
  bookID: String,
});

const { bookID } = toRefs(props);

watch(value, (newVal) => {
  newComment.value.rating = newVal;
});

const getComments = async () => {
  const response = await apiUser.get("/comments");
  if (response.status === 200) {
    console.log(response.data);
    comments.value = response.data;
  }
};

onMounted(() => {
  getComments();
});
const isAdmin = ref(true);

const newComment = ref({
  content: "",
  rating: 0,
});

// Thêm bình luận mới
const addComment = async () => {
  if (!token || !isLoggedIn) {
    toast("Vui lòng đăng nhập để đánh giá", {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
    return;
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
        toast(response.data.message, {
          theme: "auto",
          type: "success",
          dangerouslyHTMLString: true,
        });
        newComment.value.content = "";
        newComment.value.rating = "";
        fileList.value = [];
        getComments();
      }
    } catch (error) {
      console.log(error);
      toast(error.response?.data?.message, {
        theme: "auto",
        type: "error",
        dangerouslyHTMLString: true,
      });
    }
  } else {
    toast("Kiểm tra lại nội dung đánh giá", {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
  }
};

// // Admin phản hồi bình luận
// const replyToComment = (index) => {
//   const replyContent = prompt("Nhập phản hồi của bạn:");
//   if (replyContent) {
//     comments.value[index].replies.push({
//       content: replyContent,
//       date: format(new Date(), "dd/MM/yyyy"),
//     });
//   }
// };

// // Admin xóa bình luận
// const deleteComment = (index) => {
//   comments.value.splice(index, 1);
// };

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
const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = "";
};
const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value =
    file.name || file.url.substring(file.url.lastIndexOf("/") + 1);
};
</script>

<style scoped>
.comment-section {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.stars i {
  font-size: 18px;
}

/* .comment-section {
  max-height: 400px;
  overflow-y: auto;
} */

.img-thumbnail {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.replies-section {
  margin: 1.5rem 0 1.5rem 2.5rem;
}

.admin-reply {
  position: relative;
  margin-bottom: 1.5rem;
}

.reply-container {
  background: linear-gradient(145deg, #ffffff, #f5f7fa);
  border-left: 4px solid #0d6efd;
  border-radius: 0 12px 12px 0;
  padding: 1.25rem;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
}

.admin-info {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.admin-avatar-wrapper {
  position: relative;
  margin-right: 1rem;
}

.admin-avatar {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  background: #0d6efd;
  border: 2px solid white;
  border-radius: 50%;
}

.admin-details {
  flex: 1;
}

.admin-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.admin-name h6 {
  margin: 0;
  font-weight: 600;
  color: #2c3e50;
}

.badge {
  background: #0d6efd;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timestamp {
  font-size: 0.8rem;
  color: #94a3b8;
}

.reply-message {
  position: relative;
}

.message-content {
  color: #374151;
  line-height: 1.6;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.7);
  padding: 1rem;
  border-radius: 8px;
  backdrop-filter: blur(8px);
}

/* Hover effects */
.reply-container:hover {
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
  transition: all 0.3s ease;
}

/* Optional: Add a subtle line connecting replies */
.admin-reply:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 22px;
  top: 65px;
  bottom: -15px;
  width: 2px;
  background: #e5e7eb;
}
</style>
