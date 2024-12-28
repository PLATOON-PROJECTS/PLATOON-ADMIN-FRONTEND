<script setup lang="ts">
import { ref, useSlots } from "vue";

const slot = useSlots();
</script>
<template>
  <button
    class="flex items-center cursor-pointer space-x-2.5 border border-[#003b3d] rounded-full p-3 flex-shrink-0"
  >
    <span class="font-medium text-sm text-[#003b3d]">
      <slot name="placeholder"></slot>
    </span>
    <span v-if="slot.icon">
      <slot name="icon"></slot>
    </span>
  </button>
</template>

<style></style>
