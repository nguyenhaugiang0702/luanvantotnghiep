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
      <div v-if="address.length !== 0" class="row">
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
        <!-- Phân trang -->
        <Pagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          @updatePage="handlePageChange"
        />
      </div>

      <div v-else class="d-flex justify-content-center">Không có địa chỉ</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import ApiUser from "@/service/user/apiUser.service";
import { toast } from "vue3-toastify";
import Cookies from "js-cookie";
import { showConfirmation } from "@/utils/swalUtils";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import Pagination from "../../../Pagination.vue";

export default {
  components: {
    Pagination,
  },
  setup() {
    const apiUser = new ApiUser();
    const token = Cookies.get("accessToken");
    const address = ref([]);
    // Phân trang
    const currentPage = ref(1);
    const limit = ref(3);
    const totalPages = ref(1);
    const getAddress = async (page, limit) => {
      const response = await apiUser.get(
        `/addresses?page=${page}&limit=${limit}`
      );
      if (response.status === 200) {
        address.value = response.data.addresses;
        totalPages.value = response.data.totalPages;
        currentPage.value = response.data.currentPage;
      }
    };

    const changeDefaultAddress = async (addressID) => {
      const data = {
        isDefault: true,
      };
      const response = await apiUser.put(`/addresses/${addressID}`, data);
      if (response.status === 200) {
        showSuccessToast(response?.data?.message);
        getAddress();
      }
    };

    const deleteAddress = async (addressID) => {
      const response = await apiUser.delete(`/addresses/${addressID}`);
      if (response.status === 200) {
        showSuccessToast(response?.data?.message);
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

    onMounted(() => {
      getAddress(currentPage.value, limit.value);
    });

    const handlePageChange = (page) => {
      currentPage.value = page;
      getAddress(currentPage.value, limit.value);
    };

    return {
      address,
      changeDefaultAddress,
      removeAddress,
      totalPages,
      currentPage,
      limit,
      handlePageChange,
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
