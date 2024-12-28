<script setup lang="ts">
import { ref, useSlots } from "vue";
const slot = useSlots();
withDefaults(defineProps<{ textColor: string }>(), { textColor: "text-[#003b3d]" });
</script>
<template>
  <button
    class="flex items-center space-x-2.5 p-3 bg-red-100 text-white rounded-full px-4+1"
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
