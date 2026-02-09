<template>
  <CommonBasePage title="About Me" description="Learn more about me" class="items-center">
    <template #icon>
      <IconsSocialUserIcon :size="32" />
    </template>
    <p class="mb-4 text-lg leading-relaxed">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet
      nulla auctor, vestibulum magna sed, convallis ex.
    </p>
    <div class="flex flex-wrap justify-center">
      <a
          href="https://www.facebook.com/yourfacebookprofile"
          target="_blank"
          rel="noopener noreferrer"
          class="mr-4 mb-4 inline-block p-2 bg-orange-500 hover:bg-orange-700 text-white rounded-full shadow-lg">
        Facebook
      </a>
      <a
          href="https://www.instagram.com/yourinstagramprofile"
          target="_blank"
          rel="noopener noreferrer"
          class="mr-4 mb-4 inline-block p-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-full shadow-lg">
        Instagram
      </a>
      <a
          href="https://github.com/yourgithubprofile"
          target="_blank"
          rel="noopener noreferrer"
          class="mb-4 inline-block p-2 bg-purple-500 hover:bg-purple-700 text-white rounded-full shadow-lg">
        GitHub
      </a>
    </div>
  </CommonBasePage>
</template>

<script setup lang="ts">
</script>