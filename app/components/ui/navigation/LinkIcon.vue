<template>
  <NuxtLink
    :to="to"
    class="flex flex-col items-center justify-center text-gray-300 hover:text-white px-2 py-1 text-xs font-medium"
    active-class="text-indigo-400"
  >
    <div class="h-4 w-4 mb-1">
      <slot name="icon" />
    </div>
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { NuxtLinkProps } from '#app';

defineProps<{
  to: NuxtLinkProps['to'];
}>();
</script>
