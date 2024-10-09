<template>
  <div class="container bg-white pb-3">
    <div class="p-3 d-flex justify-content-between">
      <h4 class="text-uppercase">Địa chỉ</h4>
      <router-link
        :to="{ name: 'profile-address-add' }"
        class="btn btn-primary col-sm-2 ms-5 text-decoration-none"
        >Thêm địa chỉ</router-link
      >
    </div>
    <!-- Danh sách địa chỉ -->
    <div class="address-container">
      <div class="row">
        <div v-for="addr in address" :key="addr.id" class="address-item">
          <div class="col-sm-12 ms-3 mb-4">
            <div>
              <span>Họ và tên: </span>
              <span class="fw-bold"
                >{{ addr.firstName }} {{ addr.lastName }}</span
              >
            </div>
            <div>
              <span>Số điện thoại: </span>
              <span class="fw-bold">{{ addr.phoneNumber }}</span>
            </div>
            <div>
              <span>Địa chỉ: </span>
              <span class="fw-bold">{{
                addr.detailAddress +
                ", " +
                addr.ward.name +
                ", " +
                addr.district.name +
                ", " +
                addr.province.name
              }}</span>
            </div>
            <div>
              <span v-if="addr.isDefault">
                <span class="text-danger fw-bold">Địa chỉ mặc định </span>
              </span>

              <span
                >[
                <router-link
                  :to="{
                    name: 'profile-address-edit',
                    params: { addressID: addr._id },
                  }"
                  class="text-decoration-none text-dark"
                  ><span class="changeAddress"
                    >Thay đổi địa chỉ</span
                  ></router-link
                >
              </span>
              <span v-if="!addr.isDefault">
                |
                <span
                  class="changeAddress"
                  @click="changeDefaultAddress(addr._id)"
                  >Đặt làm địa chỉ mặc định</span
                >
                <span @click="removeAddress(addr._id)" class="changeAddress">
                  | Xóa địa chỉ</span
                >
              </span>
              ]
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Xem thêm -->
    <div v-if="address.length > visibleCount">
      <div
        class="btn-toggle"
        @click="toggleShowAll"
        :class="{ 'show-all': !showAll }"
      >
        {{ showAll ? "Thu gọn" : "Xem thêm" }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import ApiUser from "@/service/user/apiUser.service";
import { toast } from "vue3-toastify";
import Cookies from "js-cookie";
import { showConfirmation } from "@/utils/swalUtils";
export default {
  setup() {
    const apiUser = new ApiUser();
    const token = Cookies.get("accessToken");
    const address = ref([]);
    const showAll = ref(false);
    const visibleCount = ref(5);
    const getAddress = async () => {
      const response = await apiUser.get("/addresses");
      if (response.status === 200) {
        address.value = response.data;
      }
    };

    const changeDefaultAddress = async (addressID) => {
      const data = {
        isDefault: true,
      };
      const response = await apiUser.put(`/addresses/${addressID}`, data);
      if (response.status === 200) {
        toast(response.data.message, {
          theme: "auto",
          type: "success",
          dangerouslyHTMLString: true,
        });
        getAddress();
      }
    };

    const deleteAddress = async (addressID) => {
      const response = await apiUser.delete(`/addresses/${addressID}`);
      if (response.status === 200) {
        toast(response.data.message, {
          theme: "auto",
          type: "success",
          dangerouslyHTMLString: true,
        });
        getAddress();
      }
    };

    const removeAddress = async (addressID) => {
      const isConfimed = await showConfirmation({
        title: "Bạn chắc chắn muỗn xóa địa chỉ này?",
      });
      if (isConfimed.isConfirmed) {
        await deleteAddress(addressID);
      }
    };

    const visibleAddresses = computed(() => {
      if (showAll.value) {
        return address.value;
      } else {
        return address.value.slice(0, visibleCount.value);
      }
    });

    const toggleShowAll = () => {
      showAll.value = !showAll.value;
      // Tùy chọn: có thể thêm một hiệu ứng cho danh sách
      document
        .querySelector(".address-container")
        .classList.toggle("show-all", showAll.value);
      document
        .querySelector(".address-container")
        .classList.toggle("hide-all", !showAll.value);
    };

    onMounted(() => {
      getAddress();
    });

    return {
      address,
      changeDefaultAddress,
      removeAddress,
      visibleAddresses,
      toggleShowAll,
      showAll,
      visibleCount,
    };
  },
};
</script>

<style scoped>
.changeAddress:hover {
  color: blue;
}

.changeAddress {
  cursor: pointer;
}

.btn-toggle {
  cursor: pointer;
  text-align: center;
  color: black;
}

/* Hiệu ứng cho danh sách địa chỉ */
.address-container {
  max-height: 350px; /* Chiều cao tối đa khi thu gọn */
  overflow: hidden; /* Ẩn phần nội dung bị tràn */
  opacity: 1;
  transition: max-height 0.5s ease-out, opacity 0.5s ease-out;
}

.address-container.show-all {
  max-height: 1200px; /* Hoặc giá trị đủ lớn để chứa tất cả các địa chỉ */
  opacity: 1;
}

.address-container.hide-all {
  max-height: 350px;
  opacity: 1;
  overflow: hidden;
}
</style>
