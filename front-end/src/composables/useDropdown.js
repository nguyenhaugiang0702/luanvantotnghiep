import { ref, computed, watch } from "vue";
import AuthorsService from "@/service/author.service";
import PublisherService from "@/service/publisher.service";
import CategoryService from "@/service/category.service";
import FormalityService from "@/service/formality.service";

export default function useDropdown(entityType) {
  const searchValue = ref("");
  const selected = ref(false);
  const options = ref([]);
  const itemID = ref("");

  // Mapping giữa loại entity và service tương ứng
  const serviceMap = {
    authors: new AuthorsService(),
    publishers: new PublisherService(),
    categories: new CategoryService(),
    formalities: new FormalityService(),
  };

  const service = serviceMap[entityType]; // Chọn service dựa trên entityType

  const getItems = async () => {
    if (service) {
      const response = await service.get("/");
      if (response.status === 200) {
        options.value = response.data;
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
    // if (!filteredOptions.value.some((option) => option.name === newValue)) {
    //   selected.value = false;
    // }
    const matchedAuthor = filteredOptions.value.find(
      (item) => item.name.toLowerCase() === newValue.toLowerCase()
    );

    if (!matchedAuthor) {
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
