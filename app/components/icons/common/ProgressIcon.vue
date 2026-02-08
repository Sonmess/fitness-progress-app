<template>
  <IconsBaseIcon
      v-bind="$attrs"
      fill="none"
      stroke="currentColor"
      :stroke-width="2"
  >
    <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </IconsBaseIcon>
</template>

<script setup lang="ts">
// Inherit attributes from parent (size, className, etc.)
defineOptions({
  inheritAttrs: false,
});
</script>
