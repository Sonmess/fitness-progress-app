<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <!-- Back Button -->
    <div class="mb-4">
      <NuxtLink
        :to="{ name: 'workouts-id', params: { id: sessionId } }"
        class="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Back to Session
      </NuxtLink>
    </div>

    <!-- Header -->
    <div class="border-b border-gray-700 pb-5">
      <h1 class="text-2xl font-bold text-white">Select an Exercise</h1>
      <p v-if="session" class="mt-1 text-sm text-gray-400">
        Showing exercises for:
        <span class="font-medium text-gray-300">{{
          session.bodyPartNames.join(", ")
        }}</span>
      </p>
    </div>

    <!-- Filtered Exercise Card List -->
    <div class="mt-8">
      <div v-if="isLoading" class="text-center text-gray-400">
        Loading exercises...
      </div>
      <div
        v-else-if="filteredExercises.length === 0"
        class="text-center text-gray-500"
      >
        No exercises found for the selected body parts.
      </div>
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- 
          The whole card is a link that navigates to the logging page.
          We use the reusable ExerciseCard component here.
        -->
        <NuxtLink
          v-for="exercise in filteredExercises"
          :key="exercise.id"
          :to="{
            name: 'workouts-id-log-exerciseId',
            params: { id: sessionId, exerciseId: exercise.id },
          }"
          class="block rounded-lg bg-gray-800 shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-indigo-500/20"
        >
          <!-- Note: We pass `showDetailButton: false` to the card -->
          <ExercisesExerciseCard
            :exercise="exercise"
            :show-detail-button="false"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const route = useRoute();
const sessionId = route.params.id as string;

const { session, fetchSessionById } = useWorkoutSessions();
const { exercises, fetchExercises } = useExercises();

const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  // We need to fetch both the session (to get its body parts)
  // and all exercises (to filter them)
  await Promise.all([fetchSessionById(sessionId), fetchExercises()]);
  isLoading.value = false;
});

// This computed property is the core logic of the page.
// It filters the main exercise list based on the session's body parts.
const filteredExercises = computed(() => {
  if (!session.value || exercises.value.length === 0) {
    return [];
  }

  // Get the array of body part IDs from the current session
  const bodyPartIds = session.value.bodyPartIds || [];

  // Filter the global exercise list
  return exercises.value
    .filter((ex) => bodyPartIds.includes(ex.bodyPartId))
    .sort((a, b) => a.name.localeCompare(b.name));
});
</script>
