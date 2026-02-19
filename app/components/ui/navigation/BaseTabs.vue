<template>
  <div class="base-tabs-container">
    <nav class="flex justify-center items-center border-b border-gray-700">
      <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="$emit('update:modelValue', tab.value)"
          :class="[
            'flex flex-grow gap-2 justify-center items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            modelValue === tab.value
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
          ]"
      >
        <component
            :is="tab.icon"
            v-if="tab.icon"
        />
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

interface Tab {
  label: string;
  value: string;
  icon?: Component;
}

defineProps<{
  tabs: Tab[];
  modelValue: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>