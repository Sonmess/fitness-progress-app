<template>
  <svg
    :width="computedSize"
    :height="computedSize"
    :viewBox="viewBox"
    :fill="fill"
    :stroke="stroke"
    :stroke-width="strokeWidth"
    :class="['inline-block', className]"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- Child icons pass their paths via default slot -->
    <slot />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  /**
   * Size of the icon (width and height)
   * Can be a number (px) or string with units
   * @default 24
   */
  size?: number | string;

  /**
   * SVG viewBox attribute
   * @default "0 0 24 24"
   */
  viewBox?: string;

  /**
   * Fill color (use "currentColor" to inherit from parent)
   * @default "currentColor"
   */
  fill?: string;

  /**
   * Stroke color (for outline icons)
   * @default "none"
   */
  stroke?: string;

  /**
   * Stroke width (for outline icons)
   * @default 0
   */
  strokeWidth?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  stroke: 'none',
  strokeWidth: 0,
  className: '',
});

/**
 * Computed size value - handles both number and string
 */
const computedSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});
</script>
