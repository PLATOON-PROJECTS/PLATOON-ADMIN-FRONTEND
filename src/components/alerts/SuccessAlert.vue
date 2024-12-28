<script lang="ts" setup>
import { ref, onMounted } from "vue";
import SuccessRadialAlert from "../timer/SuccessRadialProgress.vue";
// variable
const timer = ref(0);

// props
const props = defineProps<{ showSuccess: boolean }>();

// emits
const emit = defineEmits<{
  (event: "closeSuccess"): void;
}>();

// hooks
onMounted(() => {
  const timeOut = setInterval(() => {
    if (timer.value < 3) {
      timer.value += 1;
      // console.log(timer.value);
    }
    if (timer.value == 2) {
      emit("closeSuccess");
      clearInterval(timeOut);
    }
  }, 3000);
});
</script>
<template>
  <div class="bg-width-animate" v-if="props.showSuccess == true">
    <Transition
      name="success-slide"
      enter-active-class="animate__animated animate__fadeInUpBig"
      leave-active-class="animate__animated animate__fadeOutUpBig"
      :duration="400"
    >
      <div
        class="rounded-lg px-4 py-4 space-y-3 flex shadow-lg flex-col justify-between top-20 bg-white h-auto sm:mx-auto mx-4 sm:w-[30%] w-auto fixed z-[9999] inset-x-0"
      >
        <div class="">
          <span class="text-base font-medium">
            <slot name="title"> Success </slot>
          </span>
        </div>

        <div>
          <span class="text-xs font-normal text-[#1D1D1D]">
            <slot>Action was successful</slot>
          </span>
        </div>

        <div class="pb-4">
          <h3
            class="text-base text-green cursor-pointer font-medium flex items-center"
            @click="[$emit('closeSuccess'), (timer = 3)]"
          >
            <SuccessRadialAlert :timer="timer" />
            <slot name="otherMessage"> </slot>
          </h3>
        </div>
      </div>
    </Transition>
  </div>
</template>
<style scoped>
.bg-width-animate {
  -webkit-transition: width 1s ease-in-out;
  -moz-transition: width 1s ease-in-out;
  -o-transition: width 1s ease-in-out;
  transition: width 1s ease-in-out;
}
</style>
