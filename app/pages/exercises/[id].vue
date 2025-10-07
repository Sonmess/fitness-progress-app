<template>
  <div v-if="exercise" class="p-4 sm:p-6 lg:p-8">
    <!-- Back Button -->
    <div class="mb-4">
      <NuxtLink
        :to="{ name: 'exercises' }"
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
        Back to Exercises
      </NuxtLink>
    </div>

    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold text-white">{{ exercise.name }}</h1>
        <p class="mt-2 text-sm text-indigo-400 font-semibold">
          {{ exercise.bodyPartName }}
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
        <button
          @click="isEditModalOpen = true"
          type="button"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-500 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          @click="handleDelete"
          type="button"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- Exercise Details -->
    <div class="mt-8 max-w-2xl text-gray-300 space-y-4">
      <div v-if="exercise.description">
        <h2 class="font-semibold text-white">Description</h2>
        <p>{{ exercise.description }}</p>
      </div>
      <div>
        <h2 class="font-semibold text-white">Equipment</h2>
        <p>{{ exercise.equipment || "N/A" }}</p>
      </div>
      <div v-if="exercise.imageUrl">
        <h2 class="font-semibold text-white">Visual Guide</h2>
        <img
          :src="exercise.imageUrl"
          alt="Image of {{ exercise.name }}"
          class="mt-2 rounded-lg border border-gray-700 max-w-sm"
        />
      </div>
    </div>

    <!-- The Edit Exercise Modal -->
    <ModalsEditExerciseModal
      v-if="exercise"
      :is-open="isEditModalOpen"
      :exercise="exercise"
      @close="isEditModalOpen = false"
      @save="handleUpdateExercise"
    />
  </div>
  <div v-else class="p-8 text-center text-gray-400">
    Loading exercise details...
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { NewExerciseData } from "~/types";

const { exercise, getExerciseById, deleteExercise, updateExerciseById } =
  useExercises();
const route = useRoute();
const router = useRouter();
const exerciseId = route.params.id as string;

const isEditModalOpen = ref(false);

onMounted(() => {
  getExerciseById(exerciseId);
});

const handleDelete = async () => {
  // We use window.confirm for simplicity. In a real app, a custom modal is better.
  const confirmed = window.confirm(
    `Are you sure you want to delete "${exercise.value?.name}"? This action cannot be undone.`
  );
  if (confirmed) {
    await deleteExercise(exerciseId);
    // After deleting, navigate the user back to the main exercises list.
    router.push({ name: "exercises" });
  }
};

/**
 * Handles the 'save' event from the EditExerciseModal.
 * This function receives the updated data, calls the action to save it,
 * and then closes the modal.
 */
const handleUpdateExercise = async (updatedData: Partial<NewExerciseData>) => {
  await updateExerciseById(exerciseId, updatedData);
  isEditModalOpen.value = false;
};
</script>
