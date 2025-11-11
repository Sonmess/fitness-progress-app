<template>
  <div>
    <NuxtLink :to="to" :class="buttonClasses">
      <!-- The <slot> allows the parent to define the button text -->
      <slot />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { NuxtLinkProps } from "#app";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    // Accept any valid NuxtLink 'to' prop
    to: NuxtLinkProps["to"];
    variant?: "primary" | "secondary" | "danger";
  }>(),
  {
    variant: "primary",
  }
);

const buttonClasses = computed(() => {
  const base = [
    "inline-block",
    "w-full",
    "text-center",
    "rounded-md",
    "px-3.5",
    "py-2.5",
    "text-sm",
    "font-semibold",
    "shadow-sm",
    "focus-visible:outline",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-2",
  ];

  switch (props.variant) {
    case "secondary":
      return [
        ...base,
        "bg-gray-700",
        "text-white",
        "hover:bg-gray-500",
        "focus-visible:outline-2",
        "focus-visible:outline-offset-2",
      ];
    case "danger":
      return [
        ...base,
        "bg-red-600",
        "text-white",
        "hover:bg-red-500",
        "focus-visible:outline-red-600",
      ];
    case "primary":
    default:
      return [
        ...base,
        "bg-indigo-600",
        "text-white",
        "hover:bg-indigo-500",
        "focus-visible:outline-indigo-600",
      ];
  }
});
</script>
