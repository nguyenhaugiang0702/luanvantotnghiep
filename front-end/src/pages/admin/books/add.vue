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
        <a-breadcrumb-item>Sách</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Thêm</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <form @submit.prevent="addBook">
          <div class="row">
            <div class="form-group col-sm-4">
              <label class="form-label" for="bookName">Tên sách</label>
              <Field
                class="form-control"
                :class="{
                  'is-invalid': errors.bookName,
                  'is-valid': !errors.bookName && newBook.name !== '',
                }"
                type="text"
                name="bookName"
                id="bookName"
                placeholder="Nhập tên sách"
                v-model="newBook.name"
              />
              <ErrorMessage name="bookName" class="invalid-feedback" />
            </div>
            <div class="form-group col-sm-4">
              <div class="dropdown">
                <label class="form-label" for="authorName">Tác giả</label>
                <Field
                  class="form-control dropdown-toggle"
                  type="text"
                  name="authorName"
                  id="authorName"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  placeholder="Nhập tên tác giả"
                  @focus="showDropdown = true"
                  v-model="searchValue"
                  :class="{
                    'is-invalid': errors.authorName || !authorSelected,
                    'is-valid': !errors.authorName && newBook.authorID !== '',
                  }"
                />
                <ul
                  class="dropdown-menu"
                  style="max-height: 200px; overflow: auto"
                >
                  <li
                    style="max-width: 300px"
                    class="dropdown-item"
                    v-for="(author, index) in filteredAuthors"
                    :key="author._id"
                    @click="selectAuthor(author)"
                  >
                    {{ author.name }}
                  </li>
                </ul>
                <ErrorMessage name="authorName" class="invalid-feedback" />
                <span
                  v-if="!authorSelected && !errors.authorName"
                  style="color: #dc3545; font-size: 0.875em"
                  >Vui lòng chọn tác giả</span
                >
              </div>
            </div>
            <div class="form-group col-sm-4">
              <label class="form-label" for="publisherName">Nhà xuất bản</label>
              <Field
                class="form-control"
                type="text"
                name="publisherName"
                id="publisherName"
                placeholder="Tên nhà xuất bản"
                :class="{
                  'is-invalid': errors.publisherName,
                  'is-valid':
                    !errors.publisherName && newBook.publisherID !== '',
                }"
              />
              <ErrorMessage name="publisherName" class="invalid-feedback" />
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-sm-6">
              <div class="form-group">
                <label class="form-label" for="categoryName">Danh mục</label>
                <Field
                  class="form-control"
                  type="text"
                  name="categoryName"
                  id="categoryName"
                  placeholder="Nhập danh mục"
                  :class="{
                    'is-invalid': errors.categoryName,
                    'is-valid':
                      !errors.categoryName && newBook.categoryID !== '',
                  }"
                />
                <ErrorMessage name="categoryName" class="invalid-feedback" />
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label class="form-label" for="formalityName">Hình thức</label>
                <Field
                  class="form-control"
                  type="text"
                  name="formalityName"
                  id="formalityName"
                  placeholder="Nhập hình thức"
                  :class="{
                    'is-invalid': errors.formalityName,
                    'is-valid':
                      !errors.formalityName && newBook.formalityID !== '',
                  }"
                />
                <ErrorMessage name="formalityName" class="invalid-feedback" />
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-sm-12 form-group">
              <label class="form-label" for="name">Mô tả sản phẩm</label>
              <Editor editorStyle="height: 320px" />
            </div>
          </div>
          <div class="row mt-4">
            <div class="form-group col-sm-4">
              <label class="form-label" for="publisherYear">Năm xuất bản</label>
              <Field
                class="form-control"
                type="text"
                name="publisherYear"
                id="publisherYear"
                placeholder="Nhập hình thức"
                :class="{
                  'is-invalid': errors.publisherYear,
                  'is-valid':
                    !errors.publisherYear &&
                    newBook.detail.publisherYear !== '',
                }"
              />
              <ErrorMessage name="publisherYear" class="invalid-feedback" />
            </div>
            <div class="form-group col-sm-4">
              <label class="form-label" for="weight">Trọng lượng</label>
              <Field
                class="form-control"
                type="text"
                name="weight"
                id="weight"
                placeholder="Nhập trọng lượng"
                :class="{
                  'is-invalid': errors.weight,
                  'is-valid': !errors.weight && newBook.detail.weight !== '',
                }"
              />
              <ErrorMessage name="weight" class="invalid-feedback" />
            </div>
            <div class="form-group col-sm-4">
              <label class="form-label" for="pageNumber">Số trang</label>
              <Field
                class="form-control"
                type="text"
                name="pageNumber"
                id="pageNumber"
                placeholder="Nhập số trang"
                :class="{
                  'is-invalid': errors.pageNumber,
                  'is-valid':
                    !errors.pageNumber && newBook.detail.pageNumber !== '',
                }"
              />
              <ErrorMessage name="pageNumber" class="invalid-feedback" />
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-sm-6">
              <div class="form-group">
                <label class="form-label" for="length">Chiều dài</label>
                <Field
                  class="form-control"
                  type="text"
                  name="length"
                  id="length"
                  placeholder="Nhập chiều dài"
                  :class="{
                    'is-invalid': errors.length,
                    'is-valid': !errors.length && newBook.detail.length !== '',
                  }"
                />
                <ErrorMessage name="length" class="invalid-feedback" />
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label class="form-label" for="width">Chiều rộng</label>
                <Field
                  class="form-control"
                  type="text"
                  name="width"
                  id="width"
                  placeholder="Nhập chiều dài"
                  :class="{
                    'is-invalid': errors.width,
                    'is-valid': !errors.width && newBook.detail.width !== '',
                  }"
                />
                <ErrorMessage name="width" class="invalid-feedback" />
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-sm-6">
              <div class="form-group">
                <label class="form-label" for="originalPrice">Giá gốc</label>
                <Field
                  class="form-control"
                  type="text"
                  name="originalPrice"
                  id="originalPrice"
                  placeholder="Nhập giá gốc"
                  :class="{
                    'is-invalid': errors.originalPrice,
                    'is-valid':
                      !errors.originalPrice &&
                      newBook.detail.originalPrice !== '',
                  }"
                />
                <ErrorMessage name="originalPrice" class="invalid-feedback" />
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label class="form-label" for="discountPrice"
                  >Giá khuyến mãi</label
                >
                <Field
                  class="form-control"
                  type="text"
                  name="discountPrice"
                  id="discountPrice"
                  placeholder="Nhập gía Km"
                  :class="{
                    'is-invalid': errors.discountPrice,
                    'is-valid':
                      !errors.discountPrice &&
                      newBook.detail.discountPrice !== '',
                  }"
                />
                <ErrorMessage name="discountPrice" class="invalid-feedback" />
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-sm-6">
              <div class="form-group">
                <label for="image" class="form-label">Chọn ảnh</label>
                <Field
                  class="form-control"
                  type="file"
                  name="image"
                  id="image"
                  placeholder="Nhập giá gốc"
                  :class="{
                    'is-invalid': errors.image,
                    'is-valid': !errors.image && newBook.image !== '',
                  }"
                />
                <ErrorMessage name="image" class="invalid-feedback" />
              </div>
            </div>
          </div>
          <div class="row mt-5 d-flex justify-content-center">
            <button type="submit" class="btn btn-primary col-sm-1">Lưu</button>
          </div>
        </form>
      </div>
    </a-layout-content>
  </div>
