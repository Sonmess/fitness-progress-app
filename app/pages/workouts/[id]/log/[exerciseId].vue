<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <!-- Back Button -->
    <div class="mb-4">
      <NuxtLink
        :to="{ name: 'workouts-id-add', params: { id: sessionId } }"
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
        Back to Exercise List
      </NuxtLink>
    </div>

    <div v-if="exercise" class="max-w-2xl mx-auto">
      <!-- Header -->
      <h1 class="text-3xl font-bold text-white">{{ exercise.name }}</h1>
      <p class="mt-1 text-lg text-indigo-400 font-semibold">
        {{ exercise.bodyPartName }}
      </p>

      <!-- Stats Section -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Personal Record -->
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2
            class="text-sm font-medium text-gray-400 uppercase tracking-wider"
          >
            Personal Record
          </h2>
          <div v-if="isPrSetLoading" class="text-gray-400 mt-2">Loading...</div>
          <!-- Updated to show weight and reps -->
          <div v-else-if="personalRecordSet" class="mt-2">
            <span class="text-4xl font-bold text-white">{{
              personalRecordSet.weight
            }}</span>
            <span class="ml-1 text-xl text-gray-400">kg</span>
            <p class="text-lg text-gray-300">
              for {{ personalRecordSet.reps }} reps
            </p>
          </div>
          <div v-else class="text-gray-500 mt-2">No record yet.</div>
        </div>
        <!-- Recent Log -->
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2
            class="text-sm font-medium text-gray-400 uppercase tracking-wider"
          >
            Recent Log
          </h2>
          <div v-if="isRecentLoading" class="text-gray-400 mt-2">
            Loading...
          </div>
          <div
            v-else-if="recentLog && recentLog.sets.length > 0"
            class="mt-2 space-y-1 text-sm text-gray-300"
          >
            <div v-for="(set, index) in recentLog.sets" :key="index">
              <span>Set {{ index + 1 }}:</span>
              <span class="font-medium text-white ml-2"
                >{{ set.reps }} reps</span
              >
              <span class="mx-1">at</span>
              <span class="font-medium text-white">{{ set.weight }} kg</span>
            </div>
          </div>
          <div v-else class="text-gray-500 mt-2">No recent logs.</div>
        </div>
      </div>

      <!-- New Log Form -->
      <form @submit.prevent="saveLog" class="mt-10">
        <h2 class="text-xl font-semibold text-white">Log Today's Sets</h2>
        <div class="mt-4 space-y-4">
          <div
            v-for="(set, index) in sets"
            :key="index"
            class="flex items-center gap-x-4"
          >
            <span class="text-gray-400 font-medium">Set {{ index + 1 }}</span>
            <div class="flex-1">
              <label :for="`reps-${index}`" class="sr-only">Reps</label>
              <input
                v-model.number="set.reps"
                type="number"
                step="1"
                :id="`reps-${index}`"
                placeholder="Reps"
                class="block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <div class="flex-1">
              <label :for="`weight-${index}`" class="sr-only">Weight</label>
              <input
                v-model.number="set.weight"
                type="number"
                step="any"
                :id="`weight-${index}`"
                placeholder="Weight (kg)"
                class="block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <button
              @click="removeSet(index)"
              type="button"
              class="text-red-400 hover:text-red-300"
            >
              &times;
            </button>
          </div>
          <button
            @click="addSet"
            type="button"
            class="text-sm font-medium text-indigo-400 hover:text-indigo-300"
          >
            + Add Set
          </button>
        </div>
        <div class="mt-8">
          <button
            type="submit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-3 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700"
          >
            Save Log
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { NewWorkoutLogData, Set } from "~/types";

const route = useRoute();
const router = useRouter();
const { userId } = useAuth();
const sessionId = route.params.id as string;
const exerciseId = route.params.exerciseId as string;

// Get composables
const { exercise, getExerciseById } = useExercises();
// Updated to use the new function names
const { personalRecordSet, isPrSetLoading, findPersonalRecordSet } =
  useProgress();
const { recentLog, isRecentLoading, fetchRecentLogForExercise, addWorkoutLog } =
  useWorkoutLogs();

// Form state
const sets = ref<Set[]>([{ reps: 0, weight: 0 }]);

// Fetch all data on page load
onMounted(() => {
  getExerciseById(exerciseId);
  findPersonalRecordSet(exerciseId); // Call the new function
  fetchRecentLogForExercise(exerciseId);
});

const addSet = () => {
  const lastSet = sets.value[sets.value.length - 1];
  const lastWeight = lastSet ? lastSet.weight || 0 : 0;
  const lastReps = lastSet ? lastSet.reps || 0 : 0;
  sets.value.push({ reps: lastReps, weight: lastWeight });
};

const removeSet = (index: number) => {
  if (sets.value.length > 1) {
    sets.value.splice(index, 1);
  } else {
    sets.value = [{ reps: 0, weight: 0 }];
  }
};

const saveLog = async () => {
  if (!exercise.value) return;

  const validSets = sets.value.filter((s) => s.reps > 0 && s.weight >= 0);
  if (validSets.length === 0) {
    alert("Please enter reps and weight for at least one set.");
    return;
  }

  if (userId.value) {
    const logData: NewWorkoutLogData = {
      userId: userId.value,
      sessionId: sessionId,
      exerciseId: exerciseId,
      exerciseName: exercise.value.name,
      sets: validSets,
      date: new Date(),
    };
    await addWorkoutLog(logData);
  }

  router.push({ name: "workouts-id", params: { id: sessionId } });
};
</script>
