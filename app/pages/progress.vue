<template>
  <CommonBasePage
      title="My Progress"
      description="A comprehensive list of your personal records across all exercises."
  >
    <template #icon>
      <IconsCommonProgressIcon class="relative top-[2px]"/>
    </template>

    <div class="overflow-x-auto">
      <div v-if="isLoading" class="text-center py-20">
        <p class="text-gray-400">Calculating all personal records...</p>
      </div>

      <div v-else-if="personalRecords.length === 0" class="text-center py-20">
        <p class="text-gray-400">No personal records found.</p>
        <p class="text-gray-500 text-sm mt-1">
          Log some workouts to see your progress here!
        </p>
      </div>

      <table v-else-if="personalRecords.length > 0" class="min-w-full">
        <thead class="bg-gray-800">
        <tr>
          <th scope="col" class="p-3 text-left text-xs font-medium uppercase text-gray-400 tracking-wider">
            Exercise
          </th>
          <th scope="col" class="p-3 text-left text-xs font-medium uppercase text-gray-400 tracking-wider">
            Max Weight
          </th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-800 bg-gray-900">
        <template
            v-for="(group) in groupedRecords"
            :key="group.bodyPartName"
        >
          <tr class="border-t border-gray-800">
            <th
                colspan="2"
                scope="colgroup"
                class="bg-gray-800/50 p-3 text-left text-sm font-semibold text-white"
            >
              {{ group.bodyPartName }}
            </th>
          </tr>
          <tr v-for="record in group.records" :key="record.exerciseId" class="hover:bg-gray-800/30 transition-colors">
            <td class="whitespace-nowrap p-3 text-sm font-medium text-white">
              {{ record.exerciseName }}
            </td>
            <td class="whitespace-nowrap p-3 text-lg font-bold text-white">
              {{ record.maxWeight }} kg
            </td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
  </CommonBasePage>

</template>

<script setup lang="ts">
import {onMounted, computed} from "vue";
import type {PersonalRecord} from "~/composables/useProgress";

const {personalRecords, isLoading, calculateAllPersonalRecords} =
    useProgress();

// Fetch and calculate all records when the component is mounted
onMounted(calculateAllPersonalRecords);

// A computed property to group the flat list of records by body part
const groupedRecords = computed(() => {
  const groups: { bodyPartName: string; records: PersonalRecord[] }[] = [];

  personalRecords.value.forEach((record) => {
    let group = groups.find((g) => g.bodyPartName === record.bodyPartName);
    if (!group) {
      group = {bodyPartName: record.bodyPartName, records: []};
      groups.push(group);
    }
    group.records.push(record);
  });

  return groups;
});
</script>
