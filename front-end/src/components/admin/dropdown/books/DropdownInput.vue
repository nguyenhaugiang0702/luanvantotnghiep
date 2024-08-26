<template>
  <label class="form-label">{{ label }}</label>
  <input
    class="form-control dropdown-toggle"
    type="text"
    v-model="searchValue"
    :class="{
      'is-invalid': error,
      'is-valid': !error && searchValue !== '',
    }"
    @focus="showDropdown = true"
    @input="onInput"
    :placeholder="placeholder"
  />
  <ul
    v-if="showDropdown && filteredOptions.length > 0"
    class="dropdown-menu d-block"
    style="max-height: 200px; overflow: auto"
  >
    <li
      style="max-width: 300px"
      class="dropdown-item"
      v-for="option in filteredOptions"
      :key="option._id"
      @click="selectItem(option)"
    >
      {{ option.name }}
    </li>
  </ul>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import useDropdown from "@/composables/useDropdown";

export default {
  props: {
    // modelValue: {
    //   type: String,
    //   default: "",
    // },
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      default: () => [],
    },
    error: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    entityType: {
      type: String,
    },
  },
  emits: ["update:modelValue", "select"],
  setup(props, { emit }) {
    // const localModelValue = ref(props.modelValue);
    const showDropdown = ref(false);
    const { searchValue, filteredOptions, selectItem } = useDropdown(
      props.entityType
    );
    // Theo dõi sự thay đổi từ prop modelValue để cập nhật localModelValue
    watch(
      () => searchValue.value,
      (newValue) => {
        searchValue.value = newValue;
        emit("update:modelValue", searchValue.value);
      }
    );

    // Xử lý khi người dùng nhập vào input
    const onInput = () => {
      showDropdown.value = true;
      emit("update:modelValue", searchValue.value);
    };

    // Hàm kiểm tra khi người dùng click ra ngoài dropdown
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".dropdown-menu") &&
        !event.target.closest(".form-control")
      ) {
        showDropdown.value = false;
      }
    };

    // Đăng ký và hủy đăng ký sự kiện click ngoài
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      //   localModelValue,
      searchValue,
      showDropdown,
      filteredOptions,
      onInput,
      selectItem,
      handleClickOutside,
    };
  },
};
</script>
