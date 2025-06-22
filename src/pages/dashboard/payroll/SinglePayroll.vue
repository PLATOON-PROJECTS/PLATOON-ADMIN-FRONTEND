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
import { currency } from "../../../core/utils/currencyType";
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

const responseData = ref<any>();
const successMessage = ref("Action successful");
const retrying = ref(false);
const retryPaymentsId = ref<string[]>([]);
const retryPaymentId = ref<any>();
const showConfirm = ref(false);
const failed = ref(false);
const failedMessage = ref("");
const failedPayment = ref(false);

const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));

const parsedUserInfo =
  typeof userInfo.value === "string"
    ? JSON.parse(userInfo.value)
    : userInfo.value;
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

const parsedPayrollId = Number(payrollId);

const month = computed(() => {
  const date = new Date(payrollData.value?.pageItems?.payroll?.scheduledDate);
  return isNaN(date.getTime())
    ? ""
    : date.toLocaleString("default", { month: "long" });
});
const year = computed(() => {
  const date = new Date(payrollData.value?.pageItems?.payroll?.scheduledDate);
  return isNaN(date.getTime()) ? "" : date.getFullYear();
});

const formatDate = (
  dateString: string,
  format: "full" | "monthYear" = "full"
) => {
  const date = new Date(dateString);
  if (format === "monthYear") {
    return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  }

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-GB", options);

  // Extract day and remove suffix (e.g., "30th" -> "30")
  const day = formattedDate.split(" ")[0].replace(/(\d+)(th|st|nd|rd)/, "$1");
  const monthYear = formattedDate.split(" ").slice(1).join(" ");

  return `${day} ${monthYear}`;
};

// const getEmployeeNameAndSalary = (id: string) => {
//   if (responseData.value) {
//     const data = responseData.value.employees.find((value: any) => {
//       // console.log(value.id === id);
//       if (value.id === id) {
//         return value;
//       }
//     });
//     return [data.name, data.salary.total];
//   } else {
//     return "...";
//   }
// };
// const checkState = (id: any) => {
//   return retryPaymentsId.value.includes(id) ? true : false;
// };
// const handlePayment = (id: any) => {
//   if (retryPaymentsId.value.includes(id)) {
//     retryPaymentsId.value = retryPaymentsId.value.filter((value: any) => {
//       return value !== id;
//     });
//   } else {
//     retryPaymentsId.value.push(id);
//   }
// };
// const addAllPaymentsForRetry = () => {
//   if (retryPaymentsId.value[0]) {
//     retryPaymentsId.value.length = 0;
//   } else {
//     responseData.value?.payments?.forEach((value: any) => {
//       retryPaymentsId.value.push(value.id);
//     });
//   }
//   // console.log(retryPaymentsId.value);
// };

// const retryPayments = async () => {
//   if (retryPaymentsId.value[0]) {
//     retrying.value = true;
//     const response = await request(
//       payrollStore.retryPayment(id.value as string, {
//         action: "retry",
//         payments: retryPaymentsId.value,
//       }),
//       retrying
//     );

//     const successResponse = handleSuccess(response);

//     if (successResponse && typeof successResponse !== "undefined") {
//       showSuccess.value = true;
//       successMessage.value = "Payments  retry  successful";
//       // console.log(successResponse.data);
//     }
//   }
// };

const confirmRetryPayments = () => {
  // console.log(dataObj.value);
  // const response = await request(
  //   payrollStore.create(dataObj.value as any),
  //   saving
  // );

  // handleError(response, userStore);
  // const successResponse = handleSuccess(response, showSuccess);

  // if (successResponse && typeof successResponse !== "undefined") {
  //   console.log(successResponse.data);
  //   successMessage.value = "payroll created successfully";
  //   setTimeout(() => {
  //     render.value = true;
  //   }, 6000);
  //   router.push({name: 'dashboard.payroll'});
  // }

  confirmType.value = "delete";
  confirmMessage.value.message = `Do you really want to retry multiple payments(${retryPaymentsId.value.length})?  `;
  showConfirm.value = true;
};

