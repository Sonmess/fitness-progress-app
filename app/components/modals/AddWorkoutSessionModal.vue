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
        class="inline-block mt-16 align-bottom bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full"
      >
        <form @submit.prevent="saveSession">
          <div class="bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3
              class="text-lg leading-6 font-medium text-white"
              id="modal-title"
            >
              Start New Session
            </h3>
            <div class="mt-4 space-y-4">
              <!-- Body Part Multi-Select -->
              <div>
                <label class="block text-sm font-medium text-gray-300"
                  >Body Parts</label
                >
                <p class="text-xs text-gray-500">
                  Select all parts you're training today.
                </p>
                <div
                  v-if="bodyParts.length === 0"
                  class="text-gray-400 text-sm mt-2"
                >
                  Loading body parts...
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
                        :id="`part-${part.id}`"
                        :value="part"
                        v-model="selectedBodyParts"
                        type="checkbox"
                        class="h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label
                        :for="`part-${part.id}`"
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
                  for="session-notes"
                  class="block text-sm font-medium text-gray-300"
                  >Notes (Optional)</label
                >
                <textarea
                  v-model="notes"
                  id="session-notes"
                  rows="2"
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
              Start Session
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
import { ref, onMounted } from "vue";
import type { BodyPart, CreateSessionInput } from "~/types";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", data: CreateSessionInput): void;
}>();

// Get body parts from our composable
const { bodyParts, fetchBodyParts } = useBodyParts();

// Form state
const selectedBodyParts = ref<BodyPart[]>([]);
const notes = ref("");

// Fetch body parts when component is mounted
onMounted(() => {
  if (bodyParts.value.length === 0) {
    fetchBodyParts();
  }
});

const closeModal = () => {
  emit("close");
  // Reset form
  selectedBodyParts.value = [];
  notes.value = "";
};

const saveSession = () => {
  if (selectedBodyParts.value.length === 0) {
    alert("Please select at least one body part.");
    return;
  }
  emit("save", {
    bodyParts: selectedBodyParts.value,
    notes: notes.value,
  });
  closeModal();
};
</script>
