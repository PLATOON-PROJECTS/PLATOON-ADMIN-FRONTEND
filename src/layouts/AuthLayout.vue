<script lang="ts" setup>
import { ref } from "vue";
import AuthRightSlide from "../components/AuthRightSlide.vue";
import { useBrowserStore } from "../store";

const isClosedSlide = ref<boolean>(false);

const browserStore = useBrowserStore();
</script>
<template>
  <div class="lg:flex w-full h-screen select-none bg-white">
    <div class="pt-10.5" :class="[
      browserStore.isClosedAuthSide ? 'bg-width-animate w-full' : 'w-5.5/10',
    ]">
      <!-- auth main -->
      <div class="lg:px-32 text-black-100">
        <h3 class="font-extrabold text-3xl uppercase lg:px-0 px-4 ">
          <img src="/images/png/logo.png" alt="logo" class="w-[200px]">
        </h3>
        <!-- router port -->
        <router-view class="lg:px-0 px-4" />
        <!--  -->
      </div>
    </div>
    <!-- Left side -->
    <AuthRightSlide class="hidden lg:block  fixed right-0 h-screen" />
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
