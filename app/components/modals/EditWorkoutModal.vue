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
        class="inline-block align-bottom bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <form @submit.prevent="saveChanges">
          <div class="bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3
              class="text-lg leading-6 font-medium text-white"
              id="modal-title"
            >
              Edit Workout Session
            </h3>
            <p class="mt-1 text-sm text-gray-400">
              Update the body parts trained and notes for this session.
            </p>
            <div class="mt-4 space-y-4">
              <!-- Body Part Multi-Select -->
              <div>
                <label class="block text-sm font-medium text-gray-300"
                  >Body Parts</label
                >
                <div
                  v-if="bodyParts.length === 0"
                  class="text-gray-400 text-sm mt-2"
                >
                  Loading...
                </div>
                <div
                  class="mt-2 max-h-48 overflow-y-auto space-y-2 rounded-md border border-gray-700 p-3"
                >
                  <div
                    v-for="part in bodyParts"
                    :key="part.id"
                    class="relative flex items-start"
                  >
                    <div class="flex h-5 items-center">
                      <input
                        :id="`edit-part-${part.id}`"
                        :value="part"
                        v-model="selectedBodyParts"
                        type="checkbox"
                        class="h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label
                        :for="`edit-part-${part.id}`"
                        class="font-medium text-gray-300"
                        >{{ part.name }}</label
                      >
                    </div>
                  </div>
                </div>
              </div>
              <!-- Notes -->
              <div>
                <label
                  for="edit-session-notes"
                  class="block text-sm font-medium text-gray-300"
                  >Notes (Optional)</label
                >
                <textarea
                  v-model="notes"
                  id="edit-session-notes"
                  rows="3"
                  class="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
          >
            <button
              type="submit"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
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
import type { WorkoutSession, BodyPart, CreateSessionInput } from "~/types";

const props = defineProps<{
  isOpen: boolean;
  session: WorkoutSession | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", data: CreateSessionInput): void;
}>();

const { bodyParts, fetchBodyParts } = useBodyParts();

const selectedBodyParts = ref<BodyPart[]>([]);
const notes = ref("");

// Updated watch function to handle missing bodyPartIds
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      // Always fetch body parts if needed
      if (bodyParts.value.length === 0) {
        fetchBodyParts().then(() => selectInitialParts());
      } else {
        selectInitialParts();
      }
      // Set notes (handle potential undefined)
      notes.value = props.session?.notes || "";
    } else {
      // Reset form when closing
      selectedBodyParts.value = [];
      notes.value = "";
    }
  }
);

// Updated function to handle potentially missing bodyPartIds
const selectInitialParts = () => {
  // Check if the session exists and has the bodyPartIds array
  if (props.session && Array.isArray(props.session.bodyPartIds)) {
    selectedBodyParts.value = bodyParts.value.filter((part) =>
      props.session?.bodyPartIds.includes(part.id)
    );
  } else {
    // If bodyPartIds is missing, start with an empty selection
    selectedBodyParts.value = [];
  }
};

const closeModal = () => {
  emit("close");
};

const saveChanges = () => {
  if (selectedBodyParts.value.length === 0) {
    alert("Please select at least one body part.");
    return;
  }
  emit("save", {
    bodyParts: selectedBodyParts.value,
    notes: notes.value,
  });
  // No need to call closeModal here if the parent component handles it on @save
};
</script>
