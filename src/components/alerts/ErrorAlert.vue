<template>
    <div class="bg-width-animate" v-if="props.showError">
      <Transition
        name="error-slide"
        enter-active-class="animate__animated animate__fadeInUpBig"
        leave-active-class="animate__animated animate__fadeOutUpBig"
        :duration="400"
      >
        <div
          class="rounded-lg px-4 py-4 space-y-3 flex shadow-lg flex-col justify-between top-20 bg-white h-auto sm:mx-auto mx-4 sm:w-[30%] w-auto fixed z-[9999] inset-x-0"
        >
          <div>
            <span class="text-base font-medium text-red-600">
              <slot name="title">Error</slot>
            </span>
          </div>
  
          <div>
            <span class="text-xs font-normal text-[#1D1D1D]">
              <slot>Error occurred while processing your request.</slot>
            </span>
          </div>
  
          <div class="pb-4">
            <h3
              class="text-base text-red-600 cursor-pointer font-medium flex items-center"
              @click="[$emit('closeError'), (timer = 3)]"
            >
              <SuccessRadialAlert :timer="timer" />
              <slot name="otherMessage">CLOSE</slot>
            </h3>
          </div>
        </div>
      </Transition>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from "vue";
  import SuccessRadialAlert from "../timer/SuccessRadialProgress.vue";
  
  // props
  const props = defineProps<{ showError: boolean }>();
  
  // emits
  const emit = defineEmits<{
    (event: "closeError"): void;
  }>();
  
  // variable
  const timer = ref(0);
  
  // hooks
  onMounted(() => {
    const timeOut = setInterval(() => {
      if (timer.value < 3) {
        timer.value += 1;
      }
      if (timer.value === 2) {
        emit("closeError");
        clearInterval(timeOut);
      }
    }, 3000);
  });
  </script>
  
  <style scoped>
  .bg-width-animate {
    transition: width 1s ease-in-out;
  }
  </style>
  