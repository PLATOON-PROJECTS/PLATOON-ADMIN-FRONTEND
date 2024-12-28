<script setup lang="ts">
import { inject, ref, computed } from "vue";
import { IRadioChecked } from "../../../core/icons";
import { FCheckBoxComp } from "../../../core/form";
import { IArrowLeftTail } from "../../../core/icons";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import ButtonLightBlue from "../../../components/buttons/ButtonLightBlue.vue";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../components/timer/Spinner.vue";
import confirmAlert from "../../../components/alerts/ConfirmAlert.vue";
import { IIncDec, IMenuVertical, IUserThree } from "../../../core/icons";
import ButtonDangerVue from "../../../components/buttons/ButtonDanger.vue";
import EmptyState from "../../../components/EmptyState.vue";
import { useRouter, useRoute } from "vue-router";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import { usePayrollStore } from "../../../store/index";
import ButtonBlueOutline from "../../../components/buttons/ButtonBlueOutline.vue";
import {currency} from '../../../core/utils/currencyType'
import { getItem } from "../../../core/utils/storage.helper";

// initialize router and route
const router = useRouter();
const route = useRoute();

// initialize store
const payrollStore = usePayrollStore();
const loading = ref(false);
const confirmMessage = ref({ message: "" });
// variables
const confirmType = ref("");
const showSuccess = ref(false);
const showModal = ref(false);
const showDecline = ref(false);
const responseData = ref<any>();
const successMessage = ref("Action successful");
const retrying = ref(false);
const retryPaymentsId = ref<string[]>([]);
const retryPaymentId = ref<any>();
const showConfirm = ref(false);
const failed = ref(false);
const failedMessage = ref('');
const failedPayment = ref(false);

const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));

const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;
const payrollData = ref<any>({ data: [], message: "" });

// compute
// const id = computed(() => {
//   return route.params.id;
// });

const summaryData = ref({
  totalEmployees: "",
  totalSalaries: "",
  executionDate: "", 
  executionMonth: "", 

});
// methods

const { payrollId } = route.params;

console.log("--------", payrollId)
const parsedPayrollId = Number(payrollId);

const month = computed(() => {
  const date = new Date(payrollData.value?.pageItems?.payroll?.scheduledDate);
  return isNaN(date.getTime()) ? "" : date.toLocaleString('default', { month: 'long' }); 
});
const year = computed(() => {
  const date = new Date(payrollData.value?.pageItems?.payroll?.scheduledDate);
  return isNaN(date.getTime()) ? "" : date.getFullYear(); 
});

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

const approve = async () => {
  showModal.value = true;

};

const decline = async () => {
  showDecline.value = true;

};

const navigateToPending = () => {
  router.push({ name: "dashboard.payroll.pending" });
};


