<template>
  <CommonBasePage
    title="Exercise progress"
  >
    <template #icon>
      <IconsCommonProgressIcon class="relative top-[2px]" />
    </template>

    <template #navigation>
      <BackLink :routeName="ROUTE_NAMES.PROGRESS">Back to progress</BackLink>
    </template>

    <div v-if="exercise" class="main-container flex flex-col gap-4">
      <h2 class="text-center text-xl font-medium text-indigo-400 hover:underline">
        <NuxtLink :to="buildRoute.exerciseDetail(exerciseId)">
          {{ exercise.name }}
        </NuxtLink>
      </h2>

      <UiNavigationBaseTabs
          v-model="selectedTab"
          :tabs="[
            {label: 'Table', value: 'table', icon: IconsCommonTableIcon },
            {label: 'Graph', value: 'graph', icon: IconsCommonGraphIcon },
          ]"
      />

      <div class="tabs-content">
        <div class="tab-content" v-if="selectedTab === 'table'">
          <ProgressTable :exerciseId="exerciseId" />
        </div>

        <div class="tab-content" v-else>
          <ProgressGraph />
        </div>
      </div>
    </div>

    <div v-else class="p-8 text-center text-gray-400">
      No exercise found.
    </div>
  </CommonBasePage>
</template>

<script setup lang="ts">
import {ROUTE_NAMES, buildRoute} from '~/constants/routes';
import BackLink from "~/components/ui/navigation/BackLink.vue";
import {onMounted, ref} from "vue";
import type {Exercise} from "~/types";
import {IconsCommonGraphIcon, IconsCommonTableIcon} from "#components";

const route = useRoute();
const router = useRouter();
const { exercise, getExerciseById } = useExercises();
const exerciseId = route.params.exerciseId as string;
const selectedTab = ref<'table' | 'graph'>('table');

onMounted(async () => {
  const currentExercise = await getExerciseById(exerciseId);
  redirectNotFound(currentExercise);
});

const redirectNotFound = (exercise: Exercise | null): void => {
  if (!exercise) {
    console.log("Exercise not found");
    router.push({name: ROUTE_NAMES.PROGRESS});
  }
}
</script>