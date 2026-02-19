<template>
  <div class="progress-graph-container">
    <div v-if="isLoading" class="text-center py-10">
      <p class="text-gray-400">Loading progress data...</p>
    </div>

    <div v-else-if="exerciseLogs.length < 2" class="text-center py-10">
      <p class="text-gray-400">Not enough workout data to display.</p>
    </div>

    <div
        v-else
        class="flex flex-col gap-4 h-full w-full"
    >
      <ProgressLineGraph
          title="Max weight progress"
          :chartData="chartDataWeight" />
      <ProgressLineGraph
          title="Max volume progress"
          :chartData="chartDataVolume"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import type { WorkoutLog} from "~/types";
import {calculateVolume} from "~/utils/workout";

const props = defineProps<{
  exerciseId: string;
}>();

const { isLoading, fetchLogsForExercise } = useWorkoutLogs();
const exerciseLogs = ref<WorkoutLog[]>([]);

const checkEmptyExerciseLogs = computed(() => {
  return exerciseLogs.value.length === 0;
});

// Reverse to show oldest to newest (left to right)
const sortedLogs = computed(() => [...exerciseLogs.value].reverse());

// Extract dates for X-axis
const chartLabels = computed(() => {
  return sortedLogs.value.map(log => formatDateShort(log.date));
});

const getMaxWeights = computed(() => {
  return sortedLogs.value.map(log => calculateMaxWeight(log.sets));
});

const getWorkoutVolumes = computed(() => {
  return sortedLogs.value.map(log => calculateVolume(log.sets));
});

const chartDataWeight = computed(() => {
  if (checkEmptyExerciseLogs.value) {
    return {
      labels: [],
      datasets: []
    }
  }

  return {
    labels: chartLabels.value,
    datasets: [
      {
        label: 'Max weight (kg)',
        data: getMaxWeights.value,
        borderColor: '#6366f1', // indigo-500
        backgroundColor: 'rgba(99, 102, 241, 0.1)', // indigo with transparency
        tension: 0.4, // Smooth curve
        fill: true
      }
    ]
  }
});

const chartDataVolume = computed(() => {
  if (checkEmptyExerciseLogs.value) {
    return {
      labels: [],
      datasets: []
    }
  }

  return {
    labels: chartLabels.value,
    datasets: [
      {
        label: 'Total volume (kg)',
        data: getWorkoutVolumes.value,
        borderColor: '#818cf8', // Different shade of indigo for variety
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        tension: 0.4, // Smooth curve
        fill: true
      }
    ]
  }
});

onMounted(async () => {
  exerciseLogs.value = await fetchLogsForExercise(props.exerciseId);
});
</script>