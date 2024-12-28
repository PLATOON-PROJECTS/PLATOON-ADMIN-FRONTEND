<script setup lang="ts">
import { ref, inject } from "vue";
// variables

// provide and inject
const showIndustries = inject<any>("showIndustries");
let selectedIndustries = inject<any>("selectedIndustries");
// methods
const selectIndustries = (Industry: string) => {
    selectedIndustries.value = Industry;
  showIndustries.value = false;
  // console.log(selectedState);
};
const Industries = ref([
    "Agriculture and Farming",
    "Aerospace and Defense",
    "Automotive",
    "Banking and Finance",
    "Biotechnology and Pharmaceuticals",
    "Chemicals",
    "Construction and Real Estate",
    "Consumer Goods and Retail",
    "Education",
    "Energy (Oil, Gas, Renewable)",
    "Entertainment and Media",
    "Food and Beverage",
    "Healthcare and Medical Devices",
    "Hospitality and Tourism",
    "Information Technology (IT)",
    "Insurance",
    "Manufacturing",
    "Mining and Metals",
    "Non-profit and Social Services",
    "Professional Services (Consulting, Legal, Accounting)",
    "Telecommunications",
    "Transportation and Logistics",
    "Utilities (Electricity, Water, etc.)",
    "E-commerce and Online Retail",
    "Gaming and Esports",
    "Environmental Services",
    "Fitness and Wellness",
    "Space Industry",
    "Artificial Intelligence (AI) and Machine Learning",
    "Virtual Reality (VR) and Augmented Reality (AR)",
    "Robotics and Automation",
    "Fashion and Apparel",
    "Social Media and Digital Marketing",
    "Architecture and Design",
    "Sports and Recreation",
    "Pharmaceutical Research and Development",
    "Nanotechnology",
    "Internet of Things (IoT)",
    "3D Printing and Additive Manufacturing",
    "Renewable Energy",
    "Green Technology and Sustainability",
    "Cybersecurity",
    "Cryptocurrency and Blockchain",
    "Space Tourism",
    "Genetic Engineering and Genomics",
]);
</script>
<template>
  <div
    class="space-y-5 p-6 shadow-rgba bg-white text-sm cursor-pointer font-bold rounded-lg"
  >
    <p v-for="Industry in Industries" :key="Industry" @click="selectIndustries(Industry)">
      {{ Industry }}
    </p>
  </div>
</template>
