<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="updateFormality"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Chỉnh sửa hình thức
          </h5>
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
              <label for="name" class="form-label">Tên hình thức</label>
              <Field
                name="name"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.name,
                  'is-valid': !errors.name && formalityToEdit.name !== '',
                }"
                id="name"
                placeholder="Tên tác giả"
                v-model="formalityToEdit.name"
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
import { formalitySchema } from "@/utils/schema.util";
import ApiAdmin from "@/service/admin/apiAdmin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

export default defineComponent({
  components: { Field, ErrorMessage },
  props: {
    formalityToEdit: {
      type: Object,
      default: () => ({
        name: "",
      }),
    },
  },
  emits: ["refreshFormalities"],
  setup(props, { emit }) {
    const formalityToEdit = ref({ ...props.formalityToEdit });

    const { errors, validate, resetForm } = useForm({
      validationSchema: formalitySchema,
    });

    const apiAdmin = new ApiAdmin();

    const updateCategory = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      try {
        const response = await apiAdmin.put(
          `/formalities/${props.formalityToEdit._id}`,
          formalityToEdit.value
        );
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          resetForm();
          $("#updateFormality").modal("hide");
          emit("refreshFormalities");
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    // Watch prop để cập nhật trạng thái nếu prop thay đổi
    watch(
      () => props.formalityToEdit,
      (newValue) => {
        formalityToEdit.value = { ...newValue };
      },
      { deep: true }
    );

    // Trả về các thuộc tính và phương thức cần thiết cho template
    return {
      formalityToEdit,
      errors,
      updateCategory,
    };
  },
});
</script>
