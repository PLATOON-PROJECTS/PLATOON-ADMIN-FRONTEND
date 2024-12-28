<script lang="ts" setup>
import { FCheckBoxComp } from "../../../core/form";
import { ref, provide, watch } from "vue";
import confirmAlert from "../../../components/alerts/ConfirmAlert.vue";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import { ICaretUpDown, IMenuVertical, IScales } from "../../../core/icons";
import spinner from "../../../components/timer/Spinner.vue";
import CalenderInterface from "../../../layouts/CalenderLayout.vue";
import EmptyState from "../../../components/EmptyState.vue";
import { useRouter } from "vue-router";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import {
  useTaxStore,
  useUserStore,
  useEmployeeStore,
} from "../../../store/index";
import cache from "../../../composables/swr_cache";
import Departments from "../../../components/dropdowns/department.vue";

const router = useRouter();

// initialize store
const taxStore = useTaxStore();
const userStore = useUserStore();
const employeeStore = useEmployeeStore();
//// variables
const openCalender = ref(false);
const enrolledData = ref<any>([]);
const data = ref({ department: "" });
const departmentName = ref("");
const showDepartment = ref(false);
const confirmMessage = ref({ message: "", id: "" });
const showConfirm = ref(false);
const showSuccess = ref(false);
const loading = ref(false);
const responseData = ref<any>();

// provide and inject
provide("showDepartment", showDepartment);
provide("selectedDepartment", [data, departmentName]);

// methods
const showOptions = (id: string) => {
  const element = document.getElementById(id);
  if (element?.classList.contains("hidden")) {
    element.classList.replace("hidden", "block");
  } else {
    element?.classList.replace("block", "hidden");
  }
};
const confirmDelete = (id: any) => {
  confirmMessage.value.message = `Are you sure you want to  tax with id ${id}?`;
  confirmMessage.value.id = id;
  showConfirm.value = true;
};

const deleteTax = async () => {
  loading.value = true;
  const response = await request(
    taxStore.delete(confirmMessage.value.id),
    loading
  );

  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (successResponse && typeof successResponse !== "undefined") {
    responseData.value.message = `Tax with id ${confirmMessage.value.id} deleted successfully`;
  }
};

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
      data.meta.tax ? enrolledData.value.push(data) : " ";
    });
    // console.log(successResponse.data);
  }
  data.value.department = "";
};

// const fetchTax = async () => {
//   loading.value = true;
//   const totalEmployeeCached = cache("total_employees");
//   if (typeof totalEmployeeCached !== "undefined") {
//     loading.value = false;

//     enrolledData.value.length = 0;
//     totalEmployeeCached.forEach((data: any) => {
//       data.meta.tax ? enrolledData.value.push(data) : " ";
//     });
//   }
//   const response = await request(employeeStore.index(), loading);

//   const successResponse = handleSuccess(response);

//   if (successResponse && typeof successResponse !== "undefined") {
//     enrolledData.value.length = 0;
//     cache("total_employees", successResponse.data.data);
//     successResponse.data.data.forEach((data: any) => {
//       data.meta.tax ? enrolledData.value.push(data) : " ";
//     });
//   }
// };
// fetchTax();

