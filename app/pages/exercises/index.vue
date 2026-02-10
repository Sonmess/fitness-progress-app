<template>
  <CommonBasePage
      title="Exercises"
      description="A list of all the exercises in your account."
  >
    <template #icon>
      <IconsCommonExerciseIcon class="relative top-[2px]"/>
    </template>

    <template #actions>
      <div class="flex justify-center items-center">
        <button
            @click="isModalOpen = true"
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          + Add New Exercise
        </button>
      </div>
    </template>

    <!-- Filter Tags -->
    <div class="tags-container">
      <label class="text-sm font-medium text-gray-300">Filter by body part:</label>
      <div class="mt-2 flex flex-wrap gap-2">
        <!-- "All" Tag -->
        <button
            @click="selectedBodyPartId = null"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-full',
              selectedBodyPartId === null
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
            ]"
        >
          All
        </button>
        <!-- Dynamic Body Part Tags -->
        <button
            v-for="part in bodyParts"
            :key="part.id"
            @click="selectedBodyPartId = part.id"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-full',
              selectedBodyPartId === part.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
            ]"
        >
          {{ part.name }}
        </button>
      </div>
    </div>

    <!-- List of Exercises Cards -->
    <div class="exercises-list mt-8">
      <div
          v-if="exercises.length === 0"
          class="text-center text-gray-400 py-10"
      >
        No exercises found.
      </div>
      <!-- Loop through each filtered group -->
      <section
          v-for="group in filteredAndGroupedExercises"
          :key="group.bodyPartName"
      >
        <h2 class="text-lg font-semibold text-white px-1 sm:px-0">
          {{ group.bodyPartName }}
        </h2>
        <div class="mt-4 flex flex-wrap gap-4">
          <ExercisesExerciseCard
              v-for="exercise in group.exercises"
              :key="exercise.id"
              :exercise="exercise"
              class="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)]"
          />
        </div>
      </section>
      <!-- Show message if filter returns no results -->
      <div
          v-if="
              filteredAndGroupedExercises.length === 0 &&
              selectedBodyPartId !== null
            "
          class="text-center text-gray-500 py-10"
      >
        No exercises found for this body part.
      </div>
    </div>

    <!-- The Add Exercise Modal -->
    <ModalsAddExerciseModal
        :is-open="isModalOpen"
        @close="isModalOpen = false"
        @save="handleAddNewExercise"
    />
  </CommonBasePage>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import type {NewExerciseData, Exercise} from "~/types";

const {exercises, fetchExercises, addExercise} = useExercises();
const {bodyParts, fetchBodyParts} = useBodyParts(); // Get body parts for filtering
const isModalOpen = ref(false);
const selectedBodyPartId = ref<string | null>(null); // State for the filter

onMounted(() => {
  fetchExercises();
  fetchBodyParts(); // Fetch body parts for the filter tags
});

const handleAddNewExercise = async (newExercise: NewExerciseData) => {
  await addExercise(newExercise);
  isModalOpen.value = false;
};

// New computed property to filter AND group the exercises
const filteredAndGroupedExercises = computed(() => {
  // 1. Filter the exercises based on the selected tag
  const filteredList = selectedBodyPartId.value
      ? exercises.value.filter((ex) => ex.bodyPartId === selectedBodyPartId.value)
      : exercises.value;

  // 2. Group the filtered list
  const groups: { bodyPartName: string; exercises: Exercise[] }[] = [];
  filteredList.forEach((exercise) => {
    let group = groups.find((g) => g.bodyPartName === exercise.bodyPartName);
    if (!group) {
      group = {bodyPartName: exercise.bodyPartName, exercises: []};
      groups.push(group);
    }
    group.exercises.push(exercise);
  });
  return groups;
});
</script>
