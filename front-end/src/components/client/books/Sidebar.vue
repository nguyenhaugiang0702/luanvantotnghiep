<template>
  <div class="sidebar p-3">
    <h5 class="mb-3">Giá</h5>
    <ul class="list-unstyled">
      <li
        class="form-check mb-2"
        v-for="priceRange in visiblePriceRange"
        :key="priceRange._id"
      >
        <div :title="priceRange.name">
          <input
            class="form-check-input border border-dark"
            type="radio"
            name="pricerange"
            :id="`pricerange-${priceRange._id}`"
            @change="
              handleFilterChange('price', priceRange._id, $event.target.checked)
            "
          />
          <label class="form-check-label" :for="`pricerange-${priceRange._id}`">
            {{ priceRange.name }}
          </label>
        </div>
      </li>
    </ul>
    <div
      v-if="visiblePriceRange.length >= 8"
      class="mb-2 text-center text-primary"
    >
      <span @click="togglePriceRange" class="showMore">
        {{ showMorePriceRange ? "Thu gọn" : "Xem thêm" }}
        <i
          :class="[
            'fa-solid',
            showMorePriceRange ? 'fa-arrow-turn-up' : 'fa-arrow-turn-down',
          ]"
        ></i>
      </span>
    </div>

    <!-- Thể loại -->
    <h5 class="mb-3">Thể loại</h5>
    <ul class="list-unstyled">
      <li
        v-for="(category, index) in visibleCategories"
        :key="category._id"
        class="form-check mb-2"
      >
        <div :title="category.name">
          <input
            class="form-check-input border border-dark"
            type="checkbox"
            :id="`category-${category._id}`"
            :value="category._id"
            @change="
              handleFilterChange(
                'category',
                category._id,
                $event.target.checked
              )
            "
          />
          <label class="form-check-label" :for="`category-${category._id}`">{{
            category.name
          }}</label>
        </div>
      </li>
    </ul>
    <div
      v-if="visibleCategories.length >= 8"
      class="form-check mb-2 text-center"
    >
      <span @click="toggleCategories" class="showMore">
        {{ showMoreCategories ? "Thu gọn" : "Xem thêm" }}
        <i
          :class="[
            'fa-solid',
            showMoreCategories ? 'fa-arrow-turn-up' : 'fa-arrow-turn-down',
          ]"
        ></i>
      </span>
    </div>

    <!-- Nhà cung cấp -->
    <h5 class="mb-3">Nhà xuất bản</h5>
    <ul class="list-unstyled">
      <li
        v-for="publisher in visiblePublishers"
        :key="publisher._id"
        class="form-check mb-2"
      >
        <div :title="publisher.name">
          <input
            class="form-check-input border border-dark"
            type="checkbox"
            :id="`publisher-${publisher._id}`"
            :value="publisher._id"
            @change="
              handleFilterChange(
                'publisher',
                publisher._id,
                $event.target.checked
              )
            "
          />
          <label class="form-check-label" :for="`publisher-${publisher._id}`">{{
            publisher.name
          }}</label>
        </div>
      </li>
    </ul>
    <div
      v-if="visiblePublishers.length >= 8"
      class="mb-2 text-center text-primary"
    >
      <span @click="togglePublishers" class="showMore">
        {{ showMorePublishers ? "Thu gọn" : "Xem thêm" }}
        <i
          :class="[
            'fa-solid',
            showMorePublishers ? 'fa-arrow-turn-up' : 'fa-arrow-turn-down',
          ]"
        ></i>
      </span>
    </div>

    <!-- Nhà cung cấp -->
    <h5 class="mb-3">Nhà cung cấp</h5>
    <ul class="list-unstyled">
      <li
        v-for="supplier in visibleSuppliers"
        :key="supplier._id"
        class="form-check mb-2"
      >
        <div :title="supplier.name">
          <input
            class="form-check-input border border-dark"
            type="checkbox"
            :id="`supplier-${supplier._id}`"
            :value="supplier._id"
            @change="
              handleFilterChange(
                'supplier',
                supplier._id,
                $event.target.checked
              )
            "
          />
          <label class="form-check-label" :for="`supplier-${supplier._id}`">{{
            supplier.name
          }}</label>
        </div>
      </li>
    </ul>
    <div
      v-if="visibleSuppliers.length >= 8"
      class="mb-2 text-center text-primary"
    >
      <span @click="toggleSuppliers" class="showMore">
        {{ showMoreSuppliers ? "Thu gọn" : "Xem thêm" }}
        <i
          :class="[
            'fa-solid',
            showMoreSuppliers ? 'fa-arrow-turn-up' : 'fa-arrow-turn-down',
          ]"
        ></i>
      </span>
    </div>

    <!-- Hình thức -->
    <h5 class="mb-3">Hình thức</h5>
    <ul class="list-unstyled">
      <li
        v-for="formality in visibleFormalities"
        :key="formality._id"
        class="form-check mb-2"
      >
        <div :title="formality.name">
          <input
            class="form-check-input border border-dark"
            type="checkbox"
            :id="`formality-${formality._id}`"
            :value="formality._id"
            @change="
              handleFilterChange(
                'formality',
                formality._id,
                $event.target.checked
              )
            "
          />
          <label class="form-check-label" :for="`formality-${formality._id}`">{{
            formality.name
          }}</label>
        </div>
      </li>
    </ul>
    <div
      v-if="visibleFormalities.length >= 8"
      class="mb-2 text-center text-primary"
    >
      <span @click="toggleFormalities" class="showMore">
        {{ showMoreFormalities ? "Thu gọn" : "Xem thêm" }}
        <i
          :class="[
            'fa-solid',
            showMoreFormalities ? 'fa-arrow-turn-up' : 'fa-arrow-turn-down',
          ]"
        ></i>
      </span>
    </div>

    <!-- Tác giả -->
    <h5 class="mb-3">Tác giả</h5>
    <ul class="list-unstyled">
      <li
        v-for="author in visibleAuthors"
        :key="author._id"
        class="form-check mb-2"
      >
        <div :title="author.name">
          <input
            class="form-check-input border border-dark"
            type="checkbox"
            :id="`author-${author._id}`"
            :value="author._id"
            @change="
              handleFilterChange('author', author._id, $event.target.checked)
            "
          />
          <label class="form-check-label" :for="`author-${author._id}`">{{
            author.name
          }}</label>
        </div>
      </li>
    </ul>
    <div
      v-if="visibleAuthors.length >= 8"
      class="mb-2 text-center text-primary"
    >
      <span @click="toggleAuthors" class="showMore">
        {{ showMoreAuthors ? "Thu gọn" : "Xem thêm" }}
        <i
          :class="[
            'fa-solid',
            showMoreAuthors ? 'fa-arrow-turn-up' : 'fa-arrow-turn-down',
          ]"
        ></i>
      </span>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useExpandableList } from "@/composables/useExpandableList";
