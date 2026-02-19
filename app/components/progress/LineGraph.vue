<template>
  <div class="bg-gray-800 rounded-lg p-4">
    <h3 class="text-lg text-center font-medium text-white mb-2">{{ title }}</h3>

    <div class="overflow-auto">
      <div :style="{width: getChartWidth, height: getChartHeight}">
        <Line
            :data="chartData"
            :options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Line} from "vue-chartjs";
import type { ChartData } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {computed} from "vue";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const props = defineProps<{
  chartData: ChartData<'line'>;
  title: string;
}>();

// Calculate width based on the number of data points
// Each data point gets 80px width, minimum 100% container width
const getChartWidth = computed(() => {
  const dataPoints = props.chartData.labels?.length || 0;
  const minWidth = 100; // Minimum width in percentage
  const pixelsPerPoint = 80; // Width for each data point
  const calculatedWidth = dataPoints * pixelsPerPoint;

  // Use percentage if few data points, pixels if many
  return dataPoints <= 5 ? '100%' : `${calculatedWidth}px`;
});

// Calculate height based on number of data points
// More data points = taller chart for better readability
const getChartHeight = computed(() => {
  const dataPoints = props.chartData.labels?.length || 0;
  const baseHeight = 300; // Minimum height in pixels
  const additionalHeightPerPoint = 10; // Extra height per data point

  // Increases height as data points increase
  return dataPoints <= 10
      ? `${baseHeight}px`
      : `${baseHeight + (dataPoints - 10) * additionalHeightPerPoint}px`;
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#6366f1',
      borderWidth: 1
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        color: '#374151'
      },
      ticks: {
        color: '#9ca3af'
      }
    },
    x: {
      grid: {
        color: '#374151'
      },
      ticks: {
        color: '#9ca3af',
      }
    }
  }
};
</script>

<style scoped>
.overflow-auto {
  scrollbar-width: thin;
  scrollbar-color: #6366f1 #1f2937;
  padding-bottom: 8px;
}

.overflow-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}
</style>