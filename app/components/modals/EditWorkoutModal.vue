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
            <h3
              class="text-lg leading-6 font-medium text-white"
              id="modal-title"
            >
              Edit Workout Session
            </h3>
            <div class="mt-4 space-y-4">
              <div>
                <label
                  for="edit-title"
                  class="block text-sm font-medium text-gray-300"
                  >Session Title</label
                >
                <input
                  v-model="form.title"
                  type="text"
                  id="edit-title"
                  class="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  for="edit-notes"
                  class="block text-sm font-medium text-gray-300"
                  >Notes (Optional)</label
                >
                <textarea
                  v-model="form.notes"
                  id="edit-notes"
                  rows="4"
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
import type { WorkoutSession } from "~/types";

const props = defineProps<{
  isOpen: boolean;
  session: WorkoutSession | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", data: { title: string; notes?: string }): void;
}>();

const form = ref({ title: "", notes: "" });

// When the modal opens, populate the form with the session data
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && props.session) {
      form.value.title = props.session.title;
      form.value.notes = props.session.notes || "";
    }
  }
);

const closeModal = () => {
  emit("close");
};

const saveChanges = () => {
  if (!form.value.title) {
    alert("Please enter a title.");
    return;
  }
  emit("save", { ...form.value });
};
</script>
