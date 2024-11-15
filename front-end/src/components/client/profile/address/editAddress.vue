<template>
  <div class="container bg-white">
    <h4 class="p-3">Địa chỉ</h4>
    <!-- Thêm địa chỉ -->
    <form @submit.prevent="updateAddress">
      <div class="row">
        <div class="col-md-3">
          <h5 class="ms-3">Thông tin liên hệ</h5>
          <div class="form-group ms-3 mt-4">
            <label for="">Tên</label>
            <Field
              placeholder="Tên"
              name="firstName"
              :class="{
                'is-invalid': errors.firstName,
                'is-valid': !errors.firstName && address.firstName !== '',
              }"
              v-model="address.firstName"
              type="text"
              class="form-control"
            />
            <ErrorMessage name="firstName" class="invalid-feedback" />
          </div>
          <div class="form-group ms-3 mt-3">
            <label for="">Họ</label>
            <Field
              placeholder="Họ"
              name="lastName"
              type="text"
              class="form-control"
              v-model="address.lastName"
              :class="{
                'is-invalid': errors.lastName,
                'is-valid': !errors.lastName && address.lastName !== '',
              }"
            />
            <ErrorMessage name="lastName" class="invalid-feedback" />
          </div>
          <div class="form-group ms-3 mt-3">
            <label for="">Số điện thoại</label>
            <Field
              placeholder="Số điện thoại"
              name="phoneNumber"
              type="text"
              class="form-control"
              v-model="address.phoneNumber"
              :class="{
                'is-invalid': errors.phoneNumber,
                'is-valid': !errors.phoneNumber && address.phoneNumber !== '',
              }"
            />
            <ErrorMessage name="phoneNumber" class="invalid-feedback" />
          </div>
        </div>
        <div class="col-md-9">
          <h5 class="ms-3">Địa chỉ</h5>
          <div class="form-group ms-3 mt-4">
            <label for=""></label>
            <Field
              placeholder="Địa chỉ"
              name="detailAddress"
              type="text"
              class="form-control"
              v-model="address.detailAddress"
              :class="{
                'is-invalid': errors.detailAddress,
                'is-valid':
                  !errors.detailAddress && address.detailAddress !== '',
              }"
            />
            <ErrorMessage name="detailAddress" class="invalid-feedback" />
          </div>
          <div class="row mt-3">
            <div class="col-sm-4 form-group ms-3">
              <label for="">Tỉnh/Thành phố</label>
              <Field
                as="select"
                class="form-select"
                :class="{
                  'is-invalid': errors.province,
                  'is-valid': !errors.province && selectedProvince !== 0,
                }"
                name="province"
                v-model="selectedProvince"
                @change="fetchDistricts"
                title="Chọn Tỉnh Thành"
              >
                <option value="0">Chọn tỉnh</option>
                <option
                  v-for="province in provinces"
                  :key="province.id"
                  :value="province.id"
                >
                  {{ province.name }}
                </option>
              </Field>
              <ErrorMessage name="province" class="invalid-feedback" />
            </div>
            <div class="col-sm-4 form-group ms-3">
              <label for="">Quận/Huyện</label>
              <Field
                as="select"
                class="form-select"
                :class="{
                  'is-invalid': errors.district,
                  'is-valid': !errors.district && selectedDistrict !== 0,
                }"
                name="district"
                v-model="selectedDistrict"
                @change="fetchWards"
                title="Chọn Quận Huyện"
              >
                <option value="0">Quận Huyện</option>
                <option
                  v-for="district in districts"
                  :key="district.id"
                  :value="district.id"
                >
                  {{ district.name }}
                </option>
              </Field>
              <ErrorMessage name="district" class="invalid-feedback" />
            </div>
            <div class="col-sm-3 form-group ms-3">
              <label for="">Xã/Phường</label>
              <Field
                as="select"
                class="form-select"
                :class="{
                  'is-invalid': errors.ward,
                  'is-valid': !errors.ward && selectedWard !== 0,
                }"
                name="ward"
                v-model="selectedWard"
                title="Chọn Phường Xã"
              >
                <option value="0">Phường Xã</option>
                <option v-for="ward in wards" :key="ward.id" :value="ward.id">
                  {{ ward.name }}
                </option>
              </Field>
              <ErrorMessage name="ward" class="invalid-feedback" />
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-3 mt-3 ms-3 pb-3">
          <button type="submit" class="btn btn-primary">Lưu</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { addressSchema } from "@/utils/schema.util";
