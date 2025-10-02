<template>
  <footer class="bg-gray-800 text-center py-4 mb-4">
    <p class="text-gray-500">GymTrack Pro &copy; 2025</p>
    <div v-if="isAuthenticated">
      <span>Welcome {{ userNickname }}</span>
      <br />
      <span @click="logout">Logout</span>
    </div>
    <div v-else>Prihlaste sa hergot</div>
  </footer>
</template>

<script setup>
const { logout, isAuthenticated, userNickname } = useAuth();
</script>
