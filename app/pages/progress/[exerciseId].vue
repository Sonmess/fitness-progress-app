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
      <h2>{{ exercise.bodyPartName }}</h2>
      <h3>{{ exercise.name }}</h3>
    </div>

    <div v-else class="p-8 text-center text-gray-400">
      No exercise found.
    </div>
  </CommonBasePage>
</template>

<script setup lang="ts">
import {ROUTE_NAMES} from '~/constants/routes';
import BackLink from "~/components/ui/navigation/BackLink.vue";
import {onMounted} from "vue";

const route = useRoute();
const { exercise, getExerciseById } = useExercises();
const exerciseId = route.params.exerciseId as string;

onMounted(() => {
  console.log(exerciseId);
  getExerciseById(exerciseId);
});
</script>

<style scoped>

</style>