<template>
  <div v-if="isOpen" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div @click="$emit('close')" class="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <form @submit.prevent="saveChanges">
          <div class="bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-white" id="modal-title">
              Edit Log for <span class="text-indigo-400">{{ log?.exerciseName }}</span>
            </h3>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-300">Sets</label>
              <div v-for="(set, index) in editableSets" :key="index" class="mt-2 flex items-center gap-x-4">
                <span class="text-gray-400 font-medium">Set {{ index + 1 }}</span>
                <div class="flex-1">
                  <label :for="`edit-reps-${index}`" class="sr-only">Reps</label>
                  <input v-model.number="set.reps" type="number" step="1" :id="`edit-reps-${index}`" placeholder="Reps" class="block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm sm:text-sm">
                </div>
                <div class="flex-1">
                  <label :for="`edit-weight-${index}`" class="sr-only">Weight</label>
                  <input v-model.number="set.weight" type="number" step="any" :id="`edit-weight-${index}`" placeholder="Weight (kg)" class="block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm sm:text-sm">
                </div>
                <button @click="removeSet(index)" type="button" class="text-red-400 hover:text-red-300">&times;</button>
              </div>
              <button @click="addSet" type="button" class="mt-3 text-sm font-medium text-indigo-400 hover:text-indigo-300">+ Add Set</button>
            </div>
          </div>
          <div class="bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">Save Changes</button>
            <button @click="$emit('close')" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-white hover:bg-gray-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { WorkoutLog, Set } from '~/types';

const props = defineProps<{
  isOpen: boolean;
  log: WorkoutLog | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', updatedSets: Set[]): void;
}>();

const editableSets = ref<Set[]>([]);

// When the modal opens, create a deep copy of the sets to edit
watch(() => props.isOpen, (newValue) => {
  if (newValue && props.log) {
    editableSets.value = JSON.parse(JSON.stringify(props.log.sets));
  }
});

const addSet = () => {
  editableSets.value.push({ reps: 0, weight: 0 });
};

const removeSet = (index: number) => {
  editableSets.value.splice(index, 1);
};

const saveChanges = () => {
  const validSets = editableSets.value.filter(s => s.reps > 0 && s.weight >= 0);
  emit('save', validSets);
};
</script>
