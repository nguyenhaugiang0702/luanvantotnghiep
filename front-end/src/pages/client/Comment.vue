<template>
  <h3 class="my-4">Đánh giá sản phẩm</h3>
  <div class="row">
    <hr />
  </div>
  <div class="comment-section bg-white p-3 rounded">
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
            <i v-for="n in comment.star" :key="n" class="fa-solid fa-star"></i>
            <i
              v-for="n in 5 - comment.star"
              :key="n"
              class="fa-solid fa-star text-secondary"
            ></i>
          </div>
          <p class="text-muted">{{ formatDate(comment.createdAt) }}</p>
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

      <!-- Nếu là admin thì hiển thị nút phản hồi -->
      <div v-if="comment.isAdmin" class="d-flex">
        <button
          @click="replyToComment(index)"
          class="btn btn-outline-secondary btn-sm me-2"
        >
          Phản hồi
        </button>
        <button
          @click="deleteComment(index)"
          class="btn btn-outline-danger btn-sm"
        >
          Xóa
        </button>
      </div>

      <!-- Phần phản hồi của admin -->
      <div v-if="comment.replies.length" class="mt-3 ms-5">
        <div
          v-for="(reply, rIndex) in comment.replies"
          :key="rIndex"
          class="d-flex align-items-start mt-2"
        >
          <img
            src=""
            alt="Admin Avatar"
            class="rounded-circle me-3"
            style="width: 50px; height: 50px"
          />
          <div>
            <h6 class="mb-0">Admin</h6>
            <p class="text-muted">{{ reply.date }}</p>
            <p>{{ reply.content }}</p>
          </div>
        </div>
      </div>
      <hr>

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
          <div style="margin-top: 8px">Upload <div>(Max: 5)</div></div>
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
</template>
<script setup>
import { ref, watch, defineProps, toRefs, onMounted } from "vue";
import { formatDate } from "@/utils/utils";
import CommentService from "@/service/comment.service";
import Cookies from "js-cookie";
import { toast } from "vue3-toastify";

const value = ref(0);
const desc = ref(["terrible", "bad", "normal", "good", "wonderful"]);
const commentService = new CommentService();
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
  const response = await commentService.get("/");
  if (response.status === 200) {
    comments.value = response.data;
    console.log(response.data);
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
  if(!token || !isLoggedIn){
    toast("Vui lòng đăng nhập để đánh giá", {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
    return ;
  }
  if (newComment.value.content && newComment.value.rating > 0) {
    const formData = new FormData();
    formData.append("fileType", "comment");
    formData.append("content", newComment.value.content);
    formData.append("rating", newComment.value.rating);
    if (fileList.value.length > 0) {
      fileList.value.forEach((file) => {
        formData.append("images", file.originFileObj); // Lấy file gốc để gửi đi
      });
    }
    try {
      const response = await commentService.put(
        `/${bookID.value}`,
        formData,
        token
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

// Admin phản hồi bình luận
const replyToComment = (index) => {
  const replyContent = prompt("Nhập phản hồi của bạn:");
  if (replyContent) {
    comments.value[index].replies.push({
      content: replyContent,
      date: format(new Date(), "dd/MM/yyyy"),
    });
  }
};

// Admin xóa bình luận
const deleteComment = (index) => {
  comments.value.splice(index, 1);
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
</style>
