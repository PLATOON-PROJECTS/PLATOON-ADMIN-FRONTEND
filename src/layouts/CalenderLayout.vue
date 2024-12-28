<script setup lang="ts">
import moment from "moment";
import { ref, provide } from "vue";
import date from "../components/dropdowns/date.vue";
import month from "../components/dropdowns/month.vue";
import year from "../components/dropdowns/year.vue";
// variables
const showMonth = ref(false);
const showYear = ref(false);
const selectedYear = ref<number>(moment().year());
const selectedMonth = ref<string>(moment().format("MMMM"));
// provide and reject
provide("showMonth", showMonth);
provide("showYear", showYear);
provide("selectedMonth", selectedMonth);
provide("selectedYear", selectedYear);
</script>
<template>
  <div class="flex space-x-4 absolute  z-50 bottom-0">
    <div>
      <component
        :is="date"
        :data="{ year: selectedYear, month: selectedMonth }"
      ></component>
    </div>
    <div class="flex space-x-6">
      <div><component :is="month" v-if="showMonth == true"></component></div>
      <div>
        <component :is="year" class="" v-if="showYear == true"></component>
      </div>
    </div>
  </div>
</template>

<style></style>
