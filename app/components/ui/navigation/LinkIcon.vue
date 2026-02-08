<template>
  <NuxtLink
    :to="to"
    class="flex flex-col gap-1 items-center justify-center text-gray-300 hover:text-indigo-400 px-2 py-1 text-xs font-medium"
    active-class="text-indigo-400"
  >
    <slot name="icon" />
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { NuxtLinkProps } from '#app';

defineProps<{
  to: NuxtLinkProps['to'];
}>();
</script>
