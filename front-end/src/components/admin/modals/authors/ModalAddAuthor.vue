<template>
  <button
    type="button"
    class="btn btn-primary mb-3"
    data-bs-toggle="modal"
    data-bs-target="#addAuthor"
  >
    <i class="fa-solid fa-plus"></i> Thêm
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="addAuthor"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addModalLabel">Thêm tác giả</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addAuthor">
            <div class="form-group">
              <label for="authorName" class="form-label">Tên tác giả</label>
              <Field
                name="authorName"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.authorName,
                  'is-valid': !errors.authorName && newAuthor.name !== '',
                }"
                id="authorName"
                placeholder="Tên tác giả"
                v-model="newAuthor.name"
              />
              <ErrorMessage name="authorName" class="invalid-feedback" />
            </div>
            <div class="form-group">
              <label for="authorDob" class="form-label">Ngày sinh</label>
              <Field
                name="authorDob"
                type="date"
                class="form-control"
                :class="{
                  'is-invalid': errors.authorDob,
                  'is-valid': !errors.authorDob && newAuthor.dob !== '',
                }"
                id="authorDobAdd"
                placeholder="Nhập ngày sinh"
                v-model="newAuthor.dob"
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
import ApiAdmin from "@/service/admin/apiAdmin.service";
import { ref, onMounted } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { authorSchema } from "@/utils/schema.util";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

export default {
  components: { Form, Field, ErrorMessage },
  emit: ["refreshAuthors"],
  setup(props, { emit }) {
    const newAuthor = ref({
      name: "",
      dob: "",
    });
    const { errors, validate, resetForm } = useForm({
      validationSchema: authorSchema,
    });
    const apiAdmin = new ApiAdmin();
    const addAuthor = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      try {
        const response = await apiAdmin.post("/authors", newAuthor.value);
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          resetForm();
          $("#addAuthor").modal("hide");
          emit("refreshAuthors");
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    onMounted(() => {
      flatpickr("#authorDobAdd", {
        dateFormat: "d/m/Y",
      });
    });

    return { newAuthor, addAuthor, errors };
  },
};
</script>
