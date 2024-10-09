<template>
  <div class="sidebar p-3">
    <h5 class="mb-3">Giá</h5>
    <hr class="custom-hr" />
    <ul class="list-unstyled">
      <li
        class="form-check mb-2"
        v-for="priceRange in visiblePriceRange"
        :key="priceRange._id"
      >
        <div :title="priceRange.name">
          <input
            class="form-check-input border border-dark"
            type="checkbox"
            name="price"
            :id="`price-${priceRange._id}`"
            @change="
              handleFilterChange('price', priceRange, $event.target.checked)
            "
          />
          <label class="form-check-label" :for="`price-${priceRange._id}`">
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
    <hr class="custom-hr" />
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
              handleFilterChange('category', category, $event.target.checked)
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
    <hr class="custom-hr" />
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
              handleFilterChange('publisher', publisher, $event.target.checked)
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

    <!-- Hình thức -->
    <h5 class="mb-3">Hình thức</h5>
    <hr class="custom-hr">
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
              handleFilterChange('formality', formality, $event.target.checked)
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
    <hr class="custom-hr">
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
              handleFilterChange('author', author, $event.target.checked)
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
import { ref, computed, onMounted, watch } from "vue";
import { useExpandableList } from "@/composables/useExpandableList";
import ApiUser from "@/service/user/apiUser.service";

export default {
  emit: ["selected-ids"],
  props: {
    filteredTagsDelete: {
      type: Object,
      default: () => ({
        author: [],
        category: [],
        formality: [],
        price: [],
        publisher: [],
      }),
    },
  },
  setup(props, { emit }) {
    const authors = ref([]);
    const publishers = ref([]);
    const categories = ref([]);
    const formalities = ref([]);
    const priceranges = ref([]);
    const selectedFilters = ref({
      price: [],
      category: [],
      publisher: [],
      formality: [],
      author: [],
    });

    // Services
    const apiUser = new ApiUser();

    const fetchData = async () => {
      const [
        authorsResponse,
        publishersResponse,
        categoriesResponse,
        formalitiesResponse,
        pricerangesResponse,
      ] = await Promise.all([
        apiUser.get("/filters/authors"),
        apiUser.get("/filters/publishers"),
        apiUser.get("/filters/categories"),
        apiUser.get("/filters/formalities"),
        apiUser.get("/filters/priceranges"),
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
      visibleItems: visiblePriceRange,
      showMore: showMorePriceRange,
      toggleItems: togglePriceRange,
    } = useExpandableList(priceranges);

    const handleFilterChange = (filterType, value, isChecked) => {
      const currentFilters = selectedFilters.value[filterType];
      if (isChecked) {
        currentFilters.push({
          id: value._id,
          name: value.name,
        });
      } else {
        const index = currentFilters.findIndex((item) => item.id === value._id);
        if (index > -1) {
          currentFilters.splice(index, 1);
        }
      }
      // Cập nhật các bộ lọc
      emit("selected-ids", selectedFilters.value);
    };

    const updateCheckboxes = (filters, newFilters) => {
      for (const [filterType, items] of Object.entries(filters)) {
        items.forEach((item) => {
          const checkbox = document.getElementById(`${filterType}-${item._id}`);
          if (checkbox) {
            // Chỉ cần cập nhật checkbox nếu có thay đổi trong newFilters
            if (newFilters[filterType]) {
              const ids = newFilters[filterType].map((item) => item.id);
              checkbox.checked = ids.includes(item._id);
            }
          }
        });
      }
    };

    watch(
      () => props.filteredTagsDelete,
      async (newFilters) => {
        if (Object.keys(newFilters).length === 0) {
          selectedFilters.value = {
            price: [],
            category: [],
            publisher: [],
            formality: [],
            author: [],
          };
        } else {
          // Cập nhật selectedFilters dựa trên newFilters
          Object.keys(newFilters).forEach((key) => {
            const ids = newFilters[key].map((item) => item.id);
            // Cập nhật selectedFilters với các id còn lại
            selectedFilters.value[key] = selectedFilters.value[key].filter(
              (item) => ids.includes(item.id)
            );
          });
        }

        // Cập nhật checkbox sau khi selectedFilters đã được cập nhật
        updateCheckboxes(
          {
            price: priceranges.value,
            category: categories.value,
            publisher: publishers.value,
            formality: formalities.value,
            author: authors.value,
          },
          selectedFilters.value
        );
        emit("selected-ids", selectedFilters.value);
      },
      { immediate: true }
    );

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
.custom-hr {
  height: 3px; /* Tăng độ dày của thanh */
  background-color: var(--bs-primary); /* Màu chính của Bootstrap */
  border: none; /* Loại bỏ đường viền mặc định */
}
</style>