// watchers
watch(showDepartment, (newValue, oldValue) => {
  // console.log(newValue,oldValue)
  if (newValue !== oldValue && data.value.department != "") {
    fetchEmployeeByDepartment();
  }
});
</script>
<template>
  <!-- Table -->
  <div
    class="bg-white rounded-t-lg divide-y divide-grey-200 h-full overflow-auto scrollbar-hide w-full"
  >
    <!-- confirm alert -->
    <confirmAlert
      :showConfirm="showConfirm"
      @closeConfirm="showConfirm = false"
      v-if="showConfirm == true"
    >
      <template #title> Disable Tax</template>
      <template #confirm>
        <span @click="[deleteTax(), (showConfirm = false)]">
          CONFIRM</span
        ></template
      >
      <template #message> {{ confirmMessage.message }}</template>
    </confirmAlert>
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}</successAlert
    >
    <!--  -->
    <spinner
      v-if="loading == true"
      class="flex justify-center items-center lg:h-[400px] h-[300px]"
    />
    <!--  -->
    <div v-else>
      <div class="flex items-center justify-between w-full">
        <div class="flex flex-col space-x-6 p-6 flex-shrink-0">
          <div>
            <p class="text-2xl font-medium">Employee</p>
            <p class="text-sm font-medium text-[#626669A3]">
              Continue edit to complete process
            </p>
          </div>
          <!--  -->
          <!-- <div class="relative cursor-pointer">
            <div class="flex items-center space-x-2">
              <span
                class="text-sm text-black-200"
                @click="openCalender = !openCalender"
                >Sort by Date</span
              >
              <span>
                <ICaretUpDown />
              </span>
            </div>
            <CalenderInterface
              v-if="openCalender == true"
              class="absolute top-[30px] w-full"
            />
          </div> -->
          <!--  -->
          <div class="flex relative items-start space-x-2 cursor-pointer">
            <span
              class="text-sm text-black-200"
              @click="showDepartment = !showDepartment"
              >{{
                departmentName === "" ? "Sort by Department" : departmentName
              }}</span
            >
            <span>
              <ICaretUpDown @click="showDepartment = !showDepartment" />
            </span>
            <div
              class="absolute z-50 max-h-56 right-0 shadow-lg scrollbar-hide overflow-auto top-5 w-full"
              v-if="showDepartment == true"
            >
              <div>
                <component :is="Departments"></component>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="py-6">
        <div class="align-middle inline-block min-w-full">
          <div class="overflow-auto scrollbar-hide sm:rounded-lg">
            <table class="min-w-full table-fixed">
              <thead class="text-black-200 text-sm text-left">
                <tr class="whitespace-nowrap">
                  <th
                    scope="col"
                    class="py-4 font-normal text-left flex items-center space-x-3 flex-shrink-0"
                  >
                    <span> Employee </span>
                  </th>
                  <th scope=" col" class="py-4 font-normal text-center">
                    Tax Type
                  </th>
                  <th scope="col" class="py-4 font-normal text-left">Salary</th>
                  <th scope="col" class="py-4 font-normal text-left">State</th>
                  <th scope="col" class="py-4 font-normal text-left">Tax ID</th>
                  <th scope="col" class="py-4 font-normal text-left">
                    Total Tax Paid
                  </th>
                  <th scope="col" class="py-4 font-normal text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-grey-200">
                <tr
                  v-for="(row, index) in 5"
                  :key="index"
                  class="text-black-100 whitespace-nowrap"
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
                  <td class="py-4 whitespace-nowrap w-[15%]">
                    <div class="text-left flex justify-center">
                      <span class="text-sm font-semimedium">Payee</span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap w-[15%]">
                    <div class="font-normal text-left flex flex-col">
                      <span class="text-sm font-semimedium">₦93,000</span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap w-[15%]">
                    <div class="font-normal text-left flex flex-col">
                      <span class="text-sm font-semimedium">Lagos</span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap w-[15%]">
                    <div class="font-normal text-left flex flex-col">
                      <span class="text-sm font-semimedium">001</span>
                    </div>
                  </td>
                  <td class="py-4 text-left whitespace-nowrap w-[15%]">
                    <div class="font-normal flex flex-col">
                      <span class="text-sm font-semimedium">₦93,000</span>
                    </div>
                  </td>
                  <td class="py-4 px-8 text-left">
                    <div class="flex items-center gap-4 justify-between">
                      <button
                        @click=""
                        class="text-[#003b3d] bg-red-light text-sm text-bold px-4+1 py-2 rounded-full"
                      >
                        Download CSV
                      </button>
                      <button>
                        <IMenuVertical />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
              <!-- empty state below -->
              <!-- <tbody v-else class="w-full">
                <tr class="w-full no-hover">
                  <EmptyState>
                    <template #icon>
                      <IScales />
                    </template>
                    <template #heading>Enrolled Employees </template>
                    <template #desc>
                      All employees enrolled to recieve tax will be displayed
                      here. Click on<br />
                      the “Start now” button to setup tax
                    </template>
                    <template #actions>
                      <button
                        @click="
                          router.push({
                            path: '/dashboard/tax-compliance/add-employee',
                          })
                        "
                        class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
                      >
                        Start Now
                      </button>
                    </template>
                  </EmptyState>
                </tr>
              </tbody> -->
            </table>
          </div>
        </div>
        <!-- Pagination -->

        <div
          v-if="responseData && responseData.data[0]"
          class="px-6 mt-8 hidden items-center justify-between whitespace-nowrap lg:space-x-0 space-x-3"
        >
          <span class="opacity-50 text-sm font-semimedium"
            >Showing 1-6 of 30 items</span
          >

          <div class="flex items-center space-x-2">
            <span
              class="text-white bg-[#003b3d] text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full"
              >1</span
            >
            <span
              class="text-sm w-8 h-8 flex items-center justify-center rounded-full border opacity-50"
              >2</span
            >
            <span
              class="text-sm w-8 h-8 flex items-center justify-center rounded-full border opacity-50"
              >3</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
