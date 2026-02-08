<template>
  <div
      class="flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md space-y-8">
      <div>
        <h1 class="text-center text-4xl font-bold tracking-tight text-white">
          {{ appConfig.meta.headline }}
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
                :disabled="isLoading"
                class="relative block w-full appearance-none rounded-md border border-gray-700 bg-gray-800 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                :disabled="isLoading"
                class="relative block w-full appearance-none rounded-md border border-gray-700 bg-gray-800 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
              :disabled="isLoading"
              class="group relative flex gap-2 w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">
              <IconsCommonSpinnerIcon
                  :size="20"
                  class="animate-spin text-white"
              />
            </span>
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ROUTE_NAMES} from '~/constants/routes';

const appConfig = useAppConfig();
const {login} = useAuth();
const email = ref('');
const password = ref('');
const errorMessage = ref<string | null>(null);
const isLoading = ref(false);
const router = useRouter();
const route = useRoute();

/**
 * Maps Firebase error codes to user-friendly messages
 */
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

const handleLogin = async () => {
  // Reset error and start loading
  errorMessage.value = null;
  isLoading.value = true;

  try {
    const {error} = await login(email.value, password.value);

    if (error) {
      errorMessage.value = getErrorMessage(error.code);
    } else {
      // Login successful - redirect to intended page or home
      const redirectPath = route.query.redirect as string | undefined;
      if (redirectPath) {
        await router.push(redirectPath);
      } else {
        await router.push({name: ROUTE_NAMES.HOME});
      }
    }
  } catch (err) {
    // Catch any unexpected errors
    console.error('Login error:', err);
    errorMessage.value = 'An unexpected error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>
