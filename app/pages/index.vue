<template>
  <div>
    <!-- Parallax Hero Section -->
    <header
      class="parallax-bg flex items-center justify-center h-screen bg-fixed bg-center bg-cover"
    >
      <div class="text-center text-white p-4 bg-black bg-opacity-50 rounded-lg">
        <h1
          class="text-5xl md:text-7xl font-extrabold uppercase tracking-wider drop-shadow-lg"
        >
          Forge Your Strength
        </h1>
        <p class="mt-4 text-lg md:text-2xl font-light drop-shadow-lg">
          Track Your Ascent. Define Your Limits.
        </p>
      </div>
    </header>

    <!-- Main Content Section -->
    <main class="bg-gray-900 py-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Your All-In-One Fitness Companion
        </h2>
        <p class="text-gray-400 text-lg mb-12">
          Stop guessing, start progressing. GymTrack Pro gives you the tools you
          need to build workouts, track every lift, and shatter your personal
          records.
        </p>

        <!-- Feature Cards -->
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Card 1: Log Workouts -->
          <div
            class="bg-gray-800 p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300"
          >
            <h3 class="text-xl font-bold text-cyan-400 mb-2">Log Workouts</h3>
            <p class="text-gray-300">
              Easily record your exercises, sets, weights, and reps during your
              gym sessions.
            </p>
          </div>
          <!-- Card 2: Track Progress -->
          <div
            class="bg-gray-800 p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300"
          >
            <h3 class="text-xl font-bold text-cyan-400 mb-2">Track Progress</h3>
            <p class="text-gray-300">
              Visualize your gains over time with charts and personal record
              tracking.
            </p>
          </div>
          <!-- Card 3: Build Routines -->
          <div
            class="bg-gray-800 p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300"
          >
            <h3 class="text-xl font-bold text-cyan-400 mb-2">Build Routines</h3>
            <p class="text-gray-300">
              Create and save your favorite workout routines for quick access.
            </p>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-gray-800 text-center py-4">
      <p class="text-gray-500">GymTrack Pro &copy; 2025</p>
      <span @click="logout">Logout</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "#imports";

// No script logic needed for this static page yet
const config = useRuntimeConfig();
const { logout } = useAuth();
</script>

<style scoped>
/*
  The magic for the parallax effect happens here.
  - We set a background image on our header.
  - `background-attachment: fixed;` tells the browser to keep the background image in the same place
    relative to the viewport, even as the content scrolls.
  - The other properties ensure the image covers the entire area nicely.
*/
.parallax-bg {
  background-image: url("https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2575&auto=format&fit=crop");
}
</style>
