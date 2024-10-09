<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="updatePriceRange"
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
          <form @submit.prevent="updatePriceRange">
            <div class="form-group">
              <label for="startPrice" class="form-label">Giá bắt đầu</label>
              <Field
                name="startPrice"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.startPrice,
                  'is-valid':
                    !errors.startPrice && priceRangeToEdit.startPrice !== '',
                }"
                id="startPrice"
                placeholder="Tên tác giả"
                v-model="priceRangeToEdit.startPrice"
              />
              <ErrorMessage name="startPrice" class="invalid-feedback" />
            </div>
            <div class="form-group">
              <label for="endPrice" class="form-label">Giá kết thúc</label>
              <Field
                name="endPrice"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.endPrice,
                  'is-valid':
                    !errors.endPrice && priceRangeToEdit.endPrice !== '',
                }"
                id="endPrice"
                placeholder="Tên tác giả"
                v-model="priceRangeToEdit.endPrice"
              />
              <ErrorMessage name="endPrice" class="invalid-feedback" />
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
import { priceRangeSchema } from "@/utils/schema.util";
import ApiAdmin from "@/service/admin/apiAdmin.service";
import { toast } from "vue3-toastify";

export default defineComponent({
  components: { Field, ErrorMessage },
  props: {
    priceRangeToEdit: {
      type: Object,
      default: () => ({
        name: "",
        dob: "",
      }),
    },
  },
  emits: ["refreshPriceRanges"],
  setup(props, { emit }) {
    const priceRangeToEdit = ref({ ...props.priceRangeToEdit });

    const { errors, validate, resetForm } = useForm({
      validationSchema: priceRangeSchema,
    });

    const apiAdmin = new ApiAdmin();

    const updatePriceRange = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      try {
        const response = await apiAdmin.put(
          `/priceranges/${props.priceRangeToEdit._id}`,
          priceRangeToEdit.value
        );
        if (response.status === 200) {
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
          resetForm();
          $("#updatePriceRange").modal("hide");
          emit("refreshPriceRanges");
        }
      } catch (error) {
        console.error("Update failed:", error);
        toast(error.response?.data?.message || "An error occurred", {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      }
    };

    // Watch prop để cập nhật trạng thái nếu prop thay đổi
    watch(
      () => props.priceRangeToEdit,
      (newValue) => {
        priceRangeToEdit.value = { ...newValue };
      },
      { deep: true }
    );

    // Trả về các thuộc tính và phương thức cần thiết cho template
    return {
      priceRangeToEdit,
      errors,
      updatePriceRange,
    };
  },
});
</script>
