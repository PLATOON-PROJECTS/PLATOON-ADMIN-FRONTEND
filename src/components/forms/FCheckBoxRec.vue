<script setup lang="ts">
import { ref, withDefaults } from "vue";

// variables
const props = withDefaults(defineProps<{ value: boolean }>(), { value: false });
const state = ref(false);
</script>

<template>
  <div>
    <input
      v-model="props.value"
      type="checkbox"
      @click="$emit('changeState')"
      class="checkbox checkbox-sm checkbox-success rounded-sm"
    />
  </div>
</template>
