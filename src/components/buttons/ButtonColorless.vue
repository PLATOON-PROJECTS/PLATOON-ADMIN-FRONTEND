<script setup lang="ts">
import { ref, useSlots } from "vue";
// slots
const slot = useSlots();
</script>
<template>
  <button
    class="flex items-center space-x-2.5 border border-gray-rgba-3 rounded-full px-4+1 flex-shrink-0"
  >
    <span class="font-medium text-sm">
      <slot name="placeholder"></slot>
    </span>
    <span v-if="slot.icon">
      <slot name="icon"></slot>
    </span>
  </button>
</template>

<style></style>
