<template>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="7"
      width="20"
      height="15"
      rx="2"
      ry="2"
      fill="none"
      stroke="#3A3541"
      stroke-opacity="0.87"
    />
    <path
      d="M2 7h20M2 7v-2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2"
      fill="none"
      stroke="#3A3541"
      stroke-opacity="0.87"
    />
    <line
      x1="8"
      y1="12"
      x2="16"
      y2="12"
      stroke="#3A3541"
      stroke-opacity="0.87"
      stroke-width="2"
    />
    <line
      x1="12"
      y1="8"
      x2="12"
      y2="16"
      stroke="#3A3541"
      stroke-opacity="0.87"
      stroke-width="2"
    />
  </svg>
</template>
<script lang="ts" setup>
withDefaults(defineProps<{ color?: string }>(), {
  color: "#626669",
});
</script>
