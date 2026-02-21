<template>
  <div class="number-input-group flex flex-1 items-center h-10">
    <label
        :for="identifier"
        class="sr-only"
    >
      {{ label }}
    </label>
    <button
        v-if="showSignButton"
        type="button"
        class="flex flex-shrink-0 text-white text-xl bg-indigo-600 hover:bg-indigo-700  font-medium border-none
           items-center justify-center rounded-l-md cursor-pointer transition-all w-[30px] h-full"
        :class="[isNegative ? 'bg-red-600 hover:bg-red-700' : '']"
        @click="isNegative = !isNegative"
    >
      {{ signButtonText }}
    </button>
    <input
        :value="props.modelValue"
        @input="$emit('update:modelValue', ($event.currentTarget as HTMLInputElement).value)"
        type="number"
        step="any"
        :id="identifier"
        :placeholder="placeholder"
        class="block p-2 w-full bg-gray-800 border-gray-700 text-white rounded-r-md shadow-sm sm:text-sm"
    />
  </div>
</template>

<script setup lang="ts">
const isNegative = ref(false);

const signButtonText = computed(() => {
  return isNegative.value ? '-' : '+';
});

const props = defineProps<{
  identifier: string;
  label: string;
  placeholder?: string;
  modelValue: number;
  showSignButton?: boolean;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>