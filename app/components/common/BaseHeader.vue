<template>
  <!-- Header -->
  <header class="bg-gray-800 shadow-md sticky top-0 z-20">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <NuxtLink to="/" class="text-xl font-bold text-indigo-400">{{
            appConfig.title
          }}</NuxtLink>
        </div>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <NuxtLink
              to="/exercises"
              class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >Exercises</NuxtLink
            >
            <NuxtLink
              to="/workouts"
              class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >Workouts</NuxtLink
            >
            <NuxtLink
              to="/progress"
              class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >Progress</NuxtLink
            >
            <button
              @click="logout"
              class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="-mr-2 flex md:hidden">
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            type="button"
            class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <!-- Heroicon name: outline/menu -->
            <svg
              v-if="!isMobileMenuOpen"
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!-- Heroicon name: outline/x -->
            <svg
              v-else
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div v-if="isMobileMenuOpen" class="md:hidden" id="mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <NuxtLink
          to="/exercises"
          @click="isMobileMenuOpen = false"
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >Exercises</NuxtLink
        >
        <NuxtLink
          to="/workouts"
          @click="isMobileMenuOpen = false"
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >Workouts</NuxtLink
        >
        <NuxtLink
          to="/progress"
          @click="isMobileMenuOpen = false"
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >Progress</NuxtLink
        >
        <button
          v-if="isAuthenticated"
          @click="handleLogout"
          class="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isMobileMenuOpen = ref(false);
const { logout, isAuthenticated } = useAuth();
const appConfig = useAppConfig();

const handleLogout = () => {
  isMobileMenuOpen.value = false;
  logout();
};
</script>
