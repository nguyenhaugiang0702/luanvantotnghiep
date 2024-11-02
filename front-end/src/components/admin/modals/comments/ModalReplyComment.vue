<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="replyComment"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Trả lời bình luận</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addReplyComment">
            <div class="form-group">
              <label for="">Nội dung bình luận</label>
              <textarea
                v-model="comment.content"
                class="form-control"
                readonly
                rows="5"
              ></textarea>
            </div>
            <div class="form-group mt-3">
              <label for="">Trả lời bình luận</label>
              <textarea
                v-model="comment.replyContent"
                class="form-control"
                rows="5"
              ></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Đóng
              </button>
              <button type="submit" class="btn btn-primary">Lưu Thay Đổi</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, defineComponent, onMounted, nextTick } from "vue";
import { authorSchema } from "@/utils/schema.util";
import ApiAdmin from "@/service/admin/apiAdmin.service";
import config from "@/config";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

export default defineComponent({
  props: {
    commentObj: {
      type: Object,
      default: () => ({
        replyContent: "",
      }),
    },
  },
  emit: ["refreshComment"],
  setup(props, { emit }) {
    const comment = ref({ ...props.commentObj });
    const apiAdmin = new ApiAdmin();

    watch(
      () => props.commentObj,
      (newValue) => {
        comment.value = { ...newValue };
        // Gán replyContent từ phản hồi đầu tiên nếu có
        if (comment.value.replies && comment.value.replies.length > 0) {
          comment.value.replyContent = comment.value.replies[0]?.commentID?.content;
        } else {
          comment.value.replyContent = "";
        }
      },
      { deep: true }
    );
    watch(
      () => comment.value.replyContent,
      (newValue) => {
        comment.value.replyContent = newValue;
      },
      { deep: true }
    );

    const addReplyComment = async () => {
      if (!comment.value.replyContent) {
        return showErrorToast("Vui lòng nhập nội dung trả lời");
      }
      try {
        const response = await apiAdmin.put(
          `/comments/${comment.value._id}/reply`,
          comment.value
        );
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          $("#replyComment").modal("hide");
          emit("refreshComment");
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };
    return {
      comment,
      config,
      addReplyComment,
    };
  },
});
</script>
