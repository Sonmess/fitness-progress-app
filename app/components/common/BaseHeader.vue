<template>
  <header class="bg-gray-800 sticky top-0 z-20">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <NuxtLink
              :to="{ name: ROUTE_NAMES.HOME }"
              class="text-xl font-bold text-indigo-400"
          >{{ headerTitle }}
          </NuxtLink>
        </div>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <NuxtLink
                v-for="item in NAV_ITEMS"
                :key="item.routeName"
                :to="{ name: item.routeName }"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >{{ item.name }}
            </NuxtLink
            >
            <button
                v-if="user"
                @click="logout"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        <!-- Mobile Menu Button (Hamburger) -->
        <div class="-mr-2 flex md:hidden">
          <button
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              type="button"
              class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <IconsCommonHamburgerIcon
                v-if="!isMobileMenuOpen"
                :size="24"
                :stroke-width="2"
                class="text-indigo-400"
            />
            <IconsActionsCloseIcon
                v-else
                :size="24"
                class="text-indigo-400"
            />
          </button>
        </div>
      </div>
    </nav>

    <CommonHeaderMobileNavBar/>

    <!-- 
      UPDATED: Mobile hamburger menu
      (Now only contains the Logout button) 
    -->
    <div v-if="isMobileMenuOpen" class="md:hidden" id="mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <button
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
import {ref, computed} from 'vue';
import {ROUTE_NAMES, NAV_ITEMS} from '~/constants/routes';

const isMobileMenuOpen = ref(false);
const {logout, user} = useAuth();
const appConfig = useAppConfig();

const headerTitle = computed(() => {
  return appConfig.meta.headline ?? '';
});

const handleLogout = () => {
  isMobileMenuOpen.value = false;
  logout();
};
</script>
