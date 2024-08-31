import { ref, computed, watch } from "vue";
import AuthorsService from "@/service/author.service";
import PublisherService from "@/service/publisher.service";
import CategoryService from "@/service/category.service";
import FormalityService from "@/service/formality.service";
import PriceRangeService from "@/service/priceRange.service";

export default function useDropdown(entityType, initialID = "") {
  const searchValue = ref("");
  const selected = ref(false);
  const options = ref([]);
  const itemID = ref(initialID);

  // Mapping giữa loại entity và service tương ứng
  const serviceMap = {
    authors: new AuthorsService(),
    publishers: new PublisherService(),
    categories: new CategoryService(),
    formalities: new FormalityService(),
    priceranges: new PriceRangeService(),
  };

  const service = serviceMap[entityType]; // Chọn service dựa trên entityType

  const getItems = async () => {
    if (service) {
      const response = await service.get("/");
      if (response.status === 200) {
        options.value = response.data;
        if (initialID) {
          const selectedItem = options.value.find(
            (item) => item._id === initialID
          );
          if (selectedItem) {
            searchValue.value = selectedItem.name;
            selected.value = true;
          }
        }
      }
    }
  };

  const filteredOptions = computed(() => {
    return options.value.filter((item) =>
      item.name.toLowerCase().includes(searchValue.value.toLowerCase())
    );
  });

  const selectItem = (item) => {
    searchValue.value = item.name;
    selected.value = true;
    itemID.value = item._id;
  };

  watch(searchValue, (newValue) => {
    const matchedItem = filteredOptions.value.find(
      (item) => item.name.toLowerCase() === newValue.toLowerCase()
    );

    if (matchedItem) {
      itemID.value = matchedItem._id;
      selected.value = true;
    } else {
      itemID.value = "";
      selected.value = false;
    }
  });

  getItems(); // Tự động gọi hàm để load data khi component được mount

  return {
    itemID,
    searchValue,
    filteredOptions,
    selected,
    selectItem,
  };
}
