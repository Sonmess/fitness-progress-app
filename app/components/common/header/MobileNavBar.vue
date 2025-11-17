<template>
  <CommonBaseNavBar class="mobile-nav-bar__c md:hidden">
    <li v-for="item in navBarList" :key="item.title">
      <LinkIcon :to="{ name: item.to }" :class="item.classes">
        <template #icon>
          <component :is="item.icon" />
        </template>
        {{ item.title }}
      </LinkIcon>
    </li>
  </CommonBaseNavBar>
</template>

<script setup lang="ts">
import ExerciseIcon from '~/components/icons/ExerciseIcon.vue';
import WorkoutsIcon from '~/components/icons/WorkoutsIcon.vue';
import ProgressIcon from '~/components/icons/ProgressIcon.vue';
import LinkIcon from '~/components/ui/navigation/LinkIcon.vue';

interface navigationItem {
  to: string;
  title: string;
  icon: Component;
  classes?: string;
}

const navBarList: navigationItem[] = [
  {
    to: 'exercises',
    title: 'Exercises',
    icon: ExerciseIcon,
    classes: '',
  },
  {
    to: 'workouts',
    title: 'Workouts',
    icon: WorkoutsIcon,
  },
  {
    to: 'progress',
    title: 'Progress',
    icon: ProgressIcon,
  },
];
</script>
