<template>
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- File shape -->
    <path
      d="M6.875 2.75H12.375L17.1875 7.5625V17.1875C17.1875 17.6293 17.012 18.0536 16.7001 18.3655C16.3881 18.6775 15.9639 18.853 15.5221 18.853H6.875C6.43323 18.853 6.00895 18.6775 5.697 18.3655C5.38505 18.0536 5.2095 17.6293 5.2095 17.1875V4.41667C5.2095 3.9749 5.38505 3.55062 5.697 3.23867C6.00895 2.92672 6.43323 2.75117 6.875 2.75117V2.75Z"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-opacity="1"
    />
    <!-- Folded corner -->
    <path
      d="M12.375 2.75V7.5625H17.1875"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-opacity="1"
    />
    <!-- Clock circle -->
    <circle
      cx="11"
      cy="13.75"
      r="3"
      :stroke="color"
      stroke-width="1.5"
      stroke-opacity="1"
    />
    <!-- Clock hands -->
    <path
      d="M11 12.25V13.75L12 14.75"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-opacity="1"
    />
  </svg>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ color?: string }>(), {
  color: "#626669",
});
</script>
