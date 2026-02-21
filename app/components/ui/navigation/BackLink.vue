<template>
  <div class="back-link-container -mb-4">
    <NuxtLink
        v-if="routeName"
        :to="{ name: routeName }"
        class="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300"
    >
      <IconsActionsBackIcon :size="20"/>
      <slot/>
    </NuxtLink>
    <NuxtLink
        v-if="route"
        :to="route"
        class="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300"
    >
      <IconsActionsBackIcon :size="20"/>
      <slot/>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type {RouteLocationAsRelativeGeneric} from "vue-router";

defineProps<{
  routeName?: string;
  route?: RouteLocationAsRelativeGeneric
}>();
</script>