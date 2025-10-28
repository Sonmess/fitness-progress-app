<template>
  <div class="container mx-auto p-4 pt-6 md:p-6 lg:px-8 xl:p-12">
    <h1 class="text-3xl font-bold mb-4">About Me</h1>
    <p class="mb-4 text-lg leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.</p>
    <div class="flex flex-wrap justify-center">
      <a href="https://www.facebook.com/yourfacebookprofile" target="_blank" rel="noopener noreferrer" class="mr-4 mb-4 inline-block p-2 bg-orange-500 hover:bg-orange-700 text-white rounded-full shadow-lg">Facebook</a>
      <a href="https://www.instagram.com/yourinstagramprofile" target="_blank" rel="noopener noreferrer" class="mr-4 mb-4 inline-block p-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-full shadow-lg">Instagram</a>
      <a href="https://github.com/yourgithubprofile" target="_blank" rel="noopener noreferrer" class="mb-4 inline-block p-2 bg-purple-500 hover:bg-purple-700 text-white rounded-full shadow-lg">GitHub</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const name = ref('John Doe')
const occupation = ref('Software Developer')

console.log(name.value)
console.log(occupation.value)


</script>

<style scoped>
/* add your custom styles here */
</style>