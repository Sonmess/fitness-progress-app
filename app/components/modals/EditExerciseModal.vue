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
        @click="closeModal"
        class="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >
      <div
        class="inline-block align-bottom bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all mt-8 sm:my-8 sm:align-middle sm:max-w-lg w-full"
      >
        <form @submit.prevent="saveChanges">
          <div class="bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start w-full">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3
                  class="text-lg leading-6 font-medium text-white"
                  id="modal-title"
                >
                  Edit Exercise
                </h3>
                <div class="mt-4 space-y-4">
                  <!-- Form fields are pre-populated with existing data -->
                  <div>
                    <label
                      for="edit-name"
                      class="block text-sm font-medium text-gray-300"
                      >Exercise Name</label
                    >
                    <input
                      v-model="form.name"
                      type="text"
                      id="edit-name"
                      class="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="edit-description"
                      class="block text-sm font-medium text-gray-300"
                      >Description</label
                    >
                    <textarea
                      v-model="form.description"
                      id="edit-description"
                      rows="3"
                      class="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <div>
                    <label
                      for="edit-bodyPart"
                      class="block text-sm font-medium text-gray-300"
                      >Body Part</label
                    >
                    <select
                      v-model="selectedBodyPartId"
                      id="edit-bodyPart"
                      class="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    >
                      <option
                        v-for="part in bodyParts"
                        :key="part.id"
                        :value="part.id"
                      >
                        {{ part.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label
                      for="edit-equipment"
                      class="block text-sm font-medium text-gray-300"
                      >Equipment</label
                    >
                    <select
                      v-model="form.equipment"
                      id="edit-equipment"
                      class="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                  <div>
                    <label
                      for="edit-imageUrl"
                      class="block text-sm font-medium text-gray-300"
                      >Image URL (Optional)</label
                    >
                    <input
                      v-model="form.imageUrl"
                      type="text"
                      id="edit-imageUrl"
                      class="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
          >
            <button
              type="submit"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium text-black hover:bg-yellow-600 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save Changes
            </button>
            <button
              @click="closeModal"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-white hover:bg-gray-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
import type { Exercise } from "~/types";
import type { NewExerciseData } from "~/types/index";

const props = defineProps<{
  isOpen: boolean;
  exercise: Exercise | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", exerciseData: Partial<NewExerciseData>): void;
}>();

const { bodyParts, fetchBodyParts } = useBodyParts();
const { getEquipmentptions } = useEquipment();

const form = ref<Partial<Exercise>>({});
const selectedBodyPartId = ref("");

// When the modal opens, populate the form with the exercise data from the prop
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && props.exercise) {
      // Create a copy of the exercise object for the form
      form.value = { ...props.exercise };
      selectedBodyPartId.value = props.exercise.bodyPartId;
      if (bodyParts.value.length === 0) {
        fetchBodyParts();
      }
    }
  }
);

const closeModal = () => {
  emit("close");
};

const saveChanges = () => {
  const selectedPart = bodyParts.value.find(
    (p) => p.id === selectedBodyPartId.value
  );
  if (!form.value.name || !selectedPart) {
    alert("Please fill in all required fields.");
    return;
  }

  // Construct the data object to emit, ensuring we have the correct BodyPart info
  const updatedData: Partial<NewExerciseData> = {
    name: form.value.name,
    description: form.value.description,
    bodyPartId: selectedPart.id,
    bodyPartName: selectedPart.name,
    equipment: form.value.equipment,
    imageUrl: form.value.imageUrl || "",
  };

  emit("save", updatedData);
};
</script>