import ApiUser from "@/service/user/apiUser.service";
import { toast } from "vue3-toastify";
import Cookies from "js-cookie";
import { useRouter, useRoute } from "vue-router";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";

export default {
  components: {
    Field,
    ErrorMessage,
  },
  setup() {
    const provinces = ref([]);
    const districts = ref([]);
    const wards = ref([]);
    const selectedProvince = ref(0);
    const selectedDistrict = ref(0);
    const selectedWard = ref(0);
    let apiUser = new ApiUser();
    const token = Cookies.get("accessToken");
    const router = useRouter();
    const route = useRoute();
    const addressID = route.params.addressID;
    const address = ref({});

    const { errors, validate, resetForm } = useForm({
      validationSchema: addressSchema,
    });

    watch(selectedProvince, async (newValue) => {
      const selectedProvinceObj = provinces.value.find(
        (province) => province.id === newValue.toString()
      );
      address.value.province = {
        name: selectedProvinceObj ? selectedProvinceObj.name : "",
        code: selectedProvinceObj ? parseInt(selectedProvinceObj.id) : "",
      };

      // Gọi fetchDistricts khi province thay đổi
      await fetchDistricts();
    });

    watch(selectedDistrict, async (newValue) => {
      const selectedDistrictObj = districts.value.find(
        (district) => district.id === newValue.toString()
      );
      address.value.district = {
        name: selectedDistrictObj ? selectedDistrictObj.name : "",
        code: selectedDistrictObj ? parseInt(selectedDistrictObj.id) : "",
      };

      // Gọi fetchWards khi district thay đổi
      await fetchWards();
    });

    watch(selectedWard, (newValue) => {
      const selectedWardObj = wards.value.find(
        (ward) => ward.id === newValue.toString()
      );
      address.value.ward = {
        name: selectedWardObj ? selectedWardObj.name : "",
        code: selectedWardObj ? parseInt(selectedWardObj.id) : "",
      };
    });

    const updateAddress = async () => {
      try {
        const { valid } = await validate();
        if (!valid) {
          return;
        }

        const { createdAt, updatedAt, ...addressData } = address.value;
        console.log(addressData);
        const response = await apiUser.put(
          `/addresses/${addressID}`,
          addressData
        );
        if (response.status === 200) {
          showSuccessToast(response?.data?.message);
          router.push({ name: "profile-address-list" });
        }
      } catch (error) {
        console.log(error);
        showErrorToast(error.response?.data?.message);
      }
    };

    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://esgoo.net/api-tinhthanh/1/0.htm"
        );
        if (response.data.error === 0) {
          provinces.value = response.data.data;
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh thành:", error);
      }
    };

    const fetchDistricts = async () => {
      selectedDistrict.value = 0;
      selectedWard.value = 0;
      districts.value = [];
      wards.value = [];

      try {
        const response = await axios.get(
          `https://esgoo.net/api-tinhthanh/2/${selectedProvince.value}.htm`
        );
        if (response.data.error === 0) {
          districts.value = response.data.data;
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quận huyện:", error);
      }
    };

    const fetchWards = async () => {
      selectedWard.value = 0;
      wards.value = [];

      try {
        const response = await axios.get(
          `https://esgoo.net/api-tinhthanh/3/${selectedDistrict.value}.htm`
        );
        if (response.data.error === 0) {
          wards.value = response.data.data;
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phường xã:", error);
      }
    };

    const getAddress = async () => {
      const response = await apiUser.get(`/addresses/${addressID}`);
      if (response.status === 200) {
        address.value = response.data;
        selectedProvince.value = response.data.province.code;
        await fetchDistricts();
        selectedDistrict.value = response.data.district.code;
        await fetchWards();
        selectedWard.value = response.data.ward.code;
      }
    };

    onMounted(async () => {
      await fetchProvinces(); // Tải danh sách tỉnh thành trước
      await getAddress(); // Sau khi có danh sách tỉnh thành, lấy dữ liệu địa chỉ và cập nhật các select tương ứng
    });

    return {
      errors,
      address,
      updateAddress,
      provinces,
      districts,
      wards,
      selectedProvince,
      selectedDistrict,
      selectedWard,
      fetchDistricts,
      fetchWards,
    };
  },
};
</script>

<style></style>
