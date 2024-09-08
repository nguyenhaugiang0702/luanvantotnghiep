<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý sách
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item class="fw-bold">Sách</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">{{ bookName }}</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Hình ảnh</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <div class="row">
          <div class="container">
            <div class="d-flex justify-content-between mb-3">
              <!-- Nút thêm ảnh mới -->
              <button @click="addNewImage" class="btn btn-primary">
                Thêm ảnh mới
              </button>
              <!-- End Nút thêm ảnh mới -->
            </div>

            <!-- Hiển thị ảnh theo dạng lưới -->
            <div class="row">
              <div
                v-for="(image, index) in paginatedImages"
                :key="index"
                class="col-md-3"
              >
                <div class="card mb-4">
                  <img :src="image.path" class="card-img-top" alt="Ảnh sách" />
                  <div class="card-footer text-center w-100">
                    <button
                      @click="editImage(image._id)"
                      class="btn btn-warning btn-sm me-2"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      @click="deleteImage(image._id)"
                      class="btn btn-danger btn-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- End Hiển thị ảnh theo dạng lưới -->

            <!-- Phân trang -->
            <div class="d-flex justify-content-center">
              <a-pagination
                v-model:current="currentPage"
                :total="totalImages"
                :pageSizeOptions="pageSizes"
                :pageSize="itemsPerPage"
                @change="handlePageChange"
                show-size-changer
              >
                <template #itemRender="{ type, originalElement }">
                  <a v-if="type === 'prev'">Previous</a>
                  <a v-else-if="type === 'next'">Next</a>
                  <component :is="originalElement" v-else></component>
                </template>
              </a-pagination>
            </div>

            <!-- End Phân trang -->

            <!-- Modal Thêm hoặc Chỉnh sửa ảnh -->
            <div
              class="modal fade"
              id="imageModal"
              tabindex="-1"
              aria-labelledby="imageModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog" :class="{ 'modal-lg': !isEditing }">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="imageModalLabel">
                      {{ isEditing ? "Chỉnh sửa ảnh" : "Thêm ảnh mới" }}
                    </h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <form
                      @submit.prevent="saveImage($event)"
                      enctype="multipart/form-data"
                    >
                      <input
                        type="file"
                        @change="onFileChange"
                        class="form-control mb-3"
                        :multiple="!isEditing"
                      />
                      <div class="row listPreviewImg">
                        <div
                          class="mb-3"
                          :class="{
                            'col-sm-3 ': !isEditing,
                            'mx-auto w-50': isEditing,
                          }"
                          v-for="(image, index) in previewImages"
                          :key="index"
                        >
                          <img class="img-fluid" :src="image" alt="Preview" />
                          <div v-if="!isEditing">
                            <button
                              @click="removeImage(index)"
                              class="remove-btn"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>

                      <div
                        class="modal-footer"
                        :class="{
                          'justify-content-evenly': !isEditing,
                        }"
                      >
                        <div v-if="!isEditing" class="col-sm-9 float-start">
                          <button @click="clearImages" class="btn btn-danger">
                            Xóa tất cả
                          </button>
                        </div>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Đóng
                        </button>
                        <button type="submit" class="btn btn-primary">
                          Lưu
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <!-- End Modal Thêm hoặc Chỉnh sửa ảnh -->
          </div>
        </div>
      </div>
    </a-layout-content>
  </div>
</template>

<script>
import config from "@/config";
import BookService from "@/service/book.service";
import { showConfirmation } from "@/utils/swalUtils";
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";

