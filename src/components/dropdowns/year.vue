<script setup lang="ts">
import { ref, inject } from "vue";
import moment from "moment";
// variables
const years = ref<number[]>([2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]);
// provide and inject
const showYear = inject<any>("showYear");
const selectedYear = inject<any>("selectedYear");
// methods
const selectYear = (year: number) => {
  selectedYear.value = year;
  showYear.value = false;
};
</script>
<template>
  <div
    class="space-y-5 p-6 h-auto shadow-rgba bg-white text-sm font-bold rounded-lg"
  >
    <p v-for="year in years" :key="year" @click="selectYear(year)">
      {{ year }}
    </p>
  </div>
</template>

<style></style>
