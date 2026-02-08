<template>
  <!-- Main app container with a dark theme -->
  <div class="bg-gray-900 text-white min-h-screen">
    <common-base-header />

    <main class="container mx-auto p-4 md:p-6">
      <slot />
    </main>

    <common-base-footer />
  </div>
</template>

<script setup lang="ts">
</script>

<style>
/* Global styles can be defined here. For example, a smooth scroll behavior. */
html {
  scroll-behavior: smooth;
}
</style>
