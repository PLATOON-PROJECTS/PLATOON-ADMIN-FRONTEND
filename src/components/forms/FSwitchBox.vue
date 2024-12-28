<script setup lang="ts">
import { PropsExpression } from "@vue/compiler-core";
import { ref } from "vue";
// props
const props = defineProps<{ id: string; value: boolean }>();

// emits
const emit = defineEmits<{ (e: "set-value", value: boolean): void }>();

</script>

<template>
  <label :for="id" class="items-center cursor-pointer relative mb-4">
    <input
      type="checkbox"
      :id="id"
      class="sr-only"
      :checked="props.value ? props.value : false"
      @change="emit('set-value',!props.value)"
    />
   
    <div
      class="toggle-bg bg-black-200 border-none border-gray-200 h-7 w-12 rounded-full"
    ></div>
  </label>

</template>

<style scoped>
.toggle-bg:after {
  content: "";
  @apply absolute lg:top-[11%] md:top-[10%] top-[4.2%] left-[17%] bg-white  rounded-full h-4 w-4 transition shadow-sm;
}

input:checked + .toggle-bg:after {
  transform: translateX(100%);
  @apply bg-white;
}

input:checked + .toggle-bg {
  @apply bg-[#003b3d];
}
</style>
