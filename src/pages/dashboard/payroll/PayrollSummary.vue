<script setup lang="ts">
import { ref, provide, reactive, onMounted } from "vue";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../components/timer/Spinner.vue";
import {
  IArrowLeftTail,
} from "../../../core/icons";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import { useRouter } from "vue-router";
import {
  usePayrollStore,
  useEmployeeStore,
  useUserStore,
} from "../../../store/index";
import { getItem } from "../../../core/utils/storage.helper";


// initialize router
const router = useRouter();

// initialize store
const payrollStore = usePayrollStore();
const userStore = useUserStore();
const showModal = ref(false);
// variables

const departmentName = ref("");
const showDepartment = ref(false);
const data = ref({ department: "all" });
const showSuccess = ref(false);
const loading = ref(false);
const employeeMap = ref<Record<string, string>>({}); 
const successMessage = ref("Action successful");
// const payrollData = ref(null);
const payrollData = ref<any>({ data: [], message: "" });


const dataObjj = reactive({
    employees: []
});
const summaryData = ref({
  totalEmployees: "",
  totalSalaries: "",
  executionDate: "", 
  executionMonth: "", 

});


const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));

const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;

// const formatDate = (dateString: string) => {
//   const date = new Date(dateString);
//   const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
//   const formattedDate = date.toLocaleDateString('en-GB', options);
  
//   // Extract day and remove suffix (e.g., "30th" -> "30")
//   const day = formattedDate.split(' ')[0].replace(/(\d+)(th|st|nd|rd)/, '$1');
//   const monthYear = formattedDate.split(' ').slice(1).join(' ');

//   return `${day} ${monthYear}`;
// };
const formatDate = (dateString: string, format: 'full' | 'monthYear' = 'full') => {
  const date = new Date(dateString);
  if (format === 'monthYear') {
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  }
  
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-GB', options);
  
  // Extract day and remove suffix (e.g., "30th" -> "30")
  const day = formattedDate.split(' ')[0].replace(/(\d+)(th|st|nd|rd)/, '$1');
  const monthYear = formattedDate.split(' ').slice(1).join(' ');

  return `${day} ${monthYear}`;
};


// inject and provide
provide("showDepartment", showDepartment);
provide("selectedDepartment", [data, departmentName]);
provide("employeeMap", employeeMap);
// method

const { payrollId } = router.currentRoute.value.query;
const parsedPayrollId = Number(payrollId);