import AuthorsService from "@/service/author.service";
import PublisherService from "@/service/publisher.service";
import CategoryService from "@/service/category.service";
import FormalityService from "@/service/formality.service";
import SupplierService from "@/service/supplier.service";
import PriceRangeService from "@/service/priceRange.service";
import BookService from "@/service/book.service";

export default {
  setup(props, { emit }) {
    const authors = ref([]);
    const publishers = ref([]);
    const categories = ref([]);
    const formalities = ref([]);
    const suppliers = ref([]);
    const priceranges = ref([]);
    const selectedFilters = ref({
      price: [],
      category: [],
      publisher: [],
      supplier: [],
      formality: [],
      author: [],
    });

    // Services
    const authorsService = new AuthorsService();
    const publishersService = new PublisherService();
    const categoriesService = new CategoryService();
    const formalitiesService = new FormalityService();
    const supplierService = new SupplierService();
    const priceRangeService = new PriceRangeService();
    const bookService = new BookService();

    const fetchData = async () => {
      const [
        authorsResponse,
        publishersResponse,
        categoriesResponse,
        formalitiesResponse,
        suppliersResponse,
        pricerangesResponse,
      ] = await Promise.all([
        authorsService.get("/"),
        publishersService.get("/"),
        categoriesService.get("/"),
        formalitiesService.get("/"),
        supplierService.get("/"),
        priceRangeService.get("/"),
      ]);

      if (authorsResponse.status === 200) {
        authors.value = authorsResponse.data;
      }
      if (publishersResponse.status === 200) {
        publishers.value = publishersResponse.data;
      }
      if (categoriesResponse.status === 200) {
        categories.value = categoriesResponse.data;
      }
      if (formalitiesResponse.status === 200) {
        formalities.value = formalitiesResponse.data;
      }
      if (suppliersResponse.status === 200) {
        suppliers.value = suppliersResponse.data;
      }
      if (pricerangesResponse.status === 200) {
        priceranges.value = pricerangesResponse.data;
      }
    };

    // useExpandableList
    const {
      visibleItems: visibleAuthors,
      showMore: showMoreAuthors,
      toggleItems: toggleAuthors,
    } = useExpandableList(authors);
    const {
      visibleItems: visibleCategories,
      showMore: showMoreCategories,
      toggleItems: toggleCategories,
    } = useExpandableList(categories);
    const {
      visibleItems: visibleFormalities,
      showMore: showMoreFormalities,
      toggleItems: toggleFormalities,
    } = useExpandableList(formalities);
    const {
      visibleItems: visiblePublishers,
      showMore: showMorePublishers,
      toggleItems: togglePublishers,
    } = useExpandableList(publishers);
    const {
      visibleItems: visibleSuppliers,
      showMore: showMoreSuppliers,
      toggleItems: toggleSuppliers,
    } = useExpandableList(suppliers);
    const {
      visibleItems: visiblePriceRange,
      showMore: showMorePriceRange,
      toggleItems: togglePriceRange,
    } = useExpandableList(priceranges);

    const handleFilterChange = (filterType, value, isChecked) => {
      if (isChecked) {
        selectedFilters.value[filterType].push(value);
      } else {
        const index = selectedFilters.value[filterType].indexOf(value);
        if (index > -1) {
          selectedFilters.value[filterType].splice(index, 1);
        }
      }
      applyFilters();
    };

    const applyFilters = () => {
      const filters = { ...selectedFilters.value };
      // Gọi API để lọc sản phẩm
      fetchFilteredProducts(filters);
    };

    const fetchFilteredProducts = async (filters) => {
      try {
        const filtersString = JSON.stringify(filters);
        // Giả sử có một service lấy sản phẩm đã được filter
        const response = await bookService.get(
          `/filters?filters=${filtersString}`
        );
        if (response.status === 200) {
          // Xử lý dữ liệu sản phẩm nhận được sau khi lọc
          console.log("Filtered Products:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch filtered products", error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      authors,
      publishers,
      categories,
      formalities,
      /* Authors */
      visibleAuthors,
      showMoreAuthors,
      toggleAuthors,
      /* Categories */
      visibleCategories,
      showMoreCategories,
      toggleCategories,
      /* Formalities */
      visibleFormalities,
      showMoreFormalities,
      toggleFormalities,
      /* Suppliers */
      visibleSuppliers,
      showMoreSuppliers,
      toggleSuppliers,
      /* Publishers */
      visiblePublishers,
      showMorePublishers,
      togglePublishers,
      /* Publishers */
      visiblePriceRange,
      showMorePriceRange,
      togglePriceRange,
      /* filter */
      handleFilterChange,
    };
  },
};
</script>

<style scoped>
.showMore {
  cursor: pointer;
}
.sidebar {
  background-color: #fff;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
</style>
