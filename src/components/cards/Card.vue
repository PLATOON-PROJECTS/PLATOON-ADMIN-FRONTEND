<script setup lang="ts">
import { useSlots } from "vue";
import { useRoute } from "vue-router";
// slots
const slot = useSlots();
// initialize route
const route = useRoute();

// props
withDefaults(
  defineProps<{
    activeColor: string;
    bgColor?: string;
    activeText: string;
    activeOtherInfoColor: string;
    activeIconBg: string;
  }>(),
  {
    activeColor: 'bg-white',
    bgColor: 'bg-white',
    activeText: 'text-black-rgba-100',
    activeOtherInfoColor: 'text-black',
    activeIconBg: 'bg-grey-100'
  }
);

</script>
<template>
  <div class="rounded-lg px-4 py-4 space-y-4 flex h-full flex-col justify-between" :class="[activeColor, activeText]">
    <div class="space-y-2.5">
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-base font-medium" :class="activeOtherInfoColor">
            <slot name="title"></slot>
          </span>
          <span class="text-sm font-normal">
            <slot name="text"></slot>
          </span>
        </div>
        <div v-if="slot.icon" class="p-1 rounded-full h-12 w-12 flex items-center justify-center" :class="activeIconBg">
          <slot name="icon"></slot>
        </div>
      </div>
      <div class="pb-4">
        <h3 class="font-bold text-2xl" :class="activeOtherInfoColor">
          <slot name="other-informations"></slot>
        </h3>
      </div>
    </div>
  </div>
</template>

<style>

</style>
