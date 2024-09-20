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
        <form @submit.prevent="addBook" enctype="multipart/form-data">
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
                  v-model="searchAuthorValue"
                  :class="{
                    'is-invalid':
                      errors.authorName ||
                      (searchAuthorValue !== '' && !authorID),
                    'is-valid': !errors.authorName && newBook.authorID !== '',
                  }"
                />
                <ul
                  class="dropdown-menu"
                  :class="{
                    'd-none': authorSelectedID,
                  }"
                  style="max-height: 200px; overflow: auto"
                >
                  <li
                    style="max-width: 300px"
                    class="dropdown-item"
                    v-for="(author, index) in authorOptions"
                    :key="author._id"
                    @click="selectAuthorID(author)"
                  >
                    {{ author.name }}
                  </li>
                </ul>
                <ErrorMessage name="authorName" class="invalid-feedback" />
                <span
                  v-if="
                    !errors.authorName && searchAuthorValue !== '' && !authorID
                  "
                  style="color: #dc3545; font-size: 0.875em"
                  >Vui lòng chọn tác giả</span
                >
              </div>
            </div>
            <div class="form-group col-sm-4">
              <div class="dropdown">
                <label class="form-label" for="publisherName"
                  >Nhà xuất bản</label
                >
                <Field
                  class="form-control dropdown-toggle"
                  type="text"
                  name="publisherName"
                  id="publisherName"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  placeholder="Nhập tên tác giả"
                  @focus="showDropdown = true"
                  v-model="searchPublisherValue"
                  :class="{
                    'is-invalid':
                      errors.publisherName ||
                      (searchPublisherValue !== '' && !publisherID),
                    'is-valid':
                      !errors.publisherName && newBook.publisherID !== '',
                  }"
                />
                <ul
                  class="dropdown-menu"
                  :class="{
                    'd-none': publisherSelectedID,
                  }"
                  style="max-height: 200px; overflow: auto"
                >
                  <li
                    style="max-width: 300px"
                    class="dropdown-item"
                    v-for="(publisher, index) in publisherOptions"
                    :key="publisher._id"
                    @click="selectpublisherID(publisher)"
                  >
                    {{ publisher.name }}
                  </li>
                </ul>
                <ErrorMessage name="publisherName" class="invalid-feedback" />
                <span
                  v-if="
                    !errors.publisherName &&
                    searchPublisherValue !== '' &&
                    !publisherID
                  "
                  style="color: #dc3545; font-size: 0.875em"
                  >Vui lòng chọn nhà xuất bản</span
                >
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-sm-6">
              <div class="form-group">
                <div class="dropdown">
                  <label class="form-label" for="categoryName">Danh mục</label>
                  <Field
                    class="form-control dropdown-toggle"
                    type="text"
                    name="categoryName"
                    id="categoryName"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    placeholder="Nhập danh mục"
                    @focus="showDropdown = true"
                    v-model="searchCategoryValue"
                    :class="{
                      'is-invalid':
                        errors.categoryName ||
                        (searchCategoryValue !== '' && !categoryID),
                      'is-valid':
                        !errors.categoryName && newBook.categoryID !== '',
                    }"
                  />
                  <ul
                    class="dropdown-menu"
                    :class="{
                      'd-none': categorySelectedID,
                    }"
                    style="max-height: 200px; overflow: auto"
                  >
                    <li
                      style="max-width: 300px"
                      class="dropdown-item"
                      v-for="(category, index) in categoryOptions"
                      :key="category._id"
                      @click="selectCategoryID(category)"
                    >
                      {{ category.name }}
                    </li>
                  </ul>
                  <ErrorMessage name="categoryName" class="invalid-feedback" />
                  <span
                    v-if="
                      !errors.categoryName &&
                      searchCategoryValue !== '' &&
                      !categoryID
                    "
                    style="color: #dc3545; font-size: 0.875em"
                    >Vui lòng chọn danh mục</span
                  >
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <div class="dropdown">
                  <label class="form-label" for="formalityName"
                    >Hình thức</label
                  >
                  <Field
                    class="form-control dropdown-toggle"
                    type="text"
                    name="formalityName"
                    id="formalityName"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    placeholder="Nhập danh mục"
                    @focus="showDropdown = true"
                    v-model="searchFormalityValue"
                    :class="{
                      'is-invalid':
                        errors.formalityName ||
                        (searchFormalityValue !== '' && !formalityID),
                      'is-valid':
                        !errors.formalityName && newBook.formalityID !== '',
                    }"
                  />
                  <ul
                    class="dropdown-menu"
                    :class="{
                      'd-none': formalitySelectedID,
                    }"
                    style="max-height: 200px; overflow: auto"
                  >
                    <li
                      style="max-width: 300px"
                      class="dropdown-item"
                      v-for="(formality, index) in formalityOptions"
                      :key="formality._id"
                      @click="selectFormalityID(formality)"
                    >
                      {{ formality.name }}
                    </li>
                  </ul>
                  <ErrorMessage name="formalityName" class="invalid-feedback" />
                  <span
                    v-if="
                      !errors.formalityName &&
                      searchFormalityValue !== '' &&
                      !formalityID
                    "
                    style="color: #dc3545; font-size: 0.875em"
                    >Vui lòng chọn hình thức</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-sm-12 form-group">
              <label class="form-label" for="name">Mô tả sản phẩm</label>
              <Editor
                api-key="cp3h3fv43xxm3htfzjt7m98xqk1nsou8w4d2wx0a4yz8hrk4"
                v-model="newBook.description"
              />
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
                v-model="newBook.detail.publisherYear"
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
                v-model="newBook.detail.weight"
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
                v-model="newBook.detail.pageNumber"
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
                  v-model="newBook.detail.length"
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
                  v-model="newBook.detail.width"
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
            <div class="col-sm-4">
              <div class="form-group">
                <label class="form-label" for="originalPrice">Giá gốc</label>
                <Field
                  class="form-control"
                  type="text"
                  name="originalPrice"
                  id="originalPrice"
                  placeholder="Nhập giá gốc"
                  v-model="newBook.detail.originalPrice"
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
            <div class="col-sm-4">
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
                  v-model="newBook.detail.discountPrice"
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
            <div class="col-sm-4">
              <div class="form-group">
                <div class="dropdown">
                  <label class="form-label" for="priceRangeName"
                    >Khoản giá</label
                  >
                  <Field
                    class="form-control dropdown-toggle"
                    type="text"
                    name="priceRangeName"
                    id="priceRangeName"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    placeholder="Nhập tên khoản giá"
                    @focus="showDropdown = true"
                    v-model="searchPriceRangeValue"
                    :class="{
                      'is-invalid':
                        errors.priceRangeName ||
                        (searchPriceRangeValue !== '' && !priceRangeID),
                      'is-valid':
                        !errors.priceRangeName && newBook.priceRangeID !== '',
                    }"
                  />
                  <ul
                    class="dropdown-menu"
                    :class="{
                      'd-none': priceRangeSelectedID,
                    }"
                    style="max-height: 200px; overflow: auto"
                  >
                    <li
                      style="max-width: 300px"
                      class="dropdown-item"
                      v-for="(priceRange, index) in priceRangeOptions"
                      :key="priceRange._id"
                      @click="selectPriceRangeID(priceRange)"
                    >
                      {{ priceRange.startPrice }}đ - {{ priceRange.endPrice }}đ
                    </li>
                  </ul>
                  <ErrorMessage
                    name="priceRangeName"
                    class="invalid-feedback"
                  />
                  <span
                    v-if="
                      !errors.priceRangeName &&
                      searchPriceRangeValue !== '' &&
                      !priceRangeID
                    "
                    style="color: #dc3545; font-size: 0.875em"
                    >Vui lòng chọn khoản giá</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-sm-6">
              <div class="form-group">
                <label for="images" class="form-label">Chọn ảnh</label>
                <Field
                  class="form-control"
                  type="file"
                  name="images"
                  ref="fileInput"
                  multiple
                  as="input"
                  id="images"
                  placeholder="Nhập giá gốc"
                  @change="handleImageUpload"
                  :class="{
                    'is-invalid': errors.images,
                    'is-valid': !errors.images && images.length !== 0,
                  }"
                />
                <ErrorMessage name="images" class="invalid-feedback" />
              </div>
            </div>
            <div class="col-sm-2">
              <div class="form-group">
                <label class="form-label">Xóa hết ảnh</label>
                <button @click.prevent="clearImages" class="btn btn-danger">
                  Clear Image
                </button>
              </div>
            </div>
            <!-- Display selected images -->
            <div v-if="imagePreviews.length" class="row mt-3">
              <div
                v-for="(image, index) in imagePreviews"
                :key="index"
                class="col-sm-3 mb-2"
              >
                <img
                  :src="image"
                  alt="Selected image"
                  class="img-thumbnail"
                  style="max-height: 150px"
                />
                <button @click="removeImage(index)" class="remove-btn">
                  Xóa
                </button>
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
import Editor from "@tinymce/tinymce-vue";
import { ref, onMounted, computed, watch } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { bookSchema } from "@/utils/schema.util";
import useDropdown from "@/composables/useDropdown";
// services
import BookService from "@/service/book.service";
// component
import { toast } from "vue3-toastify";
import { useMenu } from "../../../stores/use-menu";

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
      priceRangeID: "",
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
    });
    const store = useMenu();
    store.onSelectedKeys(["admin-books-add"]);
    const isNew = ref(true);
    const imagePreviews = ref([]);
    const fileInput = ref(null);
    const images = ref([]);
    const bookService = new BookService();
    const { errors, validate, resetForm, validateField } = useForm({
      validationSchema: bookSchema,
    });

    const handleImageUpload = (event) => {
      const files = Array.from(event.target.files);
      images.value = [];
      imagePreviews.value = [];
      files.forEach((file) => {
        images.value.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreviews.value.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    };

    const removeImage = (index) => {
      images.value.splice(index, 1);
      imagePreviews.value.splice(index, 1);
      // Reset giá trị thẻ input để Vue nhận diện sự thay đổi
      const input = document.getElementById("images");
      if (input) {
        const dataTransfer = new DataTransfer();

        images.value.forEach((file) => {
          dataTransfer.items.add(file);
        });

        input.files = dataTransfer.files;
      }
    };

    const clearImages = () => {
      images.value = [];
      imagePreviews.value = [];
      $("#images").val("");
    };

    // Hàm để thêm các trường thông tin vào FormData
    const addFieldsToFormData = (formData, book) => {
      // Thêm các trường thông tin chính
      for (const [key, value] of Object.entries(book)) {
        if (key === "detail") {
          // Thêm các trường chi tiết
          for (const [detailKey, detailValue] of Object.entries(value)) {
            formData.append(`detail[${detailKey}]`, detailValue);
          }
        } else {
          formData.append(key, value);
        }
      }
    };

    // Hàm để thêm hình ảnh vào FormData
    const addImagesToFormData = (formData, images) => {
      images.forEach((image, index) => {
        formData.append("images", image);
      });
    };

    const addBook = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      const formData = new FormData();
      formData.append("fileType", "book");
      addFieldsToFormData(formData, newBook.value);
      addImagesToFormData(formData, images.value);

      try {
        const response = await bookService.post("/", formData, null);
        if (response.status === 200) {
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
          newBook.value.description = "";
          newBook.value.authorID = "";
          newBook.value.categoryID = "";
          newBook.value.formalityID = "";
          newBook.value.publisherID = "";
          newBook.value.priceRangeID = "";
          resetForm();
          clearImages();
        }
      } catch (error) {
        toast(error.response?.data?.message, {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      }
    };

    // Dropdown cho tác giả
    const {
      searchValue: searchAuthorValue,
      filteredOptions: authorOptions,
      selected: authorSelectedID,
      selectItem: selectAuthorID,
      itemID: authorID,
    } = useDropdown("authors");

    // Dropdown cho nhà xuất bản
    const {
      searchValue: searchPublisherValue,
      filteredOptions: publisherOptions,
      selected: publisherSelectedID,
      selectItem: selectpublisherID,
      itemID: publisherID,
    } = useDropdown("publishers");

    // Dropdown cho nhà danh mục
    const {
      searchValue: searchCategoryValue,
      filteredOptions: categoryOptions,
      selected: categorySelectedID,
      selectItem: selectCategoryID,
      itemID: categoryID,
    } = useDropdown("categories");

    // Dropdown cho hình thức
    const {
      searchValue: searchFormalityValue,
      filteredOptions: formalityOptions,
      selected: formalitySelectedID,
      selectItem: selectFormalityID,
      itemID: formalityID,
    } = useDropdown("formalities");

    // Dropdown cho khoản giá
    const {
      searchValue: searchPriceRangeValue,
      filteredOptions: priceRangeOptions,
      selected: priceRangeSelectedID,
      selectItem: selectPriceRangeID,
      itemID: priceRangeID,
    } = useDropdown("priceranges");

    // Theo dõi sự thay đổi của authorID
    watch(authorID, (newVal) => {
      if (newVal) {
        newBook.value.authorID = newVal;
        console.log("Tác giả đã chọn: ", newVal);
      }
    });

    // Theo dõi sự thay đổi của authorSelectedID
    watch(authorSelectedID, (newVal) => {
      if (newVal) {
        authorSelectedID.value = newVal;
        console.log("Tác giả đã chọn + An dropdown: ", authorSelectedID.value);
      }
    });

    // Theo dõi sự thay đổi của categorySelectedID
    watch(categorySelectedID, (newVal) => {
      if (newVal) {
        categorySelectedID.value = newVal;
        console.log(
          "Danh mục đã chọn + An dropdown: ",
          categorySelectedID.value
        );
      }
    });

    // Theo dõi sự thay đổi của formalitySelectedID
    watch(formalitySelectedID, (newVal) => {
      if (newVal) {
        formalitySelectedID.value = newVal;
        console.log(
          "Hình thức đã chọn + An dropdown: ",
          formalitySelectedID.value
        );
      }
    });

    // Theo dõi sự thay đổi của publisherSelectedID
    watch(publisherSelectedID, (newVal) => {
      if (newVal) {
        publisherSelectedID.value = newVal;
        console.log(
          "nhà xuất bản đã chọn + An dropdown: ",
          publisherSelectedID.value
        );
      }
    });

    // Theo dõi sự thay đổi của priceRangeSelectedID
    watch(priceRangeSelectedID, (newVal) => {
      if (newVal) {
        priceRangeSelectedID.value = newVal;
        console.log(
          "Khoản giá đã chọn + An dropdown: ",
          priceRangeSelectedID.value
        );
      }
    });

    // Theo dõi sự thay đổi của publisherID
    watch(publisherID, (newVal) => {
      if (newVal) {
        newBook.value.publisherID = newVal;
        console.log("Nhà xuất bản đã chọn: ", newVal);
      }
    });

    // Theo dõi sự thay đổi của categoryID
    watch(categoryID, (newVal) => {
      if (newVal) {
        newBook.value.categoryID = newVal;
        console.log("Hình thức đã chọn: ", newVal);
      }
    });

    // Theo dõi sự thay đổi của formalityID
    watch(formalityID, (newVal) => {
      if (newVal) {
        newBook.value.formalityID = newVal;
        console.log("Hình thức đã chọn: ", newVal);
      }
    });

    // Theo dõi sự thay đổi của priceRangeID
    watch(priceRangeID, (newVal) => {
      if (newVal) {
        newBook.value.priceRangeID = newVal;
        console.log("Khoản giá đã chọn: ", newVal);
      }
    });

    return {
      errors,
      addBook,
      newBook,
      // Authors
      searchAuthorValue,
      authorOptions,
      authorSelectedID,
      selectAuthorID,
      authorID,
      // Publishers
      searchPublisherValue,
      publisherOptions,
      publisherSelectedID,
      selectpublisherID,
      publisherID,
      // Categories
      searchCategoryValue,
      categoryOptions,
      categorySelectedID,
      selectCategoryID,
      categoryID,
      // Formalities
      searchFormalityValue,
      formalityOptions,
      formalitySelectedID,
      selectFormalityID,
      formalityID,
      // PriceRanges
      searchPriceRangeValue,
      priceRangeOptions,
      priceRangeSelectedID,
      selectPriceRangeID,
      priceRangeID,
      // image
      handleImageUpload,
      imagePreviews,
      removeImage,
      clearImages,
      fileInput,
      images,
    };
  },
};
</script>
<style scoped>
.remove-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #c82333;
}
</style>
