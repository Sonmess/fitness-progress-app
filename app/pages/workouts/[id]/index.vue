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
        <p v-if="session.bodyPartNames" class="mt-1 text-xs text-gray-500">
          Targeting: {{ session.bodyPartNames.join(", ") }}
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <!-- CHANGED: This is now a NuxtLink to our new page -->
        <NuxtLink
          :to="{ name: 'workouts-id-add', params: { id: sessionId } }"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          + Add Exercise Log
        </NuxtLink>
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
            <div class="flex items-center justify-between">
              <p class="text-lg font-semibold text-indigo-400">
                {{ log.exerciseName }}
              </p>
              <div class="space-x-4">
                <button
                  @click="openEditLogModal(log)"
                  class="text-sm font-medium text-yellow-400 hover:text-yellow-300"
                >
                  Edit
                </button>
                <button
                  @click="handleDeleteLog(log.id)"
                  class="text-sm font-medium text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
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

    <!-- REMOVED: The AddWorkoutLogModal is no longer needed here -->

    <!-- Modal for editing an exercise log -->
    <ModalsEditWorkoutLogModal
      :is-open="isEditLogModalOpen"
      :log="logToEdit"
      @close="closeEditLogModal"
      @save="handleUpdateLog"
    />
  </div>
  <div v-else class="p-8 text-center text-gray-400">Loading session...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { WorkoutLog, Set } from "~/types";

const route = useRoute();
const sessionId = route.params.id as string;

// State and functions from composables
const { session, fetchSessionById } = useWorkoutSessions();
const { logs, fetchLogsForSession, updateWorkoutLog, deleteWorkoutLog } =
  useWorkoutLogs();

// Modal state
// REMOVED: isAddLogModalOpen is no longer needed
const isEditLogModalOpen = ref(false);
const logToEdit = ref<WorkoutLog | null>(null);

onMounted(async () => {
  await fetchSessionById(sessionId);
  await fetchLogsForSession(sessionId);
});

// --- CRUD Handlers for Logs ---
const openEditLogModal = (log: WorkoutLog) => {
  logToEdit.value = log;
  isEditLogModalOpen.value = true;
};

const closeEditLogModal = () => {
  isEditLogModalOpen.value = false;
  logToEdit.value = null;
};

const handleUpdateLog = async (updatedSets: Set[]) => {
  if (!logToEdit.value) return;
  await updateWorkoutLog(logToEdit.value.id, updatedSets);
  closeEditLogModal();
};

const handleDeleteLog = async (logId: string) => {
  const confirmed = window.confirm("Are you sure you want to delete this log?");
  if (confirmed) {
    await deleteWorkoutLog(logId);
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(date);
};
</script>
