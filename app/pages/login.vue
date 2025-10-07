<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md space-y-8">
      <div>
        <h1 class="text-center text-4xl font-bold tracking-tight text-white">
          GymTrack Pro
        </h1>
        <h2
          class="mt-6 text-center text-2xl font-bold tracking-tight text-indigo-400"
        >
          Sign in to your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4 rounded-md shadow-sm">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              v-model="email"
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full appearance-none rounded-md border border-gray-700 bg-gray-800 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full appearance-none rounded-md border border-gray-700 bg-gray-800 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <p v-if="errorMessage" class="text-center text-sm text-red-400">
          {{ errorMessage }}
        </p>

        <div>
          <button
            type="submit"
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth();
const email = ref("");
const password = ref("");
const errorMessage = ref<string | null>(null);
const router = useRouter();
const route = useRoute();

const handleLogin = async () => {
  errorMessage.value = null;
  const { error } = await login(email.value, password.value);
  if (error) {
    // A simple way to provide more user-friendly error messages
    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        errorMessage.value = "Invalid email or password.";
        break;
      case "auth/invalid-email":
        errorMessage.value = "Please enter a valid email address.";
        break;
      default:
        errorMessage.value = "An unexpected error occurred. Please try again.";
        break;
    }
  } else {
    // On success, the watcher in app.vue will handle the redirect.
    const redirectPath = route.query.redirect as string | undefined;
    if (redirectPath) {
      router.push(redirectPath);
    }
    router.push({ name: "index" });
  }
};
</script>
