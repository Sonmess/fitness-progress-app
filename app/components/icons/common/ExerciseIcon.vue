<template>
  <IconsBaseIcon
    v-bind="$attrs"
    fill="none"
    stroke="currentColor"
    :stroke-width="2"
  >
    <!-- Dumbbell shape -->
    <path d="M5 12h14" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M4 8v8h2v-8zM18 8v8h2v-8z" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M3 7v10a1 1 0 001 1h1a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1z"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M18 7v10a1 1 0 001 1h1a1 1 0 001-1V7a1 1 0 00-1-1h-1a1 1 0 00-1 1z"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconsBaseIcon>
</template>

<script setup lang="ts">
// Inherit attributes from parent (size, className, etc.)
defineOptions({
  inheritAttrs: false,
});
</script>
