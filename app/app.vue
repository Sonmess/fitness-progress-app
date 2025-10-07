<template>
  <div>
    <client-only>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>

      <!-- We can provide a fallback to show while the client-side is loading -->
      <template #fallback>
        <div class="flex h-screen items-center justify-center bg-gray-900">
          <p class="text-white">Loading Application...</p>
        </div>
      </template>
    </client-only>
  </div>
</template>

<script setup lang="ts"></script>
