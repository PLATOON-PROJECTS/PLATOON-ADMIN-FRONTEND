<script setup lang="ts">
import { ref, inject } from "vue";
// variables

// provide and inject
const showState = inject<any>("showState");
let selectedState = inject<any>("selectedState");
// methods
const selectState = (state: string) => {
  selectedState.value = state;
  showState.value = false;
  // console.log(selectedState);
};
const states = ref([
  "FederalCapitalTerritory",
  "Abia",
  "Adamawa",
  "AkwaIbom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "CrossRiver",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nassarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
]);
</script>
<template>
  <div
    class="space-y-5 p-6 shadow-rgba bg-white text-sm cursor-pointer font-bold rounded-lg"
  >
    <p v-for="state in states" :key="state" @click="selectState(state)">
      {{ state }}
    </p>
  </div>
</template>
