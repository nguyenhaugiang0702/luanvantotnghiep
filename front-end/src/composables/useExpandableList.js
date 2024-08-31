import { ref, computed } from "vue";

export function useExpandableList(items, limit = 8) {
  const showMore = ref(false);

  const visibleItems = computed(() => {
    return showMore.value ? items.value : items.value.slice(0, limit);
  });

  const toggleItems = () => {
    showMore.value = !showMore.value;
  };

  return {
    visibleItems,
    showMore,
    toggleItems,
  };
}
