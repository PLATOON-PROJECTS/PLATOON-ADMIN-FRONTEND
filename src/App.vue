<script setup lang="ts">
import ErrorLayout from "./layouts/ErrorLayout.vue";
</script>

<template>
  <div class="relative bg-width-animate">
    <Transition
      name="error-slide"
      enter-active-class="animate__animated animate__fadeInDownBig"
      leave-active-class="animate__animated animate__fadeOutUpBig"
      :duration="400"
    >
      <ErrorLayout />
    </Transition>
    <router-view />
  </div>
</template>

<style scoped>
html,
body {
  @apply bg-grey-100;
}

.bg-width-animate {
  -webkit-transition: width 1s ease-in-out;
  -moz-transition: width 1s ease-in-out;
  -o-transition: width 1s ease-in-out;
  transition: width 1s ease-in-out;
}
</style>
