<template>
  <IconsBaseIcon
      v-bind="$attrs"
      fill="none"
      stroke="currentColor"
      :stroke-width="2"
  >
    <path d="M19 12H5M5 12l7 7M5 12l7-7" />
  </IconsBaseIcon>
</template>

<script setup lang="ts">
// Inherit attributes from parent (size, className, etc.)
defineOptions({
  inheritAttrs: false,
});
</script>