<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
    <TransitionGroup name="toast">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg text-sm text-white',
          notification.type === 'error'   ? 'bg-red-700'   : '',
          notification.type === 'success' ? 'bg-green-700' : '',
          notification.type === 'info'    ? 'bg-gray-700'  : '',
        ]"
      >
        <!-- Icon -->
        <span class="mt-0.5 shrink-0">
          <svg v-if="notification.type === 'error'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="notification.type === 'success'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>

        <!-- Message -->
        <span class="flex-1">{{ notification.message }}</span>

        <!-- Dismiss button -->
        <button @click="dismiss(notification.id)" class="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const { notifications, dismiss } = useNotification()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>
