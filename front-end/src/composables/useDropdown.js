// import { ref, computed, watch, onMounted } from "vue";
// import ApiAdmin from "@/service/admin/apiAdmin.service";

// export default function useDropdown(entityType, initialID = "") {
//   const searchValue = ref("");
//   const selected = ref(false);
//   const options = ref([]);
//   const itemID = ref(initialID);
//   const extraData = ref(null); // Thêm để chứa dữ liệu bổ sung (hình thức)
//   const loading = ref(true);

//   // Mapping giữa loại entity và service tương ứng
//   const apiAdmin = new ApiAdmin();

//   const getItems = async () => {
//     if (entityType === "vouchersCategory") {
//       const response = await apiAdmin.get("/vouchers/voucherCategory");
//       if (response.status === 200) {
//         options.value = response.data;
//         if (initialID) {
//           // watch(itemID, (newValue) => {
//           //   const selectedItem = options.value.find(
//           //     (item) => item._id === newValue
//           //   );
//           //   if (selectedItem) {
//           //     searchValue.value = selectedItem.name;
//           //     selected.value = true;
//           //   }
//           // });
//           const selectedItem = options.value.find(
//             (item) => item._id === newValue
//           );
//           if (selectedItem) {
//             searchValue.value = selectedItem.name;
//             selected.value = true;
//           }
//         }
//       }
//     } else {
//       try {
//         loading.value = true;
//         const response = await apiAdmin.get(`/${entityType}`);
//         if (response.status === 200) {
//           options.value = response.data;
//           if (initialID) {
//             const selectedItem = options.value.find(
//               (item) => item._id === initialID
//             );
//             if (selectedItem) {
//               searchValue.value = selectedItem.name;
//               selected.value = true;
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       } finally {
//         loading.value = false;
//       }
//     }
//   };

//   const filteredOptions = computed(() => {
//     return options.value.filter((item) =>
//       item.name.toLowerCase().includes(searchValue.value.toLowerCase())
//     );
//   });

//   const selectItem = async (item) => {
//     searchValue.value = item.name;
//     selected.value = true;
//     itemID.value = item;
//     // Nếu entity là sách, lấy thông tin bổ sung (như hình thức)
//     if (entityType === "books") {
//       const bookService = new BookService();
//       const response = await bookService.get(`/${item._id}`);
//       if (response.status === 200) {
//         extraData.value = response.data.formalityID;
//       }
//     }
//   };

//   watch(searchValue, (newValue) => {
//     const matchedItem = filteredOptions.value.find(
//       (item) => item.name.toLowerCase() === newValue.toLowerCase()
//     );

//     if (matchedItem) {
//       itemID.value = matchedItem;
//       selected.value = true;
//     } else {
//       itemID.value = "";
//       selected.value = false;
//     }
//   });

//   getItems();

//   return {
//     itemID,
//     searchValue,
//     filteredOptions,
//     selected,
//     selectItem,
//     extraData,
//     loading,
//   };
// }


import { ref, computed, watch, onMounted } from "vue";
import ApiAdmin from "@/service/admin/apiAdmin.service";

export default function useDropdown(entityType, initialID = "") {
  const searchValue = ref(""); // Giá trị nhập vào
  const selected = ref(false); // Trạng thái đã chọn
  const options = ref([]); // Danh sách các lựa chọn
  const itemID = ref(initialID); // ID của mục đã chọn
  const extraData = ref(null); // Thông tin bổ sung, ví dụ hình thức
  const loading = ref(true); // Trạng thái loading

  const apiAdmin = new ApiAdmin(); // Dịch vụ API chung

  // Fetch dữ liệu từ API theo `entityType`
  const getItems = async () => {
    try {
      loading.value = true;
      const endpoint =
        entityType === "vouchersCategory"
          ? "/vouchers/voucherCategory"
          : `/${entityType}`;
      const response = await apiAdmin.get(endpoint);

      if (response.status === 200) {
        options.value = response.data;

        // Nếu có initialID, khởi tạo trạng thái dropdown
        if (initialID) {
          const selectedItem = options.value.find(
            (item) => item._id === initialID
          );
          if (selectedItem) {
            searchValue.value = selectedItem.name;
            itemID.value = selectedItem._id; // Lưu ID
            selected.value = true;
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching ${entityType}:`, error);
    } finally {
      loading.value = false;
    }
  };

  // Bộ lọc danh sách theo searchValue
  const filteredOptions = computed(() => {
    if (!searchValue.value) return options.value;
    return options.value.filter((item) =>
      item.name?.toLowerCase().includes(searchValue.value.toLowerCase())
    );
  });

  // Khi chọn mục từ dropdown
  const selectItem = async (item) => {
    searchValue.value = item.name;
    itemID.value = item; // Lưu ID
    selected.value = true;

    // Nếu entity là sách, fetch thông tin bổ sung
    if (entityType === "books") {
      const bookService = new ApiAdmin();
      const response = await bookService.get(`/${item._id}`);
      if (response.status === 200) {
        extraData.value = response.data.formalityID; // Thông tin bổ sung
      }
    }
  };

  // Xử lý khi giá trị searchValue thay đổi
  watch(searchValue, (newValue) => {
    if (!newValue) {
      itemID.value = ""; // Xóa ID khi xóa searchValue
      selected.value = false;
      return;
    }

    const matchedItem = filteredOptions.value.find(
      (item) => item.name?.toLowerCase() === newValue.toLowerCase()
    );

    if (matchedItem) {
      itemID.value = matchedItem; // Lưu ID khi có khớp
      selected.value = true;
    } else {
      itemID.value = ""; // Không khớp thì xóa ID
      selected.value = false;
    }
  });

  // Gọi fetch dữ liệu khi khởi tạo
  onMounted(() => {
    getItems();
  });

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
