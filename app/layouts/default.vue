<template>
  <!-- Main app container with a dark theme -->
  <div class="bg-gray-900 text-white min-h-screen">
    <!-- Header Section -->
    <common-base-header />

    <!-- Main Content Area -->
    <main class="container mx-auto p-4 md:p-6">
      <!-- The <slot /> component renders the current page's content here -->
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();
</script>

<style>
/* Global styles can be defined here. For example, a smooth scroll behavior. */
html {
  scroll-behavior: smooth;
}
</style>
