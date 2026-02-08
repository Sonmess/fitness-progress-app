<template>
  <footer class="bg-gray-800 border-t border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Main Footer Content -->
      <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
        <!-- Left Section: App Info -->
        <div class="flex flex-col gap-3">
          <h3 class="text-xl font-bold text-indigo-400">{{ appConfig.meta.headline }}</h3>
          <p class="text-gray-400 text-sm max-w-xs">
            {{ appConfig.meta.perex }}
          </p>
        </div>

        <!-- Middle Section: Quick Links -->
        <div class="flex flex-col gap-3">
          <h4 class="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Quick Links
          </h4>
          <nav class="flex flex-col gap-2">
            <NuxtLink
                v-for="item in NAV_ITEMS"
                :key="item.routeName"
                :to="{ name: item.routeName }"
                class="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
            >
              {{ item.name }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Right Section: Connect -->
        <div class="flex flex-col gap-3">
          <h4 class="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Connect
          </h4>
          <div class="flex flex-col gap-2">
            <!-- GitHub Link -->
            <a
                :href="appConfig.author.repo"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 text-gray-400 hover:text-indigo-400 text-sm transition-colors"
            >
              <IconsSocialGitHubIcon
                  :size="20"
                  class="text-indigo-400"
              />
              <span>View on GitHub</span>
            </a>

            <a
                :href="'mailto:' + appConfig.author.email"
                title="Message me"
                class="flex items-center gap-2 text-gray-400 hover:text-indigo-400 text-sm transition-colors"
            >
              <IconsSocialMailIcon
                  :size="20"
                  :stroke-width="1.5"
                  class="text-indigo-400"
              />
              <span>Message me</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Section: Copyright -->
      <div class="mt-8 pt-6 border-t border-gray-700">
        <div class="flex flex-col text-center md:flex-row md:justify-between md:items-center gap-4 text-sm text-gray-400">
          <p>
            &copy; {{ currentYear }} {{ appConfig.meta.headline }} | Built by
            <span class="text-indigo-400 font-medium">{{ appConfig.author.name }}</span>.
          </p>
          <p class="text-xs">
            Made with ❤️ using Nuxt.js & Firebase
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {NAV_ITEMS} from '~/constants/routes';

const appConfig = useAppConfig();
const currentYear = new Date().getFullYear();
</script>
