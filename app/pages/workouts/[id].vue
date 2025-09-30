<template>
  <div v-if="session" class="p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold text-white">{{ session.title }}</h1>
        <p class="mt-2 text-sm text-gray-400">
          Logged on
          <time :datetime="session.date.toISOString()">{{
            formatDate(session.date)
          }}</time>
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="isModalOpen = true"
          type="button"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 sm:w-auto"
        >
          + Add Exercise Log
        </button>
      </div>
    </div>

    <!-- Logged Exercises List -->
    <div class="mt-8 flow-root">
      <div class="text-white">
        <div
          v-if="logs.length === 0"
          class="text-center py-10 border-2 border-dashed border-gray-700 rounded-lg"
        >
          <p class="text-gray-400">No exercises logged for this session yet.</p>
          <p class="text-gray-500 text-sm mt-1">
            Click "+ Add Exercise Log" to get started.
          </p>
        </div>
        <ul v-else role="list" class="divide-y divide-gray-800">
          <li v-for="log in logs" :key="log.id" class="py-5">
            <p class="text-lg font-semibold text-indigo-400">
              {{ log.exerciseName }}
            </p>
            <div class="mt-2">
              <table class="min-w-full divide-y divide-gray-700">
                <thead class="text-left text-sm font-medium text-gray-400">
                  <tr>
                    <th class="py-2 w-1/3">Set</th>
                    <th class="py-2 w-1/3">Reps</th>
                    <th class="py-2 w-1/3">Weight (kg)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-800">
                  <tr v-for="(set, index) in log.sets" :key="index">
                    <td class="py-2">{{ index + 1 }}</td>
                    <td class="py-2">{{ set.reps }}</td>
                    <td class="py-2">{{ set.weight }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Modal for adding an exercise log -->
    <ModalsAddWorkoutLogModal
      :is-open="isModalOpen"
      :session-id="sessionId"
      @close="isModalOpen = false"
      @save="isModalOpen = false"
    />
  </div>
  <div v-else class="p-8 text-center text-gray-400">Loading session...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const route = useRoute();
const sessionId = route.params.id as string;

// State for the single session and its logs
const { session, fetchSessionById } = useWorkoutSessions();
const { logs, fetchLogsForSession } = useWorkoutLogs();

const isModalOpen = ref(false);

// Fetch all necessary data when the page loads
onMounted(async () => {
  await fetchSessionById(sessionId);
  await fetchLogsForSession(sessionId);
});

// Helper function to format dates
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(date);
};
</script>
