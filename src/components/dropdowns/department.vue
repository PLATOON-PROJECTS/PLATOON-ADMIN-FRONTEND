<script setup lang="ts">
import { provide, ref, inject } from "vue";
import { useGroupStore, useUserStore } from "../../store/index";
import { request } from "../../composables/request.composable";
import handleError from "../../composables/handle_error.composable";
import handleSuccess from "../../composables/handle_success.composable";
import cache from "../../composables/swr_cache";
import { getItem } from "../../core/utils/storage.helper";

// initialize store
const groupStore = useGroupStore();
const userStore = useUserStore();

// variables
const departments = ref<any>([]);
const stateMessage = ref<string>("");
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));

const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;


// Access the organisationId safely
const organisationId = parsedUserInfo?.customerInfo?.organisationId
console.log("~~~~~~~~~~~~~:", organisationId);
// emits
const emit = defineEmits<{ (e: "setGrades", grades: any[]): void }>();

// provide and inject
const showDepartment = inject<any>("showDepartment");
let selectedDepartment = inject<any>("selectedDepartment");

// methods
// const selectDepartment = (department: any) => {
//   // console.log(selectedDepartment[0].value.department,selectedDepartment[0].value.group_id );
//   if (typeof selectedDepartment[0].value.department !== "undefined") {
//     selectedDepartment[0].value.department = department.id;
//   } else {
//     selectedDepartment[0].value.group_id = department.id;
//   }

//   selectedDepartment[1].value = department.name;
//   showDepartment.value = false;
  

//   emit("setGrades", department.grades);
// };
const selectDepartment = (department: any) => {
  selectedDepartment[0].value.departmentId = department.id; // Set departmentId
  selectedDepartment[1].value = department.name;
  showDepartment.value = false;

  emit("setGrades", department.grades);
};


const getDepartments = async () => {
  const cachedData = cache("departments");
  console.log("cachedData-----",cachedData)

  if (typeof cachedData !== "undefined") {
    departments.value = cachedData;
  }

  const response = await request(groupStore.index(organisationId, 10, 1));

  // handleError(response, userStore);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);

    departments.value = successResponse.data.data.pageItems;

    cache("departments", successResponse.data.data.pageItems);
    // console.log(departments.value);
  } else {
    stateMessage.value = "You do not have any departments at the moment";
  }
};

getDepartments();
</script>

<template>
  <div
    class="space-y-5 p-6 shadow-rgba text-black bg-white text-sm font-bold rounded-lg w-auto"
  >
    <div v-if="departments[0]">
      <div v-for="department in departments" :key="department.id">
        <p @click="selectDepartment(department)" class="cursor-pointer">
          {{ department.name }}
        </p>
      </div>
    </div>
    <p v-else class="text-sm text-black text-center">
      {{ stateMessage }}
    </p>
  </div>
</template>

<style></style>
