<template>
  <div>
    <!-- Header -->
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-white">Exercises</h1>
          <p class="mt-2 text-sm text-gray-400">
            A list of all the exercises in your account, grouped by body part.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            @click="isModalOpen = true"
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 sm:w-auto"
          >
            + Add New Exercise
          </button>
        </div>
      </div>
      <!-- List of Exercises Table -->
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
          >
            <div
              class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
            >
              <table class="min-w-full">
                <thead class="bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Equipment
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-800 bg-gray-900">
                  <tr v-if="exercises.length === 0">
                    <td
                      colspan="2"
                      class="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-400"
                    >
                      No exercises found. Add one to get started!
                    </td>
                  </tr>
                  <template
                    v-for="(exercise, index) in exercises"
                    :key="exercise.id"
                  >
                    <!-- Group Header: Displayed for the first item or when body part changes -->
                    <tr
                      v-if="
                        index === 0 ||
                        exercises[index - 1].bodyPartName !==
                          exercise.bodyPartName
                      "
                    >
                      <td
                        colspan="2"
                        class="bg-gray-800 px-4 py-2 text-sm font-bold text-white sm:pl-6"
                      >
                        {{ exercise.bodyPartName }}
                      </td>
                    </tr>
                    <!-- Exercise Row -->
                    <tr>
                      <td
                        class="whitespace-nowrap py-4 pl-8 pr-3 text-sm font-medium text-white sm:pl-10"
                      >
                        {{ exercise.name }}
                      </td>
                      <td
                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-300"
                      >
                        {{ exercise.equipment || "N/A" }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- The Add Exercise Modal -->
    <ModalsAddExerciseModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @save="handleAddNewExercise"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { NewExerciseData } from "~/composables/useExercises";

// Use our composable to get access to the state and functions
const { exercises, fetchExercises, addExercise } = useExercises();
const isModalOpen = ref(false);

// Fetch the initial list of exercises when the component is mounted
onMounted(fetchExercises);

/**
 * Handles the 'save' event from the modal.
 * This function receives the new exercise data, calls the action to save it,
 * and then closes the modal.
 */
const handleAddNewExercise = async (newExercise: NewExerciseData) => {
  await addExercise(newExercise);
  isModalOpen.value = false;
};
</script>
