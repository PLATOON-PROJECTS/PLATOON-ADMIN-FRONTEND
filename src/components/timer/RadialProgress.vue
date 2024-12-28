<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "../../store/index";

//initialize store
const userStore = useUserStore();

// props

// variables

const percent = ref(0);
const circumference = ref(10 * 2 * Math.PI);

const scrollProgress = () => {
  const timeOut = setInterval(() => {
    if (percent.value !== 100) {
      percent.value += Math.round(100 / 3);
      if (percent.value == 99) {
        percent.value = 100;
        userStore.error.value = false;
        userStore.error.message = null;
      }
    } else {
      clearInterval(timeOut);
    }
  }, 3000);
};
scrollProgress();

// props
const props = defineProps<{ color: string }>();
</script>

<template>
  <div>
    <component
      :is="'script'"
      src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/3.2.2/cdn.js"
      defer
    />
    <div>
      <!-- Circle -->
      <div class="rounded-full">
        <!-- Building a Progress Ring: https://css-tricks.com/building-progress-ring-quickly/ -->
        <svg class="w-10 h-10">
          <circle
            class="text-[#C4C4C4]"
            stroke-width="3"
            stroke="currentColor"
            fill="transparent"
            r="10"
            cx="20"
            cy="20"
          />
          <circle
            :class="color"
            stroke-width="3"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="circumference - (percent / 100) * circumference"
            stroke-linecap="round"
            stroke="currentColor"
            fill="transparent"
            r="10"
            cx="20"
            cy="20"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
