<template>
  <div
    class="exercise-card__c block rounded-lg bg-gray-800 shadow-lg overflow-hidden relative"
  >
    <!-- Card Content -->
    <div class="exercise-card__w flex flex-col gap-2 p-3">
      <!-- Header with Title and Image Button -->
      <div class="exercise-card__headline flex justify-between items-start">
        <h3 class="text-lg font-semibold text-white leading-tight">
          {{ exercise.name }}
        </h3>

        <UiButtonsShowPictureBtn
          @show-picture-clicked="isImageVisible = true"
        />
      </div>

      <div class="exercise-card__misc flex flex-row gap-2 items-center">
        <UiBadgesRoundBadge class="px-2 py-0.5 bg-indigo-600 text-white"
          >{{ exercise.bodyPartName }}
        </UiBadgesRoundBadge>

        <UiBadgesRoundBadge class="px-2 py-0.5">
          {{ exercise.equipment || "Bodyweight" }}
        </UiBadgesRoundBadge>
      </div>

      <p
        v-if="exercise.description"
        class="exercise-card__desc text-xs text-gray-400"
      >
        {{ exercise.description }}
      </p>

      <UiButtonsLinkBtn
        v-if="showDetailButton"
        :to="{ name: 'exercises-id', params: { id: exercise.id } }"
        class="mt-2 pt-4 border-t border-gray-700"
        >View detail
      </UiButtonsLinkBtn>
    </div>

    <UiTransitionsSlideInOverlay
      :is-open="isImageVisible"
      @click="isImageVisible = false"
    >
      <img
        v-if="exercise.imageUrl"
        :src="exercise.imageUrl"
        class="w-full h-full object-cover"
      />
      <UiBlanksBlankImage v-else class="w-full h-full text-white" />
    </UiTransitionsSlideInOverlay>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Exercise } from "~/types";

export interface ExerciseCardProps {
  exercise: Exercise;
  showDetailButton?: boolean;
}

const props = withDefaults(defineProps<ExerciseCardProps>(), {
  showDetailButton: true,
});

const isImageVisible = ref(false);
</script>
