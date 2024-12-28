<script setup lang="ts">
import { useSlots, ref, inject } from "vue";

// initialize slot
const slot = useSlots();

// variables
const grades = ref<any>([]);

// methods
// const selectGrade = (grade: any) => {
//   if (typeof selectedGrade[0].value.grade !== "undefined") {
//     selectedGrade[0].value.grade = grade.id;
//   } else {
//     selectedGrade[0].value.grade_id = grade.id;
//   }

//   selectedGrade[1].value = grade.name;
//   showGrade.value = false;
// };
const selectGrade = (grade: any) => {
  selectedGrade[0].value.gradeId = grade.id; // Set gradeId
  selectedGrade[1].value = grade.name;
  showGrade.value = false;
};

const setGrade = () => {
  if (slot.default) {
    grades.value = JSON.parse(slot.default()[0].children as string);
  }
};

// provide and inject
const showGrade = inject<any>("showGrade");
let selectedGrade = inject<any>("selectedGrade");

setGrade();
</script>
<template>
  <div class="space-y-5 p-6 shadow-rgba bg-white text-sm font-bold rounded-lg">
    <div v-for="grade in grades" :key="grade.id" class="text-black">
      <p @click="selectGrade(grade)" class="cursor-pointer">{{ grade.name }}</p>
    </div>
  </div>
</template>

<style></style>
