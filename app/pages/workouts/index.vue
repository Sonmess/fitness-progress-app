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
            @click="isAddModalOpen = true"
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
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
                <!-- Action Buttons -->
                <div class="flex flex-none items-center gap-x-4">
                  <NuxtLink
                    :to="{ name: 'workouts-id', params: { id: session.id } }"
                    class="rounded-md bg-gray-700/50 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600/50"
                    >View</NuxtLink
                  >
                  <button
                    @click="openEditModal(session)"
                    class="rounded-md bg-yellow-600/50 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500/50"
                  >
                    Edit
                  </button>
                  <button
                    @click="handleDelete(session.id)"
                    class="rounded-md bg-red-800/50 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700/50"
                  >
                    Delete
                  </button>
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

    <!-- Modals -->
    <ModalsAddWorkoutSessionModal
      :is-open="isAddModalOpen"
      @close="isAddModalOpen = false"
      @save="handleStartNewSession"
    />
    <ModalsEditWorkoutModal
      :is-open="isEditModalOpen"
      :session="sessionToEdit"
      @close="closeEditModal"
      @save="handleUpdateSession"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// Import CreateSessionInput type
import type { WorkoutSession, CreateSessionInput } from "~/types";

const {
  sessions,
  fetchWorkoutSessions,
  addWorkoutSession,
  updateWorkoutSession,
  deleteWorkoutSession,
} = useWorkoutSessions();
const router = useRouter();

// State for modals
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const sessionToEdit = ref<WorkoutSession | null>(null);

onMounted(fetchWorkoutSessions);

const handleStartNewSession = async (sessionData: CreateSessionInput) => {
  const newSession = await addWorkoutSession(sessionData);
  isAddModalOpen.value = false;
  if (newSession) {
    router.push({ name: "workouts-id", params: { id: newSession.id } });
  }
};

const openEditModal = (session: WorkoutSession) => {
  sessionToEdit.value = session;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  sessionToEdit.value = null;
};

// --- THIS IS THE UPDATED FUNCTION ---
// It now correctly expects and passes the CreateSessionInput object
const handleUpdateSession = async (updatedData: CreateSessionInput) => {
  if (!sessionToEdit.value) return;
  await updateWorkoutSession(sessionToEdit.value.id, updatedData);
  closeEditModal();
};

const handleDelete = async (sessionId: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this session? This will also delete all of its logged exercises."
  );
  if (confirmed) {
    await deleteWorkoutSession(sessionId);
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
};
</script>
