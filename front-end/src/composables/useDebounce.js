// composables/useDebounce.js
import { ref, watch } from 'vue';
import debounce from 'lodash.debounce';

export function useDebounce(value, delay) {
  const debouncedValue = ref(value.value);

  const updateDebouncedValue = debounce(() => {
    debouncedValue.value = value.value;
  }, delay);

  watch(value, () => {
    updateDebouncedValue();
  });

  return debouncedValue;
}
