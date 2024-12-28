<script lang="ts" setup>
import { ref } from "vue";
import { useBrowserStore } from "../store";
import IClose from "./icons/IClose.vue";
import { useRouter, useRoute } from "vue-router";

const browserStore = useBrowserStore();
const route = useRoute();

const updateClosedSlide = () => {
  browserStore.isClosedAuthSide = !browserStore.isClosedAuthSide;
};
</script>
<template>
  <Transition
    name="login-slide-2"
    enter-active-class="animate__animated animate__fadeInRight"
    leave-active-class="animate__animated animate__fadeOutRight"
    :duration="400"
  >
    <div
      v-if="
        !browserStore.isClosedAuthSide &&
        route.name !== 'auth.forgotten' &&
        route.name !== 'auth.change'
      "
      class="w-4.5/10 p-18 bg-[#003b3d] bg-slide-carousel-image"
    >
      <!-- carousel -->
      <div class="text-white pr-40 mt-60">
        <h2 class="text-3xl font-medium">
          Welcome to the Platoon Admin Portal
        </h2>
        <p>
          your gateway to seamless collaboration and efficient payroll
          management.
        </p>
      </div>

      <!-- close icon -->
      <button
        @click="updateClosedSlide()"
        class="bg-white rounded-full absolute top-12 right-12 p-3"
      >
        <IClose />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.bg-slide-carousel-image {
  background-image: url("/images/svg/eclipseLeft.svg");
  background-repeat: no-repeat;
  background-position: top right;
}
</style>
