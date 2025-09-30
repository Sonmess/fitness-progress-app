<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth();
const router = useRouter();

// This watcher acts as a global route guard.
watch(user, (currentUser) => {
  const isLoginPage = router.currentRoute.value.path === "/login";

  // If the user is not logged in and not on the login page, redirect them.
  if (!currentUser && !isLoginPage) {
    router.push("/login");
  }

  // If the user IS logged in and on the login page, redirect them to the homepage.
  if (currentUser && isLoginPage) {
    router.push("/");
  }
});
</script>
