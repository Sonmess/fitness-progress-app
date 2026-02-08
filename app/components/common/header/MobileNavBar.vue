<template>
  <CommonBaseNavBar class="mobile-nav-bar__c md:hidden">
    <li v-for="item in navBarList" :key="item.title">
      <LinkIcon :to="{ name: item.to }" :class="item.classes">
        <template #icon>
          <component :size="20" :is="item.icon" />
        </template>
        {{ item.title }}
      </LinkIcon>
    </li>
  </CommonBaseNavBar>
</template>

<script setup lang="ts">
import LinkIcon from '~/components/ui/navigation/LinkIcon.vue';
import { ROUTE_NAMES } from '~/constants/routes';
import {IconsCommonExerciseIcon, IconsCommonProgressIcon, IconsCommonWorkoutsIcon} from "#components";

interface navigationItem {
  to: string;
  title: string;
  icon: Component;
  classes?: string;
}

const navBarList: navigationItem[] = [
  {
    to: ROUTE_NAMES.EXERCISES,
    title: 'Exercises',
    icon: IconsCommonExerciseIcon,
  },
  {
    to: ROUTE_NAMES.WORKOUTS,
    title: 'Workouts',
    icon: IconsCommonWorkoutsIcon,
  },
  {
    to: ROUTE_NAMES.PROGRESS,
    title: 'Progress',
    icon: IconsCommonProgressIcon,
  },
];
</script>
