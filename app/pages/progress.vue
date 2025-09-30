<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold text-white">My Progress</h1>
        <p class="mt-2 text-sm text-gray-400">
          A comprehensive list of your personal records across all exercises.
        </p>
      </div>
    </div>

    <!-- Personal Records Table -->
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div
            class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
          >
            <div v-if="isLoading" class="text-center py-20">
              <p class="text-gray-400">Calculating all personal records...</p>
            </div>
            <table v-else-if="personalRecords.length > 0" class="min-w-full">
              <tbody class="divide-y divide-gray-800 bg-gray-900">
                <template
                  v-for="(group, index) in groupedRecords"
                  :key="group.bodyPartName"
                >
                  <tr class="border-t border-gray-800">
                    <th
                      colspan="2"
                      scope="colgroup"
                      class="bg-gray-800/50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      {{ group.bodyPartName }}
                    </th>
                  </tr>
                  <tr v-for="record in group.records" :key="record.exerciseId">
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6"
                    >
                      {{ record.exerciseName }}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-lg font-bold text-white"
                    >
                      {{ record.maxWeight }} kg
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            <div v-else class="text-center py-20">
              <p class="text-gray-400">No personal records found.</p>
              <p class="text-gray-500 text-sm mt-1">
                Log some workouts to see your progress here!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import type { PersonalRecord } from "~/composables/useProgress";

const { personalRecords, isLoading, calculateAllPersonalRecords } =
  useProgress();

// Fetch and calculate all records when the component is mounted
onMounted(calculateAllPersonalRecords);

// A computed property to group the flat list of records by body part
const groupedRecords = computed(() => {
  const groups: { bodyPartName: string; records: PersonalRecord[] }[] = [];

  personalRecords.value.forEach((record) => {
    let group = groups.find((g) => g.bodyPartName === record.bodyPartName);
    if (!group) {
      group = { bodyPartName: record.bodyPartName, records: [] };
      groups.push(group);
    }
    group.records.push(record);
  });

  return groups;
});
</script>
