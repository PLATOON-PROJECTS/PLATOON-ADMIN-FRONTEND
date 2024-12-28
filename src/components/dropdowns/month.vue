<script setup lang="ts">
import { ref, inject } from "vue";
import moment from "moment";
// variables
const months = ref<string[]>([]);
months.value = [...moment.months()];
// provide and inject
const showMonth = inject<any>("showMonth");
const selectedMonth = inject<any>("selectedMonth");
// methods
const selectMonth = (month: string) => {
  selectedMonth.value = month;
  showMonth.value = false;
};
</script>
<template>
  <div class="space-y-5 p-6 shadow-rgba bg-white text-sm font-bold rounded-lg">
    <p class="text-[#003b3d]">All Months</p>
    <p v-for="month in months" :key="month" @click="selectMonth(month)">
      {{ month }}
    </p>
  </div>
</template>

<style></style>
