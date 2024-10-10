<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="showImagesComment"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Tất cả ảnh ( MAX: 5 )</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-around" >
            <div class="col-2 me-3" v-for="image in comment.images">
              <img class="w-100" :src="`${config.imgUrl}/${image.path}`" alt="" />
            </div>
          </div>
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
export default defineComponent({
  props: {
    commentObj: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const comment = ref({ ...props.commentObj });
    watch(
      () => props.commentObj,
      (newValue) => {
        comment.value = { ...newValue };
      },
      { deep: true }
    );
    return {
      comment,
      config,
    };
  },
});
</script>
