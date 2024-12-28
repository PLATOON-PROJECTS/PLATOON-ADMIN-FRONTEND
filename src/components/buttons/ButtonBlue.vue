<script setup lang="ts">
import { useSlots } from "vue";

// slots
const slot = useSlots();

const props = withDefaults(defineProps<{ disabled?: boolean }>(), {
  disabled: false,
});
</script>
<template>
  <button
    :disabled="props.disabled"
  
    class="flex items-center cursor-pointer space-x-2.5 bg-[#003b3d] p-3 rounded-full px-4+1 flex-shrink-0"
    :class="props.disabled == true ? 'disabled:opacity-75' : ' '"
  >
    <span class="font-medium text-sm text-white">
      <slot name="placeholder"></slot>
    </span>
    <span v-if="slot.icon">
      <slot name="icon"></slot>
    </span>
  </button>
</template>

<style></style>
