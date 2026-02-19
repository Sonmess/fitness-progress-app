<template>
  <div class="progress-table-container overflow-x-auto">
    <div v-if="isLoading" class="text-center py-10">
      <p class="text-gray-400">Loading workout history...</p>
    </div>

    <div v-else-if="exerciseLogs.length === 0" class="text-center py-10">
      <p class="text-gray-400">No workout logs found for this exercise.</p>
    </div>

    <table v-else class="min-w-full">
      <thead class="bg-gray-800">
      <tr>
        <th class="p-3 text-left text-xs font-medium uppercase text-gray-400 tracking-wider">
          Date
        </th>
        <th
            v-for="index in maxSets"
            :key="index"
            class="p-3 text-left text-xs font-medium uppercase text-gray-400 tracking-wider"
        >
          Set {{ index }}
        </th>
        <th class="p-3 text-left text-xs font-medium uppercase text-gray-400 tracking-wider">
          Best Set
        </th>
        <th class="p-3 text-left text-xs font-medium uppercase text-gray-400 tracking-wider">
          Volume
        </th>
      </tr>
      </thead>
      <tbody class="divide-y divide-gray-800 bg-gray-900">
      <tr
          v-for="(log, index) in exerciseLogs"
          :key="log.id"
          :class="[
            'transition-colors',
            log.id === maxVolumeLogId
            ? 'bg-indigo-900/20 border-l-4 border-indigo-500'
            : index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800/30',
            'hover:bg-gray-800/50'
          ]"
      >
        <td class="p-3 text-sm text-gray-300 whitespace-nowrap">
          {{ formatDateShort(log.date) }}
        </td>
        <td
            v-for="index in maxSets"
            :key="index"
            class="p-3 text-sm text-white whitespace-nowrap"
        >
            <span v-if="log.sets[index - 1]">
              {{ log.sets[index - 1]?.reps }}×{{ log.sets[index - 1]?.weight }}
            </span>
          <span v-else class="text-gray-600">—</span>
        </td>
        <td class="p-3 text-sm font-bold text-indigo-400 whitespace-nowrap">
          {{ formatBestSet(log.sets) }}
        </td>
        <td class="p-3 text-sm text-gray-300 whitespace-nowrap">
          {{ calculateVolumeFormatted(log.sets) }} kg
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from "vue";
import type {WorkoutLog} from "~/types";

const props = defineProps<{
  exerciseId: string;
}>();

const {isLoading, fetchLogsForExercise} = useWorkoutLogs();
const exerciseLogs = ref<WorkoutLog[]>([]);

const maxSets = computed(() => {
  if (exerciseLogs.value.length === 0) return 0;
  return Math.max(...exerciseLogs.value.map(log => log.sets.length));
});

// Find the log with the highest volume
const maxVolumeLogId = computed(() => {
  if (exerciseLogs.value.length === 0) return null;

  const logWithMaxVolume = exerciseLogs.value.reduce((max, log) => {
    const currentVolume = calculateVolumeFormatted(log.sets);
    const maxVolume = calculateVolumeFormatted(max.sets);
    return parseFloat(currentVolume) > parseFloat(maxVolume) ? log : max;
  });

  return logWithMaxVolume.id;
});

onMounted(async () => {
  exerciseLogs.value = await fetchLogsForExercise(props.exerciseId);
});
</script>

<style scoped>
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #6366f1 #1f2937; /* indigo thumb, gray track */
}

/* Webkit browsers */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #1f2937; /* gray-800 */
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #6366f1; /* indigo-500 */
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #818cf8; /* indigo-400 - lighter on hover */
}
</style>