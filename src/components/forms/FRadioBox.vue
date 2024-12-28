<script lang="ts" setup>
import { ref } from "vue";

// props
const props = defineProps<{
  id: any;
  value: any;
  name: string;
  checked?: boolean;
}>();

// emits
const emit = defineEmits<{ (e: "set-value", value: string): void }>();
</script>

<template>
  <input
    @change="emit('set-value', props.value)"
    type="radio"
    :id="props.id"
    :name="props.name"
    :value="props.value"
    :checked="props.checked ? props.checked : false"
    class="radio radio-sm radio-primary rounded-full"
  />
</template>
