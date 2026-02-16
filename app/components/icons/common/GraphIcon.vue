<template>
  <IconsBaseIcon
    v-bind="$attrs"
    fill="none"
    stroke="currentColor"
    :stroke-width="2"
  >
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </IconsBaseIcon>
</template>

<script setup lang="ts">
// Inherit attributes from parent (size, className, etc.)
defineOptions({
  inheritAttrs: false,
});
</script>
