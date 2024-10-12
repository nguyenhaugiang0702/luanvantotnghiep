<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="updateAuthor"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Chỉnh sửa tác giả</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateAuthor">
            <div class="form-group">
              <label for="authorName" class="form-label">Tên tác giả</label>
              <Field
                name="authorName"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.authorName,
                  'is-valid': !errors.authorName && authorToEdit.name !== '',
                }"
                id="authorName"
                placeholder="Tên tác giả"
                v-model="authorToEdit.name"
              />
              <ErrorMessage name="authorName" class="invalid-feedback" />
            </div>
            <div class="form-group">
              <label for="authorDob" class="form-label">Ngày sinh</label>
              <Field
                name="authorDob"
                id="authorDob"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.authorDob,
                  'is-valid': !errors.authorDob && authorToEdit.dob !== '',
                }"
                placeholder="Nhập ngày sinh"
                v-model="authorToEdit.dob"
              />
              <ErrorMessage name="authorDob" class="invalid-feedback" />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Đóng
              </button>
              <button type="submit" class="btn btn-primary">
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, defineComponent, onMounted, nextTick } from "vue";
import { useForm, Field, ErrorMessage } from "vee-validate";
import { authorSchema } from "@/utils/schema.util";
import ApiAdmin from "@/service/admin/apiAdmin.service";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

export default defineComponent({
  components: { Field, ErrorMessage },
  props: {
    authorToEdit: {
      type: Object,
      default: () => ({
        name: "",
        dob: "",
      }),
    },
  },
  emits: ["refreshAuthors"],
  setup(props, { emit }) {
    const authorToEdit = ref({ ...props.authorToEdit });
    const authorDobRef = ref(null);
    const { errors, validate, resetForm } = useForm({
      validationSchema: authorSchema,
    });

    const apiAdmin = new ApiAdmin();

    const updateAuthor = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      try {
        const data = {
          name: authorToEdit.value.name,
          dob: authorToEdit.value.dob,
        };

        const response = await apiAdmin.put(
          `/authors/${props.authorToEdit._id}`,
          data
        );
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          resetForm();
          $("#updateAuthor").modal("hide");
          emit("refreshAuthors");
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    onMounted(() => {
      flatpickr("#authorDob", {
        dateFormat: "d/m/Y",
      });
    });

    // Watch prop để cập nhật trạng thái nếu prop thay đổi
    watch(
      () => props.authorToEdit,
      (newValue) => {
        authorToEdit.value = { ...newValue };
      },
      { deep: true }
    );

    // Trả về các thuộc tính và phương thức cần thiết cho template
    return {
      authorToEdit,
      errors,
      updateAuthor,
      authorDobRef,
    };
  },
});
</script>
