<script setup lang="ts">
import { inject, provide, ref, watch } from "vue";
import { useRoute } from "vue-router";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import ButtonColorless from "../../../components/buttons/ButtonColorless.vue";
import CalenderInterface from "../../../layouts/CalenderLayout.vue";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../components/timer/Spinner.vue";
import { IIncDec, IMenuVertical, IUserThree } from "../../../core/icons";
import EmptyState from "../../../components/EmptyState.vue";
import { useRouter } from "vue-router";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import {
  usePensionStore,
  useUserStore,
  useEmployeeStore,
} from "../../../store/index";
import cache from "../../../composables/swr_cache";
import Departments from "../../../components/dropdowns/department.vue";

// initialize router
const router = useRouter();
// initialize route
const route = useRoute();

// initialize store
const pensionStore = usePensionStore();
const employeeStore = useEmployeeStore();
const userStore = useUserStore();

// variables

const showSuccess = ref(false);
const departmentName = ref("");
const showDepartment = ref(false);
const data = ref({ department: "" });
const loading = ref(false);
const isOpen = ref(false);
const enrolledData = ref<any>([]);
const responseData = ref<any>([]);
const successMessage = ref("Action successful");

// provide and inject
provide("showDepartment", showDepartment);
provide("selectedDepartment", [data, departmentName]);

// methods
const fetchEmployeeByDepartment = async () => {
  loading.value = true;
  const response = await request(
    employeeStore.employeesInDepartment(data.value.department),
    loading
  );

  handleError(response, userStore);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    enrolledData.value.length = 0;
    successResponse.data.data.forEach((data: any) => {
      data.meta.pension ? enrolledData.value.push(data) : "";
    });
    // console.log(successResponse.data);
  }
  data.value.department = "";
};
// const fetchEmployee = async () => {
//   loading.value = true;

//   const totalEnrolledPensionCache = cache("total_enrolled_pension");
//   if (typeof totalEnrolledPensionCache !== "undefined") {
//     // console.log(totalEnrolledPensionCache);
//     loading.value = false;
//     enrolledData.value = totalEnrolledPensionCache;
//   }

//   const response = await request(employeeStore.index(), loading);

//   const successResponse = handleSuccess(response);

//   if (successResponse && typeof successResponse !== "undefined") {
//     // console.log(successResponse.data);
//     enrolledData.value.length = 0;
//     successResponse.data.data.forEach((data: any) => {
//       data.meta.pension ? enrolledData.value.push(data) : "";
//     });

//     cache("total_enrolled_pension", enrolledData.value);

//     // console.log(successResponse.data);
//   }
// };
// fetchEmployee();

// watchers
watch(showDepartment, (newValue, oldValue) => {
  // console.log(newValue, oldValue);
  if (newValue !== oldValue && data.value.department != "") {
    fetchEmployeeByDepartment();
  }
});
</script>
<template>
  <div class="bg-white h-full relative rounded-lg py-6 space-y-5">
    <div class="px-5 py-2 flex justify-between">
      <div class="flex space-x-5">
        <div class="flex space-x-2">
          <span
            class="text-sm pt-1 font-semimedium text-black-200 whitespace-nowrap"
            >Enrolled Employees</span
          >
          <span class="pt-2">
            <IIncDec />
          </span>
        </div>
        <!--  -->
      </div>
    </div>

    <spinner
      v-if="loading == true"
      class="flex justify-center items-center lg:h-[400px] h-[300px]"
    />
    <div v-else>
      <div class="border-t border-grey">
        <div class="py-6">
          <div class="align-middle inline-block min-w-full">
            <div class="overflow-hidden sm:rounded-lg">
              <table class="min-w-full table-fixed">
                <thead class="text-black-200 text-sm text-left">
                  <tr class="whitespace-nowrap">
                    <th
                      scope="col"
                      class="py-4 font-normal text-left items-center space-x-3"
                    >
                      <span> Name </span>
                    </th>
                    <th scope=" col" class="py-4 font-normal text-left">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-grey-200">
                  <tr
                    v-for="(row, index) in 5"
                    :key="index"
                    class="text-black-100"
                  >
                    <td class="py-4 whitespace-nowrap">
                      <div class="flex items-center space-x-3">
                        <div class="flex flex-col">
                          <span class="text-sm font-semimedium"
                            >Ighayere Ehondor Jemima</span
                          >
                          <span class="text-xs text-gray-rgba-3"
                            >Software Engineering</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="py-4 whitespace-nowrap">
                      <div class="text-left flex flex-col">
                        <span class="text-sm font-semimedium"
                          >emailemployee@companyname.com</span
                        >
                      </div>
                    </td>

                    <!-- <td class="py-4 px-8 text-left whitespace-nowrap w-[18%]">
                      <div class="flex items-center gap-4 justify-between">
                        <button>
                          <IMenuVertical />
                        </button>
                      </div>
                    </td> -->
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- end of table -->
      <div
        v-if="enrolledData && enrolledData[0]"
        class="hidden justify-between lg:space-x-0 space-x-3 items-center px-6 text-sm text-gray-rgba-3 whitespace-nowrap"
      >
        <span class="whitespace-nowrap"> Showing 1-6 of 30 items</span>
        <div class="flex space-x-3">
          <div class="flex">
            <ButtonBlue>
              <template v-slot:placeholder>1</template>
            </ButtonBlue>
          </div>
          <div class="flex">
            <ButtonColorless>
              <template v-slot:placeholder>2</template>
            </ButtonColorless>
          </div>
          <div class="flex">
            <ButtonColorless>
              <template v-slot:placeholder>3</template>
            </ButtonColorless>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
