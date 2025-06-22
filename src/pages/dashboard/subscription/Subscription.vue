<script setup lang="ts">
import { provide, ref, watch } from "vue";
import { useRoute } from "vue-router";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import ButtonColorless from "../../../components/buttons/ButtonColorless.vue";
import spinner from "../../../components/timer/Spinner.vue";
import { IChartBar } from "../../../core/icons";
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
const fetchEmployee = async () => {
  loading.value = true;

  const totalEnrolledPensionCache = cache("total_enrolled_pension");
  if (typeof totalEnrolledPensionCache !== "undefined") {
    // console.log(totalEnrolledPensionCache);
    loading.value = false;
    enrolledData.value = totalEnrolledPensionCache;
  }

  const response = await request(employeeStore.index(), loading);

  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);
    enrolledData.value.length = 0;
    successResponse.data.data.forEach((data: any) => {
      data.meta.pension ? enrolledData.value.push(data) : "";
    });

    cache("total_enrolled_pension", enrolledData.value);

    // console.log(successResponse.data);
  }
};
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
  <div class="h-full relative rounded-lg py-6 space-y-5">
    <spinner
      v-if="loading == true"
      class="flex justify-center items-center lg:h-[400px] h-[300px]"
    />
    <div v-else>
      <div class="px-6">
        <div class="py-6 flex flex-col gap-4">
          <h1 class="text-2xl font-medium">Subscription</h1>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <div class="flex flex-col gap-2 bg-white rounded-lg p-4 shadow-sm">
              <div class="flex items-center justify-between">
                <p class="text-base font-medium text-black">
                  Existing Subscribers
                </p>
                <span
                  class="h-10 w-10 flex justify-center items-center rounded-full bg-[#F6F7F9]"
                >
                  <IChartBar />
                </span>
              </div>
              <p class="text-sm text-[#000000AD]">
                Total number of existing subscribers
              </p>
              <h3 class="text-2xl font-bold text-black">1,234</h3>
            </div>
            <div class="flex flex-col gap-2 bg-white rounded-lg p-4 shadow-sm">
              <div class="flex items-center justify-between">
                <p class="text-base font-medium text-black">New Subscribers</p>
                <span
                  class="h-10 w-10 flex justify-center items-center rounded-full bg-[#F6F7F9]"
                >
                  <IChartBar />
                </span>
              </div>
              <p class="text-sm text-[#000000AD]">
                Total number of existing subscribers
              </p>
              <h3 class="text-2xl font-bold text-black">567</h3>
            </div>
            <div class="flex flex-col gap-2 bg-white rounded-lg p-4 shadow-sm">
              <div class="flex items-center justify-between">
                <p class="text-base font-medium text-black">
                  Monthly Subscribers
                </p>
                <span
                  class="h-10 w-10 flex justify-center items-center rounded-full bg-[#F6F7F9]"
                >
                  <IChartBar />
                </span>
              </div>
              <p class="text-sm text-[#000000AD]">
                Total number of existing subscribers
              </p>
              <h3 class="text-2xl font-bold text-black">₦8,000,000</h3>
            </div>
            <div class="flex flex-col gap-2 bg-white rounded-lg p-4 shadow-sm">
              <div class="flex items-center justify-between">
                <p class="text-base font-medium text-black">
                  Yearly Subscribers
                </p>
                <span
                  class="h-10 w-10 flex justify-center items-center rounded-full bg-[#F6F7F9]"
                >
                  <IChartBar />
                </span>
              </div>
              <p class="text-sm text-[#000000AD]">
                Total number of existing subscribers
              </p>
              <h3 class="text-2xl font-bold text-black">23</h3>
            </div>
          </div>
          <div class="align-middle inline-block min-w-full">
            <div class="bg-white overflow-hidden sm:rounded-xl p-4">
              <div class="flex flex-col gap-2">
                <h2 class="text-lg font-semibold text-black-100">
                  Subscribers
                </h2>
                <p class="text-sm font-medium text-[#626669A3]">
                  Subscription period:
                  <span class="font-bold text-black">Apr 1 - Apr 30, 2022</span>
                </p>
              </div>
              <table class="min-w-full table-fixed">
                <thead class="text-black-200 text-sm text-left">
                  <tr class="whitespace-nowrap">
                    <th
                      scope="col"
                      class="py-4 font-normal text-left items-center space-x-3"
                    >
                      <span> Company </span>
                    </th>
                    <th scope=" col" class="py-4 font-normal text-left">
                      Plan
                    </th>
                    <th scope="col" class="py-4 font-normal text-left">
                      Amount
                    </th>
                    <th scope="col" class="py-4 font-normal text-left">
                      Duration
                    </th>
                    <th scope="col" class="py-4 font-normal text-left">
                      Start Date
                    </th>
                    <th scope="col" class="py-4 font-normal text-left">
                      Expiration Date
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
                            >MTN Nigeria</span
                          >
                          <span class="text-xs text-gray-rgba-3"
                            >company@mtnnigeria.com</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="py-4 whitespace-nowrap">
                      <div class="text-left flex flex-col">
                        <span class="text-sm font-semimedium">Standard</span>
                      </div>
                    </td>
                    <td class="py-4 whitespace-nowrap">
                      <div class="font-normal text-left flex flex-col">
                        <span class="text-sm font-semimedium">₦800,000 </span>
                      </div>
                    </td>
                    <td class="py-4 whitespace-nowrap">
                      <div class="font-normal text-left flex flex-col">
                        <span class="text-sm font-semimedium">Monthly</span>
                      </div>
                    </td>
                    <td class="py-4 text-left whitespace-nowrap">
                      <div class="font-normal flex flex-col">
                        <span class="text-sm font-semimedium"
                          >Jan 12, 2022 15:32</span
                        >
                      </div>
                    </td>

                    <td class="py-4 text-left whitespace-nowrap">
                      <div class="flex items-center gap-4 justify-between">
                        Jan 12, 2022 15:32
                      </div>
                    </td>
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
