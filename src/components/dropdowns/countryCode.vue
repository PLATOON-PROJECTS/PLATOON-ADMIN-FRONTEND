<script setup lang="ts">
import { ref, inject } from "vue";

// Provide and inject
const showCountryCode = inject<any>("showCountryCode");
let selectedCountryCode = inject<any>("selectedCountryCode");

// Method to select country code
const selectCountryCode = (countryCode: string) => {
  selectedCountryCode.value = countryCode;
  showCountryCode.value = false;
};

// List of countries and their codes
const countryCodes = ref([
  { name: "United States", code: "+1" },
  { name: "Canada", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Australia", code: "+61" },
  { name: "Germany", code: "+49" },
  { name: "France", code: "+33" },
  { name: "India", code: "+91" },
  { name: "Nigeria", code: "+234" },
  { name: "South Africa", code: "+27" },
  // Add more countries as needed
]);
</script>

<template>
  <div class="space-y-5 p-6 shadow-rgba bg-white text-sm cursor-pointer font-bold rounded-lg">
    <p v-for="country in countryCodes" :key="country.code" @click="selectCountryCode(country.code)">
      {{ country.name }} ({{ country.code }})
    </p>
  </div>
</template>

<style scoped>
/* Add any specific styles here */
</style>
