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
        <form @submit.prevent="updateBook" :validationSchema="updateBookSchema">
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
              <div class="dropdown position-relative">
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
                  :value="book.authorID?.name"
                  :class="{
                    'is-invalid':
                      errors.authorName ||
                      (searchAuthorValue !== '' && !authorID) ||
                      searchAuthorValue === '',
                    'is-valid': !errors.authorName && book.authorID !== '',
                  }"
                />
                <ul
                  ref="dropdownMenu"
                  class="dropdown-menu dropdown-menu-authors"
                  v-show="!authorSelectedID && authorOptions.length > 0"
                  style="max-height: 200px; overflow: auto"
                >
                  <li
                    style="width: 24rem; max-width: 24rem"
                    class="dropdown-item"
                    v-for="(author, index) in authorOptions"
                    :key="author._id"
                    @click="selectAuthorID(author)"
                  >
                    {{ author.name }}
                  </li>
                </ul>
                <button
                  class="clear-button"
                  type="button"
                  @click="clearDropdownAuthors('dropdown-menu-authors')"
                  v-if="searchAuthorValue"
                  aria-label="Clear author"
                >
                  <span class="clear-icon">&times;</span>
                </button>
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
                  placeholder="Nhập tên nhà xuất bản"
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
                  class="dropdown-menu dropdown-menu-publishers"
                  v-show="!publisherSelectedID && publisherOptions.length > 0"
                  style="max-height: 200px; overflow: auto"
                >
                  <li
                    style="width: 24rem; max-width: 24rem"
                    class="dropdown-item"
                    v-for="(publisher, index) in publisherOptions"
                    :key="publisher._id"
                    @click="selectpublisherID(publisher)"
                  >
                    {{ publisher.name }}
                  </li>
                </ul>
                <button
                  class="clear-button"
                  type="button"
                  @click="clearDropdownPublsihers('dropdown-menu-publishers')"
                  v-if="searchPublisherValue"
                  aria-label="Clear author"
                >
                  <span class="clear-icon">&times;</span>
                </button>
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
                  <label class="form-label" for="categoryName">Thể loại</label>
                  <Field
                    class="form-control dropdown-toggle"
                    type="text"
                    name="categoryName"
                    id="categoryName"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    placeholder="Nhập thể loại"
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
                    class="dropdown-menu dropdown-menu-categories"
                    v-show="!categorySelectedID && categoryOptions.length > 0"
                    style="max-height: 200px; overflow: auto"
                  >
                    <li
                      style="width: 24rem; max-width: 24rem"
                      class="dropdown-item"
                      v-for="(category, index) in categoryOptions"
                      :key="category._id"
                      @click="selectCategoryID(category)"
                    >
                      {{ category.name }}
                    </li>
                  </ul>
                  <button
                    class="clear-button"
                    type="button"
                    @click="clearDropdownCategories('dropdown-menu-categories')"
                    v-if="searchCategoryValue"
                    aria-label="Clear author"
                  >
                    <span class="clear-icon">&times;</span>
                  </button>
                  <ErrorMessage name="categoryName" class="invalid-feedback" />
                  <span
                    v-if="
                      !errors.categoryName &&
                      searchCategoryValue !== '' &&
                      !categoryID
                    "
                    style="color: #dc3545; font-size: 0.875em"
                    >Vui lòng chọn thể loại</span
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
                    placeholder="Nhập hình thức"
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
                    class="dropdown-menu dropdown-menu-formalities"
                    v-show="!formalitySelectedID && formalityOptions.length > 0"
                    style="max-height: 200px; overflow: auto"
                  >
                    <li
                      style="width: 24rem; max-width: 24rem"
                      class="dropdown-item"
                      v-for="(formality, index) in formalityOptions"
                      :key="formality._id"
                      @click="selectFormalityID(formality)"
                    >
                      {{ formality.name }}
                    </li>
                  </ul>
                  <button
                    class="clear-button"
                    type="button"
                    @click="
                      clearDropdownFormalities('dropdown-menu-formalities')
                    "
                    v-if="searchFormalityValue"
                    aria-label="Clear author"
                  >
                    <span class="clear-icon">&times;</span>
                  </button>
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
          <div class="row mt-4">
            <div class="form-group col-sm-4">
              <label class="form-label" for="publisherYear">Năm xuất bản</label>
              <Field
                class="form-control"
                type="text"
                name="publisherYear"
                id="publisherYear"
                placeholder="Nhập hình thức"
                v-model="book.detail.publisherYear"
                :class="{
                  'is-invalid': errors.publisherYear,
                  'is-valid':
                    !errors.publisherYear && book.detail.publisherYear !== '',
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
                v-model="book.detail.weight"
                :class="{
                  'is-invalid': errors.weight,
                  'is-valid': !errors.weight && book.detail.weight !== '',
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
                v-model="book.detail.pageNumber"
                :class="{
                  'is-invalid': errors.pageNumber,
                  'is-valid':
                    !errors.pageNumber && book.detail.pageNumber !== '',
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
                  v-model="book.detail.length"
                  :class="{
                    'is-invalid': errors.length,
                    'is-valid': !errors.length && book.detail.length !== '',
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
                  v-model="book.detail.width"
                  :class="{
                    'is-invalid': errors.width,
                    'is-valid': !errors.width && book.detail.width !== '',
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
                  v-model="book.detail.originalPrice"
                  :class="{
                    'is-invalid': errors.originalPrice,
                    'is-valid':
                      !errors.originalPrice && book.detail.originalPrice !== '',
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
                  v-model="book.detail.discountPrice"
                  :class="{
                    'is-invalid': errors.discountPrice,
                    'is-valid':
                      !errors.discountPrice && book.detail.discountPrice !== '',
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
                        !errors.priceRangeName && book.priceRangeID !== '',
                    }"
                  />
                  <ul
                    class="dropdown-menu dropdown-menu-priceranges"
                    v-show="
                      !priceRangeSelectedID && priceRangeOptions.length > 0
                    "
                    style="max-height: 200px; overflow: auto"
                  >
                    <li
                      style="width: 24rem; max-width: 24rem"
                      class="dropdown-item"
                      v-for="(priceRange, index) in priceRangeOptions"
                      :key="priceRange._id"
                      @click="selectPriceRangeID(priceRange)"
                    >
                      {{ priceRange.startPrice }}đ - {{ priceRange.endPrice }}đ
                    </li>
                  </ul>
                  <button
                    class="clear-button"
                    type="button"
                    @click="
                      clearDropdownPriceranges('dropdown-menu-priceranges')
                    "
                    v-if="searchPriceRangeValue"
                    aria-label="Clear author"
                  >
                    <span class="clear-icon">&times;</span>
                  </button>
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
          <div class="row mt-5 d-flex justify-content-center">
            <button type="submit" class="btn btn-primary col-sm-1">Lưu</button>
          </div>
        </form>
      </div>
    </a-layout-content>
  </div>
