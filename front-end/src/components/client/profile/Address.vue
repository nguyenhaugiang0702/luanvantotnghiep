<template>
  <div class="css_select_div">
    <select
      class="css_select"
      v-model="selectedProvince"
      @change="fetchDistricts"
      title="Chọn Tỉnh Thành"
    >
      <option value="0">Tỉnh Thành</option>
      <option
        v-for="province in provinces"
        :key="province.id"
        :value="province.id"
      >
        {{ province.full_name }}
      </option>
    </select>

    <select
      class="css_select"
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
    </select>

    <select class="css_select" v-model="selectedWard" title="Chọn Phường Xã">
      <option value="0">Phường Xã</option>
      <option v-for="ward in wards" :key="ward.id" :value="ward.id">
        {{ ward.full_name }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const provinces = ref([]);
    const districts = ref([]);
    const wards = ref([]);
    const selectedProvince = ref("0");
    const selectedDistrict = ref("0");
    const selectedWard = ref("0");

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
      selectedDistrict.value = "0";
      selectedWard.value = "0";
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
      selectedWard.value = "0";
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

    onMounted(fetchProvinces);

    return {
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

<style>
.css_select_div {
  text-align: center;
}
.css_select {
  display: inline-table;
  width: 25%;
  padding: 5px;
  margin: 5px 2%;
  border: solid 1px #686868;
  border-radius: 5px;
}
</style>
