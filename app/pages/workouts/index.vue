<template>
  <div>
    <!-- Header -->
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-white">My Workout Sessions</h1>
          <p class="mt-2 text-sm text-gray-400">
            A list of all your past workout sessions.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            @click="isModalOpen = true"
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 sm:w-auto"
          >
            + Start New Session
          </button>
        </div>
      </div>

      <!-- List of Sessions -->
      <div class="mt-8 flow-root">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
          >
            <ul
              v-if="sessions.length > 0"
              role="list"
              class="divide-y divide-gray-800"
            >
              <li
                v-for="session in sessions"
                :key="session.id"
                class="flex items-center justify-between gap-x-6 py-5"
              >
                <div class="min-w-0">
                  <div class="flex items-start gap-x-3">
                    <p class="text-base font-semibold leading-6 text-white">
                      {{ session.title }}
                    </p>
                  </div>
                  <div
                    class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-400"
                  >
                    <p class="whitespace-nowrap">
                      <time :datetime="session.date.toISOString()">{{
                        formatDate(session.date)
                      }}</time>
                    </p>
                  </div>
                </div>
                <div class="flex flex-none items-center gap-x-4">
                  <NuxtLink
                    :to="`/workouts/${session.id}`"
                    class="rounded-md bg-gray-700/50 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    View Session
                    <span class="sr-only">, {{ session.title }}</span>
                  </NuxtLink>
                </div>
              </li>
            </ul>
            <div v-else class="text-center py-10">
              <p class="text-gray-400">
                No workout sessions found. Start one to get going!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- The Add Workout Session Modal -->
    <ModalsAddWorkoutSessionModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @save="handleStartNewSession"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { WorkoutSession } from "~/types";

const { sessions, fetchWorkoutSessions, addWorkoutSession } =
  useWorkoutSessions();
const isModalOpen = ref(false);
const router = useRouter();

// Fetch sessions when the page loads
onMounted(fetchWorkoutSessions);

const handleStartNewSession = async (sessionData: {
  title: string;
  notes?: string;
}) => {
  const newSession = await addWorkoutSession(sessionData);
  isModalOpen.value = false;

  if (newSession) {
    // After creating the session, navigate to the detail page for that session
    router.push(`/workouts/${newSession.id}`);
  }
};

// Helper function to format dates nicely
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
};
</script>