</template>
<script>
import { ref, onMounted, computed, watch } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { updateBookSchema } from "@/utils/schema.util";
import useDropdown from "@/composables/useDropdown";
import { useRoute, useRouter } from "vue-router";
import ApiAdmin from "@/service/admin/apiAdmin.service";
import Editor from "@tinymce/tinymce-vue";
import { toast } from "vue3-toastify";

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

    const route = useRoute();
    const router = useRouter();
    const bookID = route.params.bookID;
    const apiAdmin = new ApiAdmin();
    const { errors, validate, resetForm, validateField } = useForm({
      validationSchema: updateBookSchema,
    });

    const getBook = async () => {
      const response = await apiAdmin.get(`/books/${bookID}`);
      if (response.status === 200) {
        book.value = response.data;
        data.value = response.data;
        searchAuthorValue.value = response.data.authorID?.name
          ? response.data.authorID?.name
          : "";
        searchCategoryValue.value = response.data.categoryID?.name
          ? response.data.categoryID?.name
          : "";
        searchFormalityValue.value = response.data.formalityID?.name
          ? response.data.formalityID?.name
          : "";
        searchPublisherValue.value = response.data.publisherID?.name
          ? response.data.publisherID?.name
          : "";
        searchPriceRangeValue.value = response.data.priceRangeID?.name
          ? response.data.priceRangeID?.name
          : "";
      }
    };

    const data = ref({
      name: "",
      categoryID: "",
      publisherID: "",
      formalityID: "",
      authorID: "",
      description: "",
      priceRangeID: "",
    });

    const updateBook = async () => {
      const { valid, errors } = await validate();
      if (!valid) {
        return;
      }

      try {
        const response = await apiAdmin.put(`/books/${bookID}`, data.value);
        if (response.status === 200) {
          toast(response.data.message, {
            theme: "auto",
            type: "success",
            dangerouslyHTMLString: true,
          });
          getBook();
        }
      } catch (error) {
        console.log(error);
        toast(error.response?.data?.message, {
          theme: "auto",
          type: "error",
          dangerouslyHTMLString: true,
        });
      }
    };

    onMounted(async () => {
      await getBook();
    });

    // Dropdown cho tác giả
    const {
      searchValue: searchAuthorValue,
      filteredOptions: authorOptions,
      selected: authorSelectedID,
      selectItem: selectAuthorID,
      itemID: authorID,
      loading: loadingAuthors,
    } = useDropdown("authors", book.value.authorID._id);

    // Dropdown cho nhà xuất bản
    const {
      searchValue: searchPublisherValue,
      filteredOptions: publisherOptions,
      selected: publisherSelectedID,
      selectItem: selectpublisherID,
      itemID: publisherID,
      loading: loadingPublishers,
    } = useDropdown("publishers", book.value.publisherID._id);

    // Dropdown cho nhà thể loại
    const {
      searchValue: searchCategoryValue,
      filteredOptions: categoryOptions,
      selected: categorySelectedID,
      selectItem: selectCategoryID,
      itemID: categoryID,
      loading: loadingCategories,
    } = useDropdown("categories", book.value.categoryID._id);

    // Dropdown cho hình thức
    const {
      searchValue: searchFormalityValue,
      filteredOptions: formalityOptions,
      selected: formalitySelectedID,
      selectItem: selectFormalityID,
      itemID: formalityID,
      loading: loadingFormalities,
    } = useDropdown("formalities", book.value.formalityID._id);

    // Dropdown cho khoản giá
    const {
      searchValue: searchPriceRangeValue,
      filteredOptions: priceRangeOptions,
      selected: priceRangeSelectedID,
      selectItem: selectPriceRangeID,
      itemID: priceRangeID,
      loading: loadingPriceranges,
    } = useDropdown("priceranges", book.value.priceRangeID._id);

    // Theo dõi sự thay đổi của authorSelectedID
    watch(authorSelectedID, (newVal) => {
      if (newVal) {
        authorSelectedID.value = newVal;
      }
    });

    // Theo dõi sự thay đổi của categorySelectedID
    watch(categorySelectedID, (newVal) => {
      if (newVal) {
        categorySelectedID.value = newVal;
      }
    });

    // Theo dõi sự thay đổi của formalitySelectedID
    watch(formalitySelectedID, (newVal) => {
      if (newVal) {
        formalitySelectedID.value = newVal;
      }
    });

    // Theo dõi sự thay đổi của publisherSelectedID
    watch(publisherSelectedID, (newVal) => {
      if (newVal) {
        publisherSelectedID.value = newVal;
      }
    });

    // Theo dõi sự thay đổi của priceRangeSelectedID
    watch(priceRangeSelectedID, (newVal) => {
      if (newVal) {
        priceRangeSelectedID.value = newVal;
      }
    });

    // Theo dõi sự thay đổi của authorID
    watch(authorID, (newVal) => {
      if (newVal) {
        data.value.authorID = newVal;
      }
    });

    // Theo dõi sự thay đổi của publisherID
    watch(publisherID, (newVal) => {
      if (newVal) {
        data.value.publisherID = newVal;
      }
    });

    // Theo dõi sự thay đổi của categoryID
    watch(categoryID, (newVal) => {
      if (newVal) {
        data.value.categoryID = newVal;
      }
    });

    // Theo dõi sự thay đổi của formalityID
    watch(formalityID, (newVal) => {
      if (newVal) {
        data.value.formalityID = newVal;
      }
    });

    // Theo dõi sự thay đổi của priceRangeID
    watch(priceRangeID, (newVal) => {
      if (newVal) {
        data.value.priceRangeID = newVal;
      }
    });

    const clearDropdownAuthors = (className) => {
      searchAuthorValue.value = "";
      authorSelectedID.value = "";
      $(`.${className}`).addClass("show");
    };
    const clearDropdownCategories = (className) => {
      searchCategoryValue.value = "";
      categorySelectedID.value = "";
      $(`.${className}`).addClass("show");
    };
    const clearDropdownFormalities = (className) => {
      searchFormalityValue.value = "";
      formalitySelectedID.value = "";
      $(`.${className}`).addClass("show");
    };
    const clearDropdownPriceranges = (className) => {
      searchPriceRangeValue.value = "";
      priceRangeSelectedID.value = "";
      $(`.${className}`).addClass("show");
    };
    const clearDropdownPublsihers = (className) => {
      searchPublisherValue.value = "";
      publisherSelectedID.value = "";
      $(`.${className}`).addClass("show");
    };

    return {
      book,
      errors,
      updateBook,
      data,
      updateBookSchema,
      // Authors
      searchAuthorValue,
      authorOptions,
      authorSelectedID,
      selectAuthorID,
      authorID,
      loadingAuthors,
      // Publishers
      searchPublisherValue,
      publisherOptions,
      publisherSelectedID,
      selectpublisherID,
      publisherID,
      loadingPublishers,
      // Categories
      searchCategoryValue,
      categoryOptions,
      categorySelectedID,
      selectCategoryID,
      categoryID,
      loadingCategories,
      // Formalities
      searchFormalityValue,
      formalityOptions,
      formalitySelectedID,
      selectFormalityID,
      formalityID,
      loadingFormalities,
      // PriceRanges
      searchPriceRangeValue,
      priceRangeOptions,
      priceRangeSelectedID,
      selectPriceRangeID,
      priceRangeID,
      loadingPriceranges,
      //
      clearDropdownAuthors,
      clearDropdownCategories,
      clearDropdownFormalities,
      clearDropdownPriceranges,
      clearDropdownPublsihers,
    };
  },
};
</script>
<style scoped>
@import '../../../assets/css/admin/dropdown/dropdown.css';
</style>
