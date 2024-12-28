<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import SuccessRadialAlert from "../timer/SuccessRadialProgress.vue";
// variable
const timer = ref(0);

// props
const props = defineProps<{ showConfirm: boolean }>();

// emits
const emit = defineEmits<{
  (event: "closeConfirm"): void;
}>();

// hooks
let timeOut: any;

onMounted(() => {
  timeOut = setInterval(() => {
    if (timer.value < 3) {
      timer.value += 1;
      // console.log(timer.value);
    }
    if (timer.value == 2) {
      emit("closeConfirm");
      clearInterval(timeOut);
    }
  }, 3000);
});

onBeforeUnmount(() => {
  clearInterval(timeOut);
});
</script>
<template>
  <div class="bg-width-animate" v-if="props.showConfirm == true">
    <Transition
      name="confirm-slide"
      enter-active-class="animate__animated animate__fadeInUpBig"
      leave-active-class="animate__animated animate__fadeOutUpBig"
      :duration="400"
    >
      <div
        class="rounded-lg px-4 py-4 space-y-3 flex shadow-lg flex-col justify-between top-20 bg-white h-auto sm:mx-auto mx-4 sm:w-[30%] w-auto fixed z-[9999] inset-x-0"
      >
        <div class="">
          <span class="text-base font-medium"> 
           <slot name="title"></slot>
           </span>
        </div>

        <div>
          <span class="text-xs font-normal text-[#1D1D1D]">
            <slot name="message"></slot>
          </span>
        </div>

        <div class="pb-4 flex space-x-6">
          <h3
            class="text-base text-[#003b3d] font-medium flex items-center cursor-pointer"
          >
            <SuccessRadialAlert :timer="timer" color="text-[#003b3d]" />
            <slot
              name="confirm"
              @click="[$emit('closeConfirm'), (timer = 3)]"
            ></slot>
          </h3>

          <h3
            class="text-base text-[#003b3d] font-medium flex items-center cursor-pointer"
            @click="[$emit('closeConfirm'), (timer = 3)]"
          >
            CANCEL
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