const fetchPayrollSummary = async () => {
  if (payrollId) {
    try {
      const response = await payrollStore.getPayroll({
        organisationId,
        payrollId: parsedPayrollId
      });
      if (response.succeeded) {
        payrollData.value = response.data;
        responseData.value = payrollData.value.pageItems.employeeSalaries;
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

const showFailedMessage = (message:any) => {
  failedMessage.value = '';
  failed.value = true;
  failedMessage.value = message;
}

fetchPayrollSummary();

</script>
<template>
  <div class="space-y-5">
    <confirmAlert
      :showConfirm="showConfirm"
      @closeConfirm="showConfirm = false"
      v-if="showConfirm == true"
    >
      <template #title> Delete</template>
      <!-- <template #confirm>
        <span @click="[retryPayments(), (showConfirm = false)]">
          CONFIRM</span
        ></template
      > -->
      <template #message> {{ confirmMessage.message }}</template>
    </confirmAlert>
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
                    Payroll Approved
                </div>
                <div class="text-center text-sm text-gray-100 px-6">
            Payroll payment for <span class="font-bold">{{ summaryData.executionMonth }}</span> was successful. Check the status of each transaction once completed.
          </div>
                <ButtonBlue @click="navigateToPending">
            <template v-slot:placeholder>
              <span>Done</span>
            </template>
          </ButtonBlue>
        </div>
      </div>
      <div v-if="showDecline" class="flex items-center justify-center fixed top-0 left-0 bg-black/20 h-screen w-screen z-[99999]">
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
                    Payroll Declined
                </div>
                <div class="text-center text-sm text-gray-100 px-6">
            Payroll payment for <span class="font-bold">{{ summaryData.executionMonth }}</span> was declined successfully.
          </div>
                <ButtonBlue @click="navigateToPending">
            <template v-slot:placeholder>
              <span>Done</span>
            </template>
          </ButtonBlue>
        </div>
      </div>
    <div class="bg-white h-full rounded-lg py-6 px-5 space-y-7">
      <div
        class="flex justify-between overflow-auto scrollbar-hide lg:space-x-0 space-x-3"
      >
        <div class="flex space-x-5">
          <div class="pt-1">
            <IArrowLeftTail class="cursor-pointer" @click="router.go(-1)" />
          </div>
          <div>
            <h3 class="font-bold text-2xl whitespace-nowrap">
              {{ month }} Salary Payment
            </h3>
            <p class="text-sm pt-1 font-semimedium">
              <span class="text-black-200 whitespace-nowrap"
                >{{ month }}
                {{ year }}
              </span>
            </p>
          </div>
          <div class="pt-1">
            <button
              class="text-white rounded-full font-medium text-sm px-4+1"
              :class="
              payrollData.value?.pageItems?.payroll?.status === 'approved'
                  ? 'bg-green'
                  : !payrollData
                  ? 'bg-green'
                  : 'bg-[#f2da00]'
              "
            >
              {{
                payrollData.value?.pageItems?.payroll?.status === "approved"
                  ? " Approved"
                  : !payrollData
                  ? "..."
                  : "Pending"
              }}
            </button>
          </div>
        </div>
        <div class="text-sm whitespace-nowrap">
          <div>
            <div class="flex space-x-4">
              <ButtonBlue @click="approve">
                <template v-slot:placeholder>Approve</template>
              </ButtonBlue>
              <ButtonLightBlue @click="decline" textColor="text-red">
                <template v-slot:placeholder>Decline</template>
              </ButtonLightBlue>
            </div>
            <!-- <ButtonBlue v-else>
              <template v-slot:placeholder>Download CSV</template>
            </ButtonBlue> -->
          </div>
        </div>
        <!-- <div class="text-sm whitespace-nowrap">
          <div v-if="responseData">
            <div class="flex space-x-4">
              <ButtonBlue v-if="responseData?.status != 'approved'">
                <template v-slot:placeholder>Approve Payroll</template>
              </ButtonBlue>
              <ButtonLightBlue textColor="text-red" v-if="responseData?.status != 'approved'">
                <template v-slot:placeholder>Decline Payroll</template>
              </ButtonLightBlue>
            </div>
          </div>
        </div> -->
      </div>
      <div class="grid lg:grid-cols-3 gap-3">
        <!-- grid 1 -->

        <div class="h-full rounded-lg p-4 bg-blue-lighter space-y-8">
          <div class="items-center">
            <div class="flex flex-col">
              <span class="text-xl font-semimedium">Payments </span>
            </div>
          </div>
          <div class="space-y-5">
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">₦  {{ currency(payrollData.pageItems?.totalSalaries) }} </span>
                <span class="text-xs text-gray-rgba-3"
                  >Total amount to be charged</span
                >
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">₦ {{ currency(payrollData.pageItems?.totalSalaries) }}</span>
                <span class="text-xs text-gray-rgba-3">Total Salaries</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm"
                  >{{ payrollData.pageItems?.totalEmployees }}
                </span>
                <span class="text-xs text-gray-rgba-3">Total Employees</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">₦0 </span>
                <span class="text-xs text-gray-rgba-3">People HRM</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">Jan 12, 2022 15:32</span>
                <span class="text-xs text-gray-rgba-3">Date added</span>
              </div>
            </div>
          </div>
        </div>
        <!--grid 2  -->
        <div class="h-full rounded-lg p-4 bg-blue-lighter space-y-8">
          <div class="items-center">
            <div class="flex flex-col">
              <span class="text-xl font-semimedium">Deductions </span>
            </div>
          </div>
          <div class="space-y-5">
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm"
                  >₦800,000
                </span>
                <span class="text-xs text-gray-rgba-3"
                  >Total pension remitted</span
                >
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm"
                  >₦ 18,000</span
                >
                <span class="text-xs text-gray-rgba-3">Tax remitted</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm"
                  >1,000,000
                </span>
                <span class="text-xs text-gray-rgba-3">Health Insurance</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm"
                  >₦7,0000
                </span>
                <span class="text-xs text-gray-rgba-3">Total NSITF</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm"
                  >#9,0000</span
                >
                <span class="text-xs text-gray-rgba-3">Total Taxes</span>
              </div>
            </div>
          </div>
        </div>
        <!-- grid  3 -->
        <div
          class="h-full rounded-lg p-4 bg-blue-lighter space-y-8"
        >
          <div class="items-center">
            <div class="flex flex-col">
              <span class="text-xl font-semimedium">Details </span>
            </div>
          </div>
          <div class="space-y-5">
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">Jan 12, 2022 15:32</span>
                <span class="text-xs text-gray-rgba-3">Date Created</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">Jan 12, 2022 15:32</span>
                <span class="text-xs text-gray-rgba-3">Date Submitted</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">Jan 12, 2022 15:32</span>
                <span class="text-xs text-gray-rgba-3">Date to be Executed</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm"> Ehizojie Ihayere</span>
                <span class="text-xs text-gray-rgba-3">Created by</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">Jan 12, 2022 15:32</span>
                <span class="text-xs text-gray-rgba-3">Date added</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white h-full rounded-t-lg py-6">
      <div class="px-5">
        <div class="flex justify-between">
          <h3 class="font-bold text-2xl">Employees</h3>
          <!-- <button 
            v-if="failedPayment"
            :disabled="retryPaymentsId[0] ? false : true"
            class="flex items-center cursor-pointer space-x-2.5 bg-[#003b3d] py-2+1 rounded-full px-4+1 flex-shrink-0 text-white"
            :class="!retryPaymentsId[0] ? 'disabled:opacity-75' : ' '"
            @click="confirmRetryPayments()"
          >
            <spinner v-if="retrying == true" />
            <span v-else> Retry payment</span>
          </button> -->
        </div>
      </div>
      <div class="space-y-10 overflow-auto scrollbar-hide">
        <!-- table -->
        <div class="">
          <div class="py-6">
            <div class="align-middle inline-block min-w-full">
              <div class="overflow-hidden sm:rounded-lg">
                <!-- <div class="space-x-3 pl-6 font-normal">
                  <span>
                    <FCheckBoxComp
                      :value="
                        retryPaymentsId.length === responseData?.data?.length
                          ? true
                          : false
                      "
                      name="payroll"
                      @click="addAllPaymentsForRetry()"
                      :disabled="!failedPayment"
                  /></span>
                  <span
                    class="text-sm pt-1 font-semimedium text-black-200 whitespace-nowrap cursor-pointer"
                    >Select All</span
                  >
                </div> -->
                 <spinner v-if="loading == true"   class="flex justify-center items-center lg:h-[400px] h-[300px]" />
                <div v-else>
                  
                <table class="min-w-full table-fixed">
                  <thead
                    class="text-black-200 font-semimedium text-sm text-left"
                  >
                    <tr>
                      <th
                        scope="col"
                        class="py-4 text-left flex items-center space-x-3"
                      >
                        <!-- <CheckBox customClasses="indeterminate-check" /> -->
                        <span> Name </span>
                      </th>
                      <th scope=" col" class="py-4 text-left">Gross Pay</th>

                      <th scope="col" class="py-4 text-left">Bonus</th>
                      <th scope="col" class="py-4 text-left">Deductions</th>
                      <th scope="col" class="py-4 text-left">Tax</th>
                      <th scope="col" class="py-4 text-left">Net Pay</th>
                      <th scope="col" class="py-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody
                    class="bg-white divide-y divide-grey-200"
                    v-if="payrollData && payrollData.pageItems"
                  >
                    <tr
                      v-for="(employee, index) in payrollData.pageItems.employeeSalaries"
                      :key="index"
                      class="text-black-100"
                    >
                      <td class="py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-3 flex-shrink-0">
                          <div class="flex flex-col">
                            <span class="text-sm font-semimedium"
                              >{{ employee.firstName }} {{ employee.lastName }}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td class="py-4 whitespace-nowrap">
                        <div class="font-normal text-left flex flex-col">
                          <span class="text-sm font-semimedium"
                            >₦{{ currency(employee.grossPay) }}</span>
                        </div>
                      </td>
                      <td class="py-4 flex whitespace-nowrap">
                        <div class="font-normal text-left flex flex-col">
                          <span class="text-sm font-semimedium"
                            >₦ {{employee.bonus.amount ? currency(employee.bonus.amount) : 0}}</span
                          >
                          <!-- <span class="text-xs text-gray-rgba-3"
                            >Pensions, Health</span
                          > -->
                        </div>
                      </td>
                      <td class="py-4 items-center text-left whitespace-nowrap">
                        <div class="font-normal flex flex-col">
                          <span class="text-sm font-semimedium"
                            >₦ {{
                              employee.deduction.amount ? currency(employee.deduction.amount) : 0
                            }}</span
                          >
                        </div>
                      </td>
                      <td class="py-4 items-center text-left whitespace-nowrap">
                        <div class="font-normal flex flex-col">
                          <span class="text-sm font-semimedium"
                            >₦ {{ employee.taxAmount ? currency(employee.taxAmount) : 0 }}</span
                          >
                        </div>
                      </td>
                      <td class="py-4 items-center text-left whitespace-nowrap">
                        <div class="font-normal flex flex-col">
                          <span class="text-sm font-semimedium"
                            >₦{{ employee.netPay ? currency(employee.netPay) : 0 }}</span
                          >
                        </div>
                      </td>
                      <td class="py-4 items-center text-left whitespace-nowrap">
                        <div class="font-normal flex flex-col relative capitalize">
                          <span class="flex text-sm font-semimedium" :class="employee.employee_payment?.status == 'completed' ? 'text-green' : employee.employee_payment?.status === 'failed' || employee.employee_payment?.status === 'rejected' ? 'text-red'  : 'text-[#f2da00]'"
                            >{{ employee.employee_payment?.status ?? 'pending' }} <img src="../../../assets/icons/warning-sign.png" alt="warning" class="cursor-pointer ml-3" @click="showFailedMessage(employee.employee_payment.meta.responseMessage)" v-if="employee.employee_payment?.status == 'failed'"> </span 
                          >
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  
                    <!-- empty state below -->
                  <tbody v-else class="w-full">
                    <tr class="w-full no-hover">
                      <EmptyState>
                        <template #icon>
                          <IUserThree />
                        </template>
                        <template #heading> Payroll Payment</template>
                        <template #desc>
                          There are currently no payments  to show<br />
                          at the moment
                        </template>
                       
                      </EmptyState>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- end of table -->
      </div>
    </div>
    <div class="fixed flex items-center justify-center h-screen w-screen bg-black/50 top-0 left-0 z-9999" v-if="failed">
      <div class="relative lg:ml-[230px] ml-0 md:w-[60%] sm:w-[80%] bg-white rounded-lg p-4">
        <button class="absolute right-[25px] top-[20px]" @click="failed = false">Close</button>
        <h2 class="flex items-center text-[25px] font-bold text-red mb-[20px]" >Failed <img src="../../../assets/icons/warning-sign.png" alt="warning" class="cursor-pointer ml-3 h-[25px]" /></h2>
        <p>{{ failedMessage }}.</p>
      </div>
    </div>
  </div>
</template>

<style></style>
