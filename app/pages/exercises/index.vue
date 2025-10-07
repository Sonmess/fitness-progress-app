<template>
  <div>
    <!-- Header -->
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-white">Exercises</h1>
          <p class="mt-2 text-sm text-gray-400">
            A list of all the exercises in your account.
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
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-800 bg-gray-900">
                  <template
                    v-for="group in groupedExercises"
                    :key="group.bodyPartName"
                  >
                    <tr class="border-t border-gray-700">
                      <th
                        colspan="3"
                        scope="colgroup"
                        class="bg-gray-800/50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                      >
                        {{ group.bodyPartName }}
                      </th>
                    </tr>
                    <tr v-for="exercise in group.exercises" :key="exercise.id">
                      <td
                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6"
                      >
                        {{ exercise.name }}
                      </td>
                      <td
                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-300"
                      >
                        {{ exercise.equipment || "N/A" }}
                      </td>
                      <td
                        class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                      >
                        <NuxtLink
                          :to="`/exercises/${exercise.id}`"
                          class="text-indigo-400 hover:text-indigo-300"
                          >View<span class="sr-only"
                            >, {{ exercise.name }}</span
                          ></NuxtLink
                        >
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
import { ref, onMounted, computed } from "vue";
import type { NewExerciseData, Exercise } from "~/types/index";

const { exercises, fetchExercises, addExercise } = useExercises();
const isModalOpen = ref(false);

onMounted(fetchExercises);

const handleAddNewExercise = async (newExercise: NewExerciseData) => {
  await addExercise(newExercise);
  isModalOpen.value = false;
};

const groupedExercises = computed(() => {
  const groups: { bodyPartName: string; exercises: Exercise[] }[] = [];
  exercises.value.forEach((exercise) => {
    let group = groups.find((g) => g.bodyPartName === exercise.bodyPartName);
    if (!group) {
      group = { bodyPartName: exercise.bodyPartName, exercises: [] };
      groups.push(group);
    }
    group.exercises.push(exercise);
  });
  return groups;
});
</script>
