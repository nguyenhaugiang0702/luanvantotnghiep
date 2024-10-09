import { ref, computed, watch, onMounted } from "vue";
import ApiAdmin from "@/service/admin/apiAdmin.service";

export default function useDropdown(entityType, initialID = "") {
  const searchValue = ref("");
  const selected = ref(false);
  const options = ref([]);
  const itemID = ref(initialID);
  const extraData = ref(null); // Thêm để chứa dữ liệu bổ sung (hình thức)
  const loading = ref(true);

  // Mapping giữa loại entity và service tương ứng
  const apiAdmin = new ApiAdmin();

  const getItems = async () => {
    if (entityType === "vouchersCategory") {
      const response = await apiAdmin.get("/vouchers/voucherCategory");
      if (response.status === 200) {
        options.value = response.data;
        if (initialID) {
          watch(itemID, (newValue) => {
            const selectedItem = options.value.find(
              (item) => item._id === newValue
            );
            if (selectedItem) {
              searchValue.value = selectedItem.name;
              selected.value = true;
            }
          });
        }
      }
    } else {
      try {
        loading.value = true;
        const response = await apiAdmin.get(`/${entityType}`);
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
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        loading.value = false;
      }
    }
  };

  const filteredOptions = computed(() => {
    return options.value.filter((item) =>
      item.name.toLowerCase().includes(searchValue.value.toLowerCase())
    );
  });

  const selectItem = async (item) => {
    searchValue.value = item.name;
    selected.value = true;
    itemID.value = item._id;
    // Nếu entity là sách, lấy thông tin bổ sung (như hình thức)
    if (entityType === "books") {
      const bookService = new BookService();
      const response = await bookService.get(`/${item._id}`);
      if (response.status === 200) {
        extraData.value = response.data.formalityID;
      }
    }
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

  getItems();

  return {
    itemID,
    searchValue,
    filteredOptions,
    selected,
    selectItem,
    extraData,
    loading,
  };
}