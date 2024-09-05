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
                  {{ province.full_name }}
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
                  {{ district.full_name }}
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
                  {{ ward.full_name }}
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
import axios from "axios";
import AddressService from "@/service/address.service";
import { toast } from "vue3-toastify";
import Cookies from "js-cookie";
import { useRouter, useRoute } from "vue-router";

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
    const addressService = new AddressService();
    const token = Cookies.get("accessToken");
    const router = useRouter();
    const route = useRoute();
    const addressID = route.params.addressID;
    const address = ref({});
    const newAddress = ref({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      detailAddress: "",
      province: "",
      district: "",
      ward: "",
    });

    const { errors, validate, resetForm } = useForm({
      validationSchema: addressSchema,
    });

    watch(selectedProvince, (newValue) => {
      const selectedProvinceObj = provinces.value.find(
        (province) => province.id === newValue
      );
      selectedDistrict.value = 0;
      selectedWard.value = 0;
      address.value.province = selectedProvinceObj
        ? selectedProvinceObj.full_name
        : "";
    });
    watch(selectedDistrict, (newValue) => {
      const selectedDistrictObj = districts.value.find(
        (district) => district.id === newValue
      );
      selectedWard.value = 0;
      address.value.district = selectedDistrictObj
        ? selectedDistrictObj.full_name
        : "";
    });
    watch(selectedWard, (newValue) => {
      const selectedWardObj = wards.value.find((ward) => ward.id === newValue);
      address.value.ward = selectedWardObj ? selectedWardObj.full_name : "";
    });

    const updateAddress = async () => {
      const { valid } = await validate();
      if (!valid) {
        return;
      }
      const { createdAt, updatedAt, ...addressData } = address.value;
      const response = await addressService.put(
        `/${addressID}`,
        addressData,
        token
      );
      if (response.status === 200) {
        toast(response.data.message, {
          theme: "auto",
          type: "success",
          dangerouslyHTMLString: true,
        });
        router.push({ name: "profile-address-list" });
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
      const response = await addressService.get(`/${addressID}`, token);
      if (response.status === 200) {
        address.value = response.data;
        // Set giá trị của selectedProvince dựa trên tên tỉnh
        const selectedProvinceObj = provinces.value.find(
          (province) => province.full_name === address.value.province
        );
        if (selectedProvinceObj) {
          selectedProvince.value = selectedProvinceObj.id;

          // Fetch districts based on selected province
          await fetchDistricts();

          // Set giá trị của selectedDistrict dựa trên tên quận/huyện
          const selectedDistrictObj = districts.value.find(
            (district) => district.full_name === address.value.district
          );
          if (selectedDistrictObj) {
            selectedDistrict.value = selectedDistrictObj.id;

            // Fetch wards based on selected district
            await fetchWards();

            // Set giá trị của selectedWard dựa trên tên xã/phường
            const selectedWardObj = wards.value.find(
              (ward) => ward.full_name === address.value.ward
            );
            if (selectedWardObj) {
              selectedWard.value = selectedWardObj.id;
            }
          }
        }
      }
    };

    onMounted(async () => {
      await fetchProvinces(); // Tải danh sách tỉnh thành trước
      await getAddress(); // Sau khi có danh sách tỉnh thành, lấy dữ liệu địa chỉ và cập nhật các select tương ứng
    });

    return {
      errors,
      address,
      newAddress,
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
