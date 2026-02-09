<template>
  <section class="page-container flex flex-col gap-8">
    <div v-if="title || $slots.icon" class="page-header flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <slot
            name="icon"
        />
        <h1
            v-if="title"
            class="text-2xl font-bold text-white"
        >
          {{ title }}
        </h1>
      </div>
      <p
          v-if="description"
          class="text-sm text-gray-400"
      >
        {{ description }}
      </p>
    </div>

    <div
        v-if="$slots.actions"
        class="page-actions"
    >
      <slot name="actions"/>
    </div>

    <div class="page-content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
}

defineProps<Props>();
</script>