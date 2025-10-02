import { ref } from "vue";

/**
 * A composable to provide a globally accessible, consistent list of equipment options.
 */
export const useEquipment = () => {
  // We define the list of equipment here. This is the single source of truth.
  const equipmentOptions = ref<string[]>([
    "Jednoručky",
    "Tyčka",
    "Multipress",
    "Kladka",
    "Kettlebell",
    "Stroj",
  ]);

  const getOptions = computed(() => {
    return equipmentOptions.value.sort((a, b) => a.localeCompare(b));
  });

  return {
    getEquipmentptions: getOptions,
  };
};
