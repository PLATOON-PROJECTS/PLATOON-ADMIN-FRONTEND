<script setup lang="ts">
import { ref, useSlots } from "vue";
const slot = useSlots();
// enum Type {Submit='submit',Reset='reset',Button='button'}
const props=withDefaults(defineProps<{ textColor?: string,type?:any}>(), { textColor: "text-[#003b3d]",type:'button'});
</script>
<template>
  <button
  :type="props.type"
    class="flex items-center space-x-2.5 p-3 focus-pointer bg-[#003b3d41] truncate ... rounded-full px-4+1 flex-shrink-0"
  >
    <span class="font-medium text-sm" :class="textColor">
      <slot name="placeholder"></slot>
    </span>
    <span v-if="slot.icon">
      <slot name="icon"></slot>
    </span>
  </button>
</template>

<style></style>
