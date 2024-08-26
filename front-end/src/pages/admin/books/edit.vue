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
        <a-breadcrumb-item class="fw-bold">Chỉnh sửa</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <form @submit.prevent="" enctype="multipart/form-data">
          <div class="row">
            <div class="form-group col-sm-4">
              <label class="form-label" for="bookName">Tên sách</label>
              <Field
                class="form-control"
                :class="{
                  'is-invalid': errors.bookName,
                  'is-valid': !errors.bookName && book.name !== '',
                }"
                type="text"
                name="bookName"
                id="bookName"
                placeholder="Nhập tên sách"
                v-model="book.name"
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
                  :value="book.authorID.name"
                  :class="{
                    'is-invalid':
                      errors.authorName ||
                      (searchAuthorValue !== '' && !authorID),
                    'is-valid': !errors.authorName && book.authorID !== '',
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
                      !errors.publisherName && book.publisherID !== '',
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
                        !errors.categoryName && book.categoryID !== '',
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
                        !errors.formalityName && book.formalityID !== '',
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
                v-model="book.description"
              />
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
// import Editor from "primevue/editor";
import { ref, onMounted, computed, watch } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { bookSchema } from "@/utils/schema.util";
import useDropdown from "@/composables/useDropdown";
import { useRoute, useRouter } from "vue-router";
import BookService from "@/service/book.service";
import Editor from "@tinymce/tinymce-vue";

export default {
  components: {
    Editor,
    Field,
    ErrorMessage,
  },
  setup() {
    const book = ref({
      name: "",
      categoryID: "",
      publisherID: "",
      formalityID: "",
      authorID: "",
      description: "",
    });
    const route = useRoute();
    const router = useRouter();
    const bookID = route.params.bookID;
    const bookService = new BookService();
    const { errors, validate, resetForm, validateField } = useForm({
      validationSchema: bookSchema,
    });

    const getBook = async () => {
      const response = await bookService.get(`/${bookID}`);
      if (response.status === 200) {
        book.value = response.data;
        searchAuthorValue.value = book.value.authorID.name;
        searchCategoryValue.value = book.value.categoryID.name;
        searchFormalityValue.value = book.value.formalityID.name;
        searchPublisherValue.value = book.value.publisherID.name;
      }
    };

    onMounted(() => {
      getBook();
    });

    // Dropdown cho tác giả
    const {
      searchValue: searchAuthorValue,
      filteredOptions: authorOptions,
      selected: authorSelectedID,
      selectItem: selectAuthorID,
      itemID: authorID,
    } = useDropdown("authors", book.value.authorID._id);

    // Dropdown cho nhà xuất bản
    const {
      searchValue: searchPublisherValue,
      filteredOptions: publisherOptions,
      selected: publisherSelectedID,
      selectItem: selectpublisherID,
      itemID: publisherID,
    } = useDropdown("publishers", book.value.publisherID._id);

    // Dropdown cho nhà danh mục
    const {
      searchValue: searchCategoryValue,
      filteredOptions: categoryOptions,
      selected: categorySelectedID,
      selectItem: selectCategoryID,
      itemID: categoryID,
    } = useDropdown("categories", book.value.categoryID._id);

    // Dropdown cho hình thức
    const {
      searchValue: searchFormalityValue,
      filteredOptions: formalityOptions,
      selected: formalitySelectedID,
      selectItem: selectFormalityID,
      itemID: formalityID,
    } = useDropdown("formalities", book.value.formalityID._id);

    // // Theo dõi sự thay đổi của authorID
    // watch(authorID, (newVal) => {
    //   if (newVal) {
    //     book.value.authorID = newVal;
    //     console.log("Tác giả đã chọn: ", newVal);
    //   }
    // });

    // // Theo dõi sự thay đổi của authorSelectedID
    // watch(authorSelectedID, (newVal) => {
    //   if (newVal) {
    //     authorSelectedID.value = newVal;
    //     console.log("Tác giả đã chọn + An dropdown: ", authorSelectedID.value);
    //   }
    // });

    // // Theo dõi sự thay đổi của categorySelectedID
    // watch(categorySelectedID, (newVal) => {
    //   if (newVal) {
    //     categorySelectedID.value = newVal;
    //     console.log(
    //       "Danh mục đã chọn + An dropdown: ",
    //       categorySelectedID.value
    //     );
    //   }
    // });

    // // Theo dõi sự thay đổi của formalitySelectedID
    // watch(formalitySelectedID, (newVal) => {
    //   if (newVal) {
    //     formalitySelectedID.value = newVal;
    //     console.log(
    //       "Hình thức đã chọn + An dropdown: ",
    //       formalitySelectedID.value
    //     );
    //   }
    // });

    // // Theo dõi sự thay đổi của publisherSelectedID
    // watch(publisherSelectedID, (newVal) => {
    //   if (newVal) {
    //     publisherSelectedID.value = newVal;
    //     console.log(
    //       "nhà xuất bản đã chọn + An dropdown: ",
    //       publisherSelectedID.value
    //     );
    //   }
    // });

    // // Theo dõi sự thay đổi của publisherID
    // watch(publisherID, (newVal) => {
    //   if (newVal) {
    //     book.value.publisherID = newVal;
    //     console.log("Nhà xuất bản đã chọn: ", newVal);
    //   }
    // });

    // // Theo dõi sự thay đổi của categoryID
    // watch(categoryID, (newVal) => {
    //   if (newVal) {
    //     book.value.categoryID = newVal;
    //     console.log("Hình thức đã chọn: ", newVal);
    //   }
    // });

    // // Theo dõi sự thay đổi của formalityID
    // watch(formalityID, (newVal) => {
    //   if (newVal) {
    //     book.value.formalityID = newVal;
    //     console.log("Hình thức đã chọn: ", newVal);
    //   }
    // });

    return {
      book,
      errors,
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
    };
  },
};
</script>
