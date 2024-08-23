<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="updateCategory"
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
          <form @submit.prevent="updateCategory">
            <div class="form-group">
              <label for="name" class="form-label">Tên tác giả</label>
              <Field
                name="name"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.name,
                  'is-valid': !errors.name && categoryToEdit.name !== '',
                }"
                id="name"
                placeholder="Tên tác giả"
                v-model="categoryToEdit.name"
              />
              <ErrorMessage name="name" class="invalid-feedback" />
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
import { ref, watch, defineComponent } from "vue";
import { useForm, Field, ErrorMessage } from "vee-validate";
import { categorySchema } from "@/utils/schema.util";
import CategoryService from "@/service/category.service";
import { toast } from "vue3-toastify";

export default defineComponent({
  components: { Field, ErrorMessage },
  props: {
    categoryToEdit: {
      type: Object,
      default: () => ({
        name: "",
      }),
    },
  },
  emits: ["refreshCategories"],
  setup(props, { emit }) {
    const categoryToEdit = ref({ ...props.categoryToEdit });

    const { errors, validate, resetForm } = useForm({
      validationSchema: categorySchema,
    });

    const categoryService = new CategoryService();

    const updateCategory = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      try {
        const response = await categoryService.put(
          `/${props.categoryToEdit._id}`,
          categoryToEdit.value
        );
        if (response.status === 200) {
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
          resetForm();
          $("#updateCategory").modal("hide");
          emit("refreshCategories");
        }
      } catch (error) {
        toast(error.response?.data?.message || "An error occurred", {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      }
    };

    // Watch prop để cập nhật trạng thái nếu prop thay đổi
    watch(
      () => props.categoryToEdit,
      (newValue) => {
        categoryToEdit.value = { ...newValue };
      },
      { deep: true }
    );

    // Trả về các thuộc tính và phương thức cần thiết cho template
    return {
      categoryToEdit,
      errors,
      updateCategory,
    };
  },
});
</script>
