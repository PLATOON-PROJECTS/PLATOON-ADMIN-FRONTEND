<script lang="ts" setup>
import * as errorBody from "../constants/ErrorBody";
import { useUserStore } from "../store/index";

//initialize store
const userStore = useUserStore();
</script>

<template>
  <div
    v-if="userStore.error.value == true"
    class="relative z-[99999]"
  aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

    <component
      :is="userStore.error.type"
      :errorBody="errorBody"
      class="z-10 top-20 bg-white !h-[220px] sm:mx-auto mx-4 sm:w-[30%] w-auto fixed inset-x-0"
    ></component>
  </div>
</template>