</template>
<script>
import Editor from "primevue/editor";
import { ref, onMounted, computed, watch } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { bookSchema } from "@/utils/schema.util";
// services
import AuthorsService from "@/service/author.service";

export default {
  components: {
    Editor,
    Field,
    ErrorMessage,
  },
  setup() {
    const newBook = ref({
      name: "",
      categoryID: "",
      publisherID: "",
      authorID: "",
      formalityID: "",
      description: "",
      detail: {
        publisherYear: "",
        weight: "",
        pageNumber: "",
        length: "",
        width: "",
        originalPrice: "",
        discountPrice: "",
      },
      image: "",
    });
    const showDropdown = ref(false);
    const searchValue = ref("");
    const authorSelected = ref(false);
    const authorsService = new AuthorsService();
    const { errors, validate, resetForm } = useForm({
      validationSchema: bookSchema,
    });

    const addBook = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
    };
    const authors = ref([]);
    const getAuthors = async () => {
      const response = await authorsService.get("/");
      if (response.status === 200) {
        authors.value = response.data;
      }
    };

    const filteredAuthors = computed(() => {
      return authors.value.filter((author) =>
        author.name.toLowerCase().includes(searchValue.value.toLowerCase())
      );
    });

    const selectAuthor = (author) => {
      searchValue.value = author.name;
      newBook.value.authorID = author._id;
      showDropdown.value = false; // Ẩn danh sách sau khi chọn
      authorSelected.value = true;
    };

    // Theo dõi sự thay đổi của searchValue
    watch(searchValue, (newValue) => {
      // Nếu giá trị nhập vào không khớp với bất kỳ tác giả nào trong danh sách, reset
      const matchedAuthor = authors.value.find(
        (author) => author.name.toLowerCase() === newValue.toLowerCase()
      );

      if (!matchedAuthor) {
        newBook.value.authorID = ""; // Xóa authorID
        authorSelected.value = false; // Đánh dấu chưa chọn tác giả
      }
    });

    onMounted(() => {
      getAuthors();
    });
    return {
      errors,
      addBook,
      newBook,
      authors,
      showDropdown,
      filteredAuthors,
      searchValue,
      selectAuthor,
      authorSelected,
    };
  },
};
</script>
<style scoped>
.certain-category-search-dropdown {
  max-height: 200px;
  overflow: auto;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
}
</style>
