<script lang="ts" setup>
import RadialProgress from "../timer/RadialProgress.vue";
import { useUserStore } from "../../store/index";

//initialize store
const userStore = useUserStore();
// props

const props = defineProps<{ errorBody: any }>();
</script>

<template>
  <div
    class="rounded-lg px-4 py-4 space-y-3 flex h-full flex-col justify-between"
  >
    <div class="">
      <span class="text-base font-medium">
        {{ errorBody.bigTimeTechError.title }}
      </span>
    </div>

    <div>
      <span class="text-xs font-normal text-[#1D1D1D]">
        <slot name="body"> {{ userStore.error.message }}</slot>
      </span>
    </div>

    <div class="">
      <div
        class="text-base font-medium flex"
        @click="userStore.error.value = false"
      >
        <RadialProgress :color="errorBody.bigTimeTechError.color" />
        <span :class="errorBody.bigTimeTechError.color" class="mt-2"
          >DISMISS</span
        >
      </div>
    </div>
  </div>
</template>
