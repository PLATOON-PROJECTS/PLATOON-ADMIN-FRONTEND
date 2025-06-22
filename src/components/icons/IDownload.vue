<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Arrow down -->
    <path
      d="M12 3V15"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <path
      d="M6 12L12 18L18 12"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Base line -->
    <path
      d="M6 21H18"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup lang="ts">
// ✅ Props with defaults
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