const fetchPayrollSummary = async () => {
  if (payrollId) {
    try {
      const response = await payrollStore.getPayroll({
        organisationId,
        payrollId: parsedPayrollId
      });
      if (response.succeeded) {
        payrollData.value = response.data;
        const scheduledDate = payrollData.value.pageItems.payroll.scheduledDate;
        const formattedExecutionDate = formatDate(scheduledDate, 'full');
        const formattedExecutionMonthYear = formatDate(scheduledDate, 'monthYear');

        console.log("Formatted Execution Date:", formattedExecutionDate);

        summaryData.value = {
          totalEmployees: payrollData.value.pageItems.totalEmployees,
          totalSalaries: payrollData.value.pageItems.totalSalaries,
          executionDate: formattedExecutionDate,
          executionMonth: formattedExecutionMonthYear
        };
        console.log(payrollData.value?.pageItems.totalEmployees )
        console.log("-----", payrollData.value)
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Error fetching payroll summary:", error);
    } finally {
      loading.value = false; 
    }
  } else {
    console.error("Payroll ID is missing from query.");
  }
};

const submitPayroll = async () => {
  loading.value = true; 
  try {
    const response = await payrollStore.submitPayroll(parsedPayrollId);
    if (response.succeeded) {
        showModal.value = true;
      console.log("Resssssss", response)
    } else {
      console.error(response.message);
    }
  } catch (error) {
    console.error("Error during payroll submission:", error);
    successMessage.value = "Failed to submit payroll. Please try again.";
    showSuccess.value = true;
  } finally {
    loading.value = false; 
  }
};
const navigateToCreateNew = () => {
  router.push({ name: "dashboard.payroll.add" });
};

onMounted(() => {
  fetchPayrollSummary();
});
</script>
<template>
  <div class="bg-white h-full rounded-t-lg py-6 space-y-5 overflow-auto scrollbar-hide">
    <!-- successAlert -->
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ successMessage }}</successAlert
    >
    <div v-if="showModal" class="flex items-center justify-center fixed top-0 left-0 bg-black/20 h-screen w-screen z-[99999]">
        <div class="box bg-white rounded-md md:w-[400px] w-auto p-6 flex flex-col items-center justify-center space-y-6">
          <div>
            <svg width="69" height="69" viewBox="0 0 69 69" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="34.5" cy="34.5" r="34.5" fill="#F0F2F2" />
              <path
                d="M34.5 15.8125C30.804 15.8125 27.1909 16.9085 24.1178 18.9619C21.0446 21.0153 18.6494 23.9339 17.235 27.3486C15.8206 30.7633 15.4505 34.5207 16.1716 38.1458C16.8926 41.7708 18.6725 45.1006 21.286 47.7141C23.8994 50.3276 27.2292 52.1074 30.8543 52.8284C34.4793 53.5495 38.2367 53.1794 41.6514 51.765C45.0661 50.3506 47.9847 47.9554 50.0381 44.8822C52.0915 41.8091 53.1875 38.196 53.1875 34.5C53.1823 29.5454 51.2117 24.7952 47.7083 21.2917C44.2048 17.7883 39.4546 15.8177 34.5 15.8125ZM42.7045 31.2045L32.642 41.267C32.5085 41.4007 32.35 41.5067 32.1755 41.5791C32.001 41.6514 31.8139 41.6886 31.625 41.6886C31.4361 41.6886 31.249 41.6514 31.0745 41.5791C30.9 41.5067 30.7415 41.4007 30.608 41.267L26.2955 36.9545C26.0257 36.6848 25.8742 36.319 25.8742 35.9375C25.8742 35.556 26.0257 35.1902 26.2955 34.9205C26.5652 34.6507 26.931 34.4992 27.3125 34.4992C27.694 34.4992 28.0598 34.6507 28.3295 34.9205L31.625 38.2177L40.6705 29.1705C40.804 29.0369 40.9626 28.931 41.1371 28.8587C41.3116 28.7864 41.4986 28.7492 41.6875 28.7492C41.8764 28.7492 42.0634 28.7864 42.2379 28.8587C42.4124 28.931 42.571 29.0369 42.7045 29.1705C42.8381 29.304 42.944 29.4626 43.0163 29.6371C43.0886 29.8116 43.1258 29.9986 43.1258 30.1875C43.1258 30.3764 43.0886 30.5634 43.0163 30.7379C42.944 30.9124 42.8381 31.071 42.7045 31.2045Z"
                fill="black" />
            </svg>
          </div>
                <div class="text-center font-bold text-lg">
                    Payroll Submitted
                </div>
                <div class="text-center text-sm text-gray-100 px-6">
            Payroll payment for <span class="font-bold">{{ summaryData.executionMonth }}</span> was successful. Check the status of each transaction once completed.
          </div>
                <ButtonBlue @click="navigateToCreateNew">
            <template v-slot:placeholder>
              <span>Done</span>
            </template>
          </ButtonBlue>
        </div>
      </div>
      
    <div class="px-5 py-2">
      <div class="space-y-6">
        <div class="flex justify-between">
            <div class="flex space-x-5">
                <div class="pt-1">
                  <IArrowLeftTail />
                </div>
                <div>
                  <h3 class="font-bold text-2xl whitespace-nowrap">
                    Summary
                  </h3>
                  <p class="text-sm pt-1 font-semimedium whitespace-nowrap">
                    <span class="text-black-200">Select Submit to proceed with Payroll transaction</span>
                  </p>
                </div>
            </div>
            <div>
                    <ButtonBlue @click="submitPayroll">
                    <template v-slot:placeholder>
                        <span>Submit Payroll</span></template>
                    </ButtonBlue>
            </div>
        </div>
      </div>
    </div>
    <p class="text-sm pt-1 font-bold whitespace-nowrap px-5 ">
        <span class="text-black">Payment information</span>
    </p>

    <div class="space-y-10">
      <spinner
        v-if="loading == true"
        class="flex justify-center items-center lg:h-[400px] h-[300px]"
      />
      <!-- table -->
      <div v-else>
        <div class="border-t border-grey">
          <div class="">
            <div class="align-middle inline-block min-w-full">
              <div class="overflow-hidden sm:rounded-lg">
                <table id="data-table" class="min-w-full table-fixed">
                  <!-- <thead class="text-black-200 text-sm text-left">
                    <tr>
                      <th scope="col" class="py-4 text-left whitespace-nowrap"> </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap"> </th>
                    </tr>
                  </thead> -->
                  <tbody class="bg-white">
                    <tr class="text-black-100 border-b border-grey">
                      <td class="py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-3">
                          <div class="flex flex-col">
                            <span class="text-sm font-semimedium">Debit Bank Account</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 whitespace-nowrap">
                        <div class="text-left flex flex-col">
                          <span class="text-sm font-semimedium">Platoon Inc LTD / Access Bank / 009876678876</span>
                        </div>
                      </td>
                    </tr>
                    <tr class="text-black-100 border-b border-grey">
                        <td class="py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-3">
                            <div class="flex flex-col">
                              <span class="text-sm font-semimedium">Available Total Amount</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 whitespace-nowrap">
                          <div class="text-left flex flex-col">
                            <span class="text-sm font-semimedium">₦605,000</span>
                          </div>
                        </td>
                      </tr>
                      <tr class="text-black-100 border-b border-grey">
                        <td class="py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-3">
                            <div class="flex flex-col">
                              <span class="text-sm font-semimedium">Execution Date</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 whitespace-nowrap">
                          <div class="text-left flex flex-col">
                            <span class="text-sm font-semimedium">{{ summaryData.executionDate }}</span>
                          </div>
                        </td>
                      </tr>
                    <tr class="text-black-100 border-b border-grey">
                      <td class="py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-3">
                          <div class="flex flex-col">
                            <span class="text-sm font-bold">Payroll information</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                      <tr class="text-black-100 border-b border-grey">
                        <td class="py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-3">
                            <div class="flex flex-col">
                              <span class="text-sm font-semimedium">Number of Staff</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 whitespace-nowrap">
                          <div class="text-left flex flex-col">
                            <span class="text-sm font-semimedium">{{ summaryData.totalEmployees }}</span>
                          </div>
                        </td>
                      </tr>
                      <tr class="text-black-100 border-b border-grey">
                        <td class="py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-3">
                            <div class="flex flex-col">
                              <span class="text-sm font-semimedium">Gross Pay</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 whitespace-nowrap">
                          <div class="text-left flex flex-col">
                            <span class="text-sm font-semimedium">₦{{ summaryData.totalSalaries }}</span>
                          </div>
                        </td>
                      </tr>
                      <tr class="text-black-100 border-b border-grey">
                        <td class="py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-3">
                            <div class="flex flex-col">
                              <span class="text-sm font-semimedium">Bonus</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 whitespace-nowrap">
                          <div class="text-left flex flex-col">
                            <span class="text-sm font-semimedium">₦5,000</span>
                          </div>
                        </td>
                      </tr>
                      <tr class="text-black-100 border-b border-grey">
                        <td class="py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-3">
                            <div class="flex flex-col">
                              <span class="text-sm font-semimedium">Deductions</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 whitespace-nowrap">
                          <div class="text-left flex flex-col">
                            <span class="text-sm font-semimedium">₦2,300</span>
                          </div>
                        </td>
                      </tr>
                      <tr class="text-black-100 border-b border-grey">
                        <td class="py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-3">
                            <div class="flex flex-col">
                              <span class="text-sm font-semimedium">Tax</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 whitespace-nowrap">
                          <div class="text-left flex flex-col">
                            <span class="text-sm font-semimedium">₦605,000</span>
                          </div>
                        </td>
                      </tr>
                      <tr class="text-black-100 border-b border-grey">
                        <td class="py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-3">
                            <div class="flex flex-col">
                              <span class="text-sm font-semimedium">Net Pay</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 whitespace-nowrap">
                          <div class="text-left flex flex-col">
                            <span class="text-sm font-semimedium">₦800,000,000</span>
                          </div>
                        </td>
                      </tr>
                      <tr class="text-black-100 border-b border-grey">
                        <td class="py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-3">
                            <div class="flex flex-col">
                              <span class="text-sm font-semimedium">Total Payroll Amount</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 whitespace-nowrap">
                          <div class="text-left flex flex-col">
                            <span class="text-sm font-semimedium">₦1,200,00,000</span>
                          </div>
                        </td>
                      </tr>
                      <tr class="text-black-100 border-b border-grey">
                        <td class="py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-3">
                            <div class="flex flex-col">
                              <span class="text-sm font-semimedium">Processing fee</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 whitespace-nowrap">
                          <div class="text-left flex flex-col">
                            <span class="text-sm font-semimedium">₦240,00</span>
                          </div>
                        </td>
                      </tr>
                      <tr class="text-black-100 border-b border-grey">
                        <td class="py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-3">
                            <div class="flex flex-col">
                              <span class="text-sm font-semimedium">Total charged Amount</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 whitespace-nowrap">
                          <div class="text-left flex flex-col">
                            <span class="text-sm font-semimedium">₦405,00</span>
                          </div>
                        </td>
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  </div>
</template>

<style></style>
