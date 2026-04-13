<template>
  <CommonBasePage
    title="My Progress"
    description="Select a body part to see your personal records."
  >
    <template #icon>
      <IconsCommonProgressIcon class="relative top-[2px]" />
    </template>

    <div v-if="bodyParts.length === 0" class="text-center py-20">
      <p class="text-gray-400">Loading...</p>
    </div>

    <div v-else class="divide-y divide-gray-800 rounded-lg overflow-hidden">
      <div v-for="bodyPart in bodyParts" :key="bodyPart.id">

        <!-- Clickable body part header row -->
        <button
          @click="toggleBodyPart(bodyPart.id)"
          class="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-800/40 transition-colors"
        >
          <span class="text-base font-semibold text-white">{{ bodyPart.name }}</span>
          <!-- Chevron rotates when expanded -->
          <svg
            class="w-5 h-5 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': expandedBodyPartId === bodyPart.id }"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Expanded content -->
        <div v-if="expandedBodyPartId === bodyPart.id" class="px-4 pb-4">

          <!-- Loading state -->
          <div v-if="isBodyPartLoading(bodyPart.id)" class="text-center py-8">
            <p class="text-gray-400 text-sm">Loading records...</p>
          </div>

          <!-- Empty state -->
          <div
            v-else-if="!recordsByBodyPart[bodyPart.id]?.length"
            class="text-center py-8"
          >
            <p class="text-gray-500 text-sm">No records yet for {{ bodyPart.name }}.</p>
            <p class="text-gray-600 text-xs mt-1">Log some workouts to see your progress here!</p>
          </div>

          <!-- Records table -->
          <table v-else class="min-w-full mt-2">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left text-xs font-medium uppercase text-gray-400 tracking-wider w-2/5">Exercise</th>
                <th class="p-3 text-left text-xs font-medium uppercase text-gray-400 tracking-wider w-1/5">Max Weight</th>
                <th class="p-3 text-left text-xs font-medium uppercase text-gray-400 tracking-wider w-1/5">Reps</th>
                <th class="p-3 text-left text-xs font-medium uppercase text-gray-400 tracking-wider w-1/5">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800 bg-gray-900">
              <tr
                v-for="record in recordsByBodyPart[bodyPart.id]"
                :key="record.exerciseId"
                class="hover:bg-gray-800/30 transition-colors"
              >
                <td class="p-3 text-sm font-medium text-white w-2/5">
                  <NuxtLink
                    :to="buildRoute.progressExercise(record.exerciseId)"
                    class="hover:underline"
                  >
                    {{ record.exerciseName }}
                  </NuxtLink>
                </td>
                <td class="whitespace-nowrap p-3 text-lg font-bold text-white w-1/5">
                  {{ record.maxWeight }} kg
                </td>
                <td class="whitespace-nowrap p-3 text-sm text-gray-300 w-1/5">
                  {{ record.maxReps }}
                </td>
                <td class="whitespace-nowrap p-3 text-sm text-gray-400 w-1/5">
                  {{ formatDate(record.achievedDate) }}
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>

  </CommonBasePage>
</template>

<script setup lang="ts">
import { buildRoute } from "~/constants/routes";
import { onMounted, ref } from "vue";

const { bodyParts, fetchBodyParts } = useBodyParts();
const { recordsByBodyPart, isBodyPartLoading, calculateRecordsForBodyPart } = useProgress();

const expandedBodyPartId = ref<string | null>(null);

onMounted(fetchBodyParts);

const toggleBodyPart = (bodyPartId: string) => {
  if (expandedBodyPartId.value === bodyPartId) {
    // Collapse if already open
    expandedBodyPartId.value = null;
  } else {
    expandedBodyPartId.value = bodyPartId;
    // Fetch on first open only — composable handles caching
    calculateRecordsForBodyPart(bodyPartId);
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
</script>
