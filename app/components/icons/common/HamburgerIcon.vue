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
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
    />
  </IconsBaseIcon>
</template>

<script setup lang="ts">
// Inherit attributes from parent (size, className, etc.)
defineOptions({
  inheritAttrs: false,
});
</script>