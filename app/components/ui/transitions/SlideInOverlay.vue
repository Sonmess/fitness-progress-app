<template>
  <!-- The transition is now part of this component -->
  <Transition name="slide-left">
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="absolute inset-0 w-full h-full bg-gray-700 z-10 cursor-pointer flex items-center justify-center text-gray-500"
    >
      <!-- The slot allows the parent to inject any content -->
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: "close"): void;
}>();
</script>

<style scoped>
/*
  The transition styles are also encapsulated here.
*/
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>
