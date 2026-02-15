<template>
  <div class="back-link-container -mb-4">
    <NuxtLink
        :to="{ name: routeName }"
        class="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300"
    >
      <IconsActionsBackIcon :size="20" />
      <slot />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  routeName: string;
}>();
</script>