const fetchPayrollSummary = async () => {
  if (payrollId) {
    try {
      const response = await payrollStore.getPayroll({
        organisationId,
        payrollId: parsedPayrollId,
      });
      if (response.succeeded) {
        payrollData.value = response.data;
        responseData.value = payrollData.value.pageItems.employeeSalaries;

        const scheduledDate = payrollData.value.pageItems.payroll.scheduledDate;
        const formattedExecutionDate = formatDate(scheduledDate, "full");
        const formattedExecutionMonthYear = formatDate(
          scheduledDate,
          "monthYear"
        );

        summaryData.value = {
          totalEmployees: payrollData.value.pageItems.totalEmployees,
          totalSalaries: payrollData.value.pageItems.totalSalaries,
          executionDate: formattedExecutionDate,
          executionMonth: formattedExecutionMonthYear,
        };
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

const showFailedMessage = (message: any) => {
  failedMessage.value = "";
  failed.value = true;
  failedMessage.value = message;
};

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
        <!-- <div class="text-sm whitespace-nowrap">
          <div v-if="responseData ">
            <div
              v-if=" responseData.status === 'pending'"
              class="flex space-x-4"
            >
              <ButtonBlue>
                <template v-slot:placeholder>Approve Payroll</template>
              </ButtonBlue>
              <ButtonLightBlue  textColor="text-red">
                <template v-slot:placeholder>Decline Payroll</template>
              </ButtonLightBlue>
            </div>
            <ButtonBlue v-else>
              <template v-slot:placeholder>Download CSV</template>
            </ButtonBlue>
          </div>
        </div> -->
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
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                <span class="text-sm">₦0 </span>
                <span class="text-xs text-gray-rgba-3">Total charged</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">₦0 </span>
                <span class="text-xs text-gray-rgba-3">Total Salaries</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">₦0 </span>
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
        <div
          class="h-full rounded-lg p-4 bg-blue-lighter space-y-8 overflow-x-auto scrollbar-hide"
        >
          <div class="items-center">
            <div class="flex flex-col">
              <span class="text-xl font-semimedium">Deductions </span>
            </div>
          </div>
          <div class="space-y-5">
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">₦10 </span>
                <span class="text-xs text-gray-rgba-3"
                  >Total pension remitted</span
                >
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">employeeuser@companyname.com</span>
                <span class="text-xs text-gray-rgba-3">Tax remitted</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">Software Technology / IT</span>
                <span class="text-xs text-gray-rgba-3">Health Insurance</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">L9</span>
                <span class="text-xs text-gray-rgba-3">Total NSITF</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">Jan 12, 2022 15:32</span>
                >
                <span class="text-xs text-gray-rgba-3">Total Taxes</span>
              </div>
            </div>
          </div>
        </div>
        <!-- grid  3 -->
        <div class="h-full rounded-lg p-4 bg-blue-lighter space-y-8">
          <div class="items-center">
            <div class="flex flex-col">
              <span class="text-xl font-semimedium">Approvals </span>
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
                <span class="text-xs text-gray-rgba-3">Date Approvede</span>
              </div>
            </div>
            <div class="items-center">
              <div class="flex flex-col">
                <span class="text-sm">Ehizojie Ihayere</span>
                <span class="text-xs text-gray-rgba-3">Approved by</span>
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
                <spinner
                  v-if="loading == true"
                  class="flex justify-center items-center lg:h-[400px] h-[300px]"
                />
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
                        v-for="(employee, index) in payrollData.pageItems
                          .employeeSalaries"
                        :key="index"
                        class="text-black-100"
                      >
                        <td class="py-4 whitespace-nowrap">
                          <div
                            class="flex items-center space-x-3 flex-shrink-0"
                          >
                            <div class="flex flex-col">
                              <span class="text-sm font-semimedium"
                                >{{ employee.firstName }}
                                {{ employee.lastName }}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td class="py-4 whitespace-nowrap">
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-sm font-semimedium"
                              >₦{{ currency(employee.grossPay) }}</span
                            >
                          </div>
                        </td>
                        <td class="py-4 flex whitespace-nowrap">
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-sm font-semimedium"
                              >₦
                              {{
                                employee.bonus.amount
                                  ? currency(employee.bonus.amount)
                                  : 0
                              }}</span
                            >
                            <!-- <span class="text-xs text-gray-rgba-3"
                            >Pensions, Health</span
                          > -->
                          </div>
                        </td>
                        <td
                          class="py-4 items-center text-left whitespace-nowrap"
                        >
                          <div class="font-normal flex flex-col">
                            <span class="text-sm font-semimedium"
                              >₦
                              {{
                                employee.deduction.amount
                                  ? currency(employee.deduction.amount)
                                  : 0
                              }}</span
                            >
                          </div>
                        </td>
                        <td
                          class="py-4 items-center text-left whitespace-nowrap"
                        >
                          <div class="font-normal flex flex-col">
                            <span class="text-sm font-semimedium"
                              >₦
                              {{
                                employee.taxAmount
                                  ? currency(employee.taxAmount)
                                  : 0
                              }}</span
                            >
                          </div>
                        </td>
                        <td
                          class="py-4 items-center text-left whitespace-nowrap"
                        >
                          <div class="font-normal flex flex-col">
                            <span class="text-sm font-semimedium"
                              >₦{{
                                employee.netPay ? currency(employee.netPay) : 0
                              }}</span
                            >
                          </div>
                        </td>
                        <td
                          class="py-4 items-center text-left whitespace-nowrap"
                        >
                          <div
                            class="font-normal flex flex-col relative capitalize"
                          >
                            <span
                              class="flex text-sm font-semimedium"
                              :class="
                                employee.employee_payment?.status == 'completed'
                                  ? 'text-green'
                                  : employee.employee_payment?.status ===
                                      'failed' ||
                                    employee.employee_payment?.status ===
                                      'rejected'
                                  ? 'text-red'
                                  : 'text-[#f2da00]'
                              "
                              >{{
                                employee.employee_payment?.status ?? "pending"
                              }}
                              <img
                                src="../../../assets/icons/warning-sign.png"
                                alt="warning"
                                class="cursor-pointer ml-3"
                                @click="
                                  showFailedMessage(
                                    employee.employee_payment.meta
                                      .responseMessage
                                  )
                                "
                                v-if="
                                  employee.employee_payment?.status == 'failed'
                                "
                              />
                            </span>
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
                            There are currently no payments to show<br />
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
    <div
      class="fixed flex items-center justify-center h-screen w-screen bg-black/50 top-0 left-0 z-9999"
      v-if="failed"
    >
      <div
        class="relative lg:ml-[230px] ml-0 md:w-[60%] sm:w-[80%] bg-white rounded-lg p-4"
      >
        <button
          class="absolute right-[25px] top-[20px]"
          @click="failed = false"
        >
          Close
        </button>
        <h2 class="flex items-center text-[25px] font-bold text-red mb-[20px]">
          Failed
          <img
            src="../../../assets/icons/warning-sign.png"
            alt="warning"
            class="cursor-pointer ml-3 h-[25px]"
          />
        </h2>
        <p>{{ failedMessage }}.</p>
      </div>
    </div>
  </div>
</template>

<style></style>