export default {
  setup() {
    const images = ref([]);
    const bookService = new BookService();
    const route = useRoute();
    const bookID = route.params.bookID;
    const bookName = ref("");
    // lấy ảnh của sách
    const getImages = async () => {
      const response = await bookService.get(`/images/${bookID}`);
      if (response.status === 200) {
        images.value = response.data.images.map((image) => {
          return {
            _id: image._id,
            path: `${config.imgUrl}/${image.path}`,
          };
        });
        bookName.value = response.data.bookName;
      }
    };
    const currentPage = ref(1);
    const itemsPerPage = ref(8);
    const pageSizes = ["8", "12", "16", "20"];

    const totalImages = computed(() => images.value.length);

    const handlePageChange = (page, pageSize) => {
      currentPage.value = page;
      itemsPerPage.value = pageSize;
    };

    const paginatedImages = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return images.value.slice(start, end);
    });

    onMounted(() => {
      getImages();
    });

    const isEditing = ref(false);
    const currentImageID = ref(null);
    const newImageFiles = ref([]);
    const previewImages = ref([]);

    // Thêm ảnh mới
    const addNewImage = () => {
      isEditing.value = false;
      previewImages.value = [];
      newImageFiles.value = [];
      $("#imageModal").modal("show");
    };

    // Chỉnh sửa ảnh hiện có
    const editImage = (imageID) => {
      isEditing.value = true;
      currentImageID.value = imageID;
      const image = images.value.find((img) => img._id == imageID);
      previewImages.value = [image.path];
      newImageFiles.value = [];
      $("#imageModal").modal("show");
    };

    const resetForm = () => {
      newImageFiles.value = [];
      previewImages.value = [];
      $("#imageModal").modal("hide");
      $("input[type='file']").val("");
    };

    const removeImage = (index) => {
      newImageFiles.value.splice(index, 1);
      previewImages.value.splice(index, 1);

      $("input[type='file']").val("");
      // Nếu còn ảnh trong danh sách newImageFiles, cần cập nhật lại thẻ input
      if (newImageFiles.value.length > 0) {
        // Tạo đối tượng DataTransfer để giữ các tệp còn lại
        const dataTransfer = new DataTransfer();

        // Thêm lại các tệp còn lại vào DataTransfer
        newImageFiles.value.forEach((file) => {
          dataTransfer.items.add(file);
        });

        // Cập nhật lại thẻ input với các tệp mới
        $("input[type='file']")[0].files = dataTransfer.files;
      }
    };

    const clearImages = () => {
      newImageFiles.value = [];
      previewImages.value = [];
      $("input[type='file']").val("");
    };

    const handleDeleteImage = async (imageID) => {
      try {
        const response = await bookService.delete(
          `/images/${bookID}/${imageID}`
        );
        if (response.status === 200) {
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
          getImages();
        }
      } catch (error) {
        toast(error.response?.data?.message, {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      }
    };

    // Xóa ảnh
    const deleteImage = async (imageID) => {
      const isConfirmed = await showConfirmation({
        title: "Bạn chắn chắn muốn xóa hình này?",
      });
      if (isConfirmed.isConfirmed) {
        await handleDeleteImage(imageID);
      }
    };

    // Chọn ảnh mới để upload
    const onFileChange = (event) => {
      newImageFiles.value = [];
      previewImages.value = [];
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        newImageFiles.value.push(file);
        previewImages.value.push(URL.createObjectURL(file));
      }
    };

    const handleImage = async (formData, imageID = null, method) => {
      try {
        let response;
        if (method == "add") {
          console.log(1);
          response = await bookService.post(`/images/${bookID}`, formData);
        } else if (method == "update") {
          console.log(2);
          response = await bookService.put(
            `/images/${bookID}/${imageID}`,
            formData
          );
        }
        if (response.status === 200) {
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
          resetForm();
          getImages();
        }
      } catch (error) {
        toast(error.response?.data?.message, {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      }
    };

    // Lưu ảnh mới hoặc cập nhật ảnh hiện có
    const saveImage = (e) => {
      e.preventDefault();
      const formData = new FormData();
      if (newImageFiles.value.length > 0) {
        newImageFiles.value.forEach((file) => {
          formData.append("images", file);
        });
        let method = isEditing.value ? "update" : "add";
        handleImage(formData, currentImageID.value, method);
      }
    };

    return {
      bookName,
      images,
      isEditing,
      previewImages,
      addNewImage,
      editImage,
      deleteImage,
      onFileChange,
      saveImage,
      removeImage,
      clearImages,
      // Pagination
      itemsPerPage,
      // totalPages,
      currentPage,
      totalImages,
      paginatedImages,
      handlePageChange,
      pageSizes,
    };
  },
};
</script>

<style scoped>
.card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  width: 300px;
  overflow: hidden;
  border-radius: 8px;
}

.card img {
  height: 200px;
  object-fit: cover;
  width: 220px;
}

.remove-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 60px;
}

.remove-btn:hover {
  background-color: #c82333;
}

.listPreviewImg {
  max-height: 31.25rem; /* 500px */
  overflow-y: scroll;
}
</style>
