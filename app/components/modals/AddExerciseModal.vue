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
      <!-- Background overlay -->
      <div
        @click="closeModal"
        class="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <!-- Modal panel -->
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >
      <div
        class="inline-block align-bottom bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full mt-8"
      >
        <form @submit.prevent="saveExercise">
          <div class="bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start w-full">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3
                  class="text-lg leading-6 font-medium text-white"
                  id="modal-title"
                >
                  Add New Exercise
                </h3>
                <div class="mt-4 space-y-4">
                  <!-- Exercise Name -->
                  <div>
                    <label
                      for="name"
                      class="block text-sm font-medium text-gray-300"
                      >Exercise Name</label
                    >
                    <input
                      v-model="form.name"
                      type="text"
                      id="name"
                      class="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm leading-2 px-2 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <!-- Description -->
                  <div>
                    <label
                      for="description"
                      class="block text-sm font-medium text-gray-300"
                      >Description</label
                    >
                    <textarea
                      v-model="form.description"
                      id="description"
                      rows="2"
                      class="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm px-2 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <!-- Body Part -->
                  <div>
                    <label
                      for="bodyPart"
                      class="block text-sm font-medium text-gray-300"
                      >Body Part</label
                    >
                    <select
                      v-model="selectedBodyPart"
                      id="bodyPart"
                      class="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm leading-2 px-2 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    >
                      <option disabled value="">Please select one</option>
                      <option
                        v-for="part in bodyParts"
                        :key="part.id"
                        :value="part"
                      >
                        {{ part.name }}
                      </option>
                    </select>
                  </div>
                  <!-- Equipment -->
                  <div>
                    <label
                      for="equipment"
                      class="block text-sm font-medium text-gray-300"
                      >Equipment</label
                    >
                    <select
                      v-model="form.equipment"
                      id="equipment"
                      class="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm px-2 py-2 leading-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">None</option>
                      <option
                        v-for="item in getEquipmentptions"
                        :key="item"
                        :value="item"
                      >
                        {{ item }}
                      </option>
                    </select>
                  </div>
                  <!-- Image URL -->
                  <div>
                    <label
                      for="imageUrl"
                      class="block text-sm font-medium text-gray-300"
                      >Image URL (Optional)</label
                    >
                    <input
                      v-model="form.imageUrl"
                      type="text"
                      id="imageUrl"
                      class="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Action Buttons -->
          <div
            class="bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
          >
            <button
              type="submit"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save
            </button>
            <button
              @click="closeModal"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
import type { BodyPart, NewExerciseData } from "~/types";

// Props and Emits
const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", exercise: NewExerciseData): void;
}>();

// Get the list of body parts from our composable
const { bodyParts, fetchBodyParts } = useBodyParts();
// Define the equipment options based on our type
const { getEquipmentptions } = useEquipment();

// Form state
const form = ref<Partial<NewExerciseData>>({});
const selectedBodyPart = ref<BodyPart | null>(null);

// When the modal opens, fetch the body parts if they aren't already loaded
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && bodyParts.value.length === 0) {
      fetchBodyParts();
    }
  }
);

const closeModal = () => {
  emit("close");
  // Reset form after closing
  form.value = {};
  selectedBodyPart.value = null;
};

const saveExercise = () => {
  if (!form.value.name || !selectedBodyPart.value) {
    alert("Please fill in the required fields: Name and Body Part.");
    return;
  }

  const exerciseToSave: NewExerciseData = {
    name: form.value.name,
    description: form.value.description || "",
    bodyPartId: selectedBodyPart.value.id,
    bodyPartName: selectedBodyPart.value.name,
  };

  if (form.value.imageUrl) {
    exerciseToSave.imageUrl = form.value.imageUrl;
  }

  if (form.value.equipment) {
    exerciseToSave.equipment = form.value.equipment;
  }

  emit("save", exerciseToSave);
  form.value = {};
  selectedBodyPart.value = null;
};
</script>
