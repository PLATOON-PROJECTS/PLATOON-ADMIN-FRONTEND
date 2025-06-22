<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- File outline -->
    <path
      d="M14 2H6C5.44772 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V8L14 2Z"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Folded corner -->
    <path
      d="M14 2V8H19"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Text lines -->
    <path
      d="M8 13H16"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <path
      d="M8 17H16"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup lang="ts">
// Allow props for flexibility
withDefaults(
  defineProps<{
    color?: string;
    size?: number | string;
  }>(),
  {
    color: "#1F1F1F",
    size: 24,
  }
);
</script>
