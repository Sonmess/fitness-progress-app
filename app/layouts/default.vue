<template>
  <!-- Main app container with a dark theme -->
  <div class="flex flex-col bg-gray-900 text-white min-h-screen">
    <CommonBaseHeader />

    <main class="container flex-grow mx-auto p-4 md:p-6">
      <NuxtPage />
    </main>

    <CommonBaseFooter />
  </div>
</template>

<script setup lang="ts">
</script>

<style>
/* Global styles can be defined here. For example, a smooth scroll behavior. */
html {
  scroll-behavior: smooth;
}

/* Slide from right */
.page-enter-active {
  transition: all 0.3s ease-out;
}

.page-leave-active {
  transition: all 0.2s ease-in;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
