<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-10 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        @click="$emit('close')"
        class="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >
      <div
        class="inline-block align-bottom bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
      >
        <form @submit.prevent="saveLog">
          <div class="bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3
              class="text-lg leading-6 font-medium text-white"
              id="modal-title"
            >
              Log Exercise
            </h3>
            <div
              class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6"
            >
              <!-- Exercise Selection -->
              <div class="sm:col-span-6">
                <label
                  for="exercise"
                  class="block text-sm font-medium text-gray-300"
                  >Exercise</label
                >
                <select
                  v-model="selectedExercise"
                  id="exercise"
                  class="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option disabled value="">Select an exercise</option>
                  <option
                    v-for="exercise in sortedExercises"
                    :key="exercise.id"
                    :value="exercise"
                  >
                    {{ exercise.name }}
                  </option>
                </select>
              </div>

              <!-- Sets -->
              <div class="sm:col-span-6">
                <label class="block text-sm font-medium text-gray-300"
                  >Sets</label
                >
                <div
                  v-for="(set, index) in sets"
                  :key="index"
                  class="mt-2 flex items-center gap-x-4"
                >
                  <span class="text-gray-400 font-medium"
                    >Set {{ index + 1 }}</span
                  >
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
                    <label :for="`weight-${index}`" class="sr-only"
                      >Weight</label
                    >
                    <input
                      v-model.number="set.weight"
                      type="number"
                      step="0.5"
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
                  class="mt-3 text-sm font-medium text-indigo-400 hover:text-indigo-300"
                >
                  + Add Set
                </button>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
          >
            <button
              type="submit"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save
            </button>
            <button
              @click="$emit('close')"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-white hover:bg-gray-600 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Exercise, NewWorkoutLogData, Set } from "~/types";

const props = defineProps<{
  isOpen: boolean;
  sessionId: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save"): void;
}>();

// Get master list of exercises for the dropdown
const { exercises, fetchExercises } = useExercises();
const { addWorkoutLog } = useWorkoutLogs();
const { userId } = useAuth();

const selectedExercise = ref<Exercise | null>(null);
const sets = ref<Set[]>([{ reps: 0, weight: 0 }]);

const sortedExercises = computed(() => {
  return [...exercises.value].sort((a, b) => a.name.localeCompare(b.name));
});

// Fetch exercises when modal opens
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && exercises.value.length === 0) {
      fetchExercises();
    }
  }
);

const addSet = () => {
  sets.value.push({ reps: 0, weight: 0 });
};

const removeSet = (index: number) => {
  sets.value.splice(index, 1);
};

const saveLog = async () => {
  if (!selectedExercise.value || sets.value.length === 0) {
    alert("Please select an exercise and add at least one set.");
    return;
  }

  if (userId.value) {
    const logData: NewWorkoutLogData = {
      userId: userId.value,
      sessionId: props.sessionId,
      exerciseId: selectedExercise.value.id,
      exerciseName: selectedExercise.value.name,
      sets: sets.value.filter((s) => s.reps > 0 && s.weight > 0), // Filter out empty sets
    };
    await addWorkoutLog(logData);
    resetForm();
    emit("save");
  }
};

const resetForm = () => {
  selectedExercise.value = null;
  sets.value = [{ reps: 0, weight: 0 }];
};
</script>
