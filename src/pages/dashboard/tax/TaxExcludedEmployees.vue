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

// compute
const id = computed(() => {
  return route.params.id;
});

// methods

const getEmployeeNameAndSalary = (id: string) => {
  if (responseData.value) {
    const data = responseData.value.employees.find((value: any) => {
      // console.log(value.id === id);
      if (value.id === id) {
        return value;
      }
    });
    return [data.name, data.salary.total];
  } else {
    return "...";
  }
};
const checkState = (id: any) => {
  return retryPaymentsId.value.includes(id) ? true : false;
};
const handlePayment = (id: any) => {
  if (retryPaymentsId.value.includes(id)) {
    retryPaymentsId.value = retryPaymentsId.value.filter((value: any) => {
      return value !== id;
    });
  } else {
    retryPaymentsId.value.push(id);
  }
};
const addAllPaymentsForRetry = () => {
  if (retryPaymentsId.value[0]) {
    retryPaymentsId.value.length = 0;
  } else {
    responseData.value?.payments?.forEach((value: any) => {
      retryPaymentsId.value.push(value.id);
    });
  }
  // console.log(retryPaymentsId.value);
};

const retryPayments = async () => {
  if (retryPaymentsId.value[0]) {
    retrying.value = true;
    const response = await request(
      payrollStore.retryPayment(id.value as string, {
        action: "retry",
        payments: retryPaymentsId.value,
      }),
      retrying
    );

    const successResponse = handleSuccess(response);

    if (successResponse && typeof successResponse !== "undefined") {
      showSuccess.value = true;
      successMessage.value = "Payments  retry  successful";
      // console.log(successResponse.data);
    }
  }
};

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

const fetchPayroll = async () => {
  loading.value = true;
  const response = await request(
    payrollStore.getSingle(id.value as string),
    loading
  );

  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);
    responseData.value = successResponse.data.data;

    responseData.value.employees.forEach((element: any, index: number) => {
      const employee_payment =
        responseData.value.payments.find(
          (data: any) => data.employee_id == element.id
        ) ?? null;
      if (employee_payment) {
        return (responseData.value.employees[index] = {
          ...element,
          employee_payment,
        });
      } else {
        return (responseData.value.employees[index] = {
          ...element,
          employee_payment,
        });
      }
    });
    // responseData.value.employees = employee;
    // console.log(employees_update)
    // console.log('---')
    failedPayment.value = responseData.value.payments.find(
      (data: any) => data.status === "failed"
    )
      ? true
      : false;
    // console.log(responseData.value)
  }
};

const showFailedMessage = (message: any) => {
  failedMessage.value = "";
  failed.value = true;
  failedMessage.value = message;
};

const isOpen = ref(false);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function downloadAsCSV() {
  // Add functionality to download as CSV
  isOpen.value = false;
}

function downloadToEmail() {
  // Add functionality to trigger email download
  isOpen.value = false;
}

// fetchPayroll();
</script>
<template>
  <div class="space-y-5">
    <confirmAlert
      :showConfirm="showConfirm"
      @closeConfirm="showConfirm = false"
      v-if="showConfirm == true"
    >
      <template #title> Delete</template>
      <template #confirm>
        <span @click="[retryPayments(), (showConfirm = false)]">
          CONFIRM</span
        ></template
      >
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
        class="flex justify-between w-full overflow-auto scrollbar-hide lg:space-x-0 space-x-3"
      >
        <div class="flex space-x-5">
          <div class="pt-1">
            <IArrowLeftTail class="cursor-pointer" @click="router.go(-1)" />
          </div>
          <div>
            <h3 class="font-bold text-2xl whitespace-nowrap">
              {{ responseData ? responseData.month : "..." }} Tax
            </h3>
            <p class="text-sm pt-1 font-semimedium">
              <span class="text-black-200 whitespace-nowrap"
                >{{ responseData ? responseData.month : "..." }}
                {{ responseData ? responseData.year : "..." }}
              </span>
            </p>
          </div>
          <div class="pt-1">
            <button
              class="text-white rounded-full font-medium text-sm px-4+1"
              :class="
                responseData?.status === 'approved'
                  ? 'bg-green'
                  : !responseData
                  ? 'bg-green'
                  : 'bg-red'
              "
            >
              {{
                responseData?.status === "approved"
                  ? " Approved"
                  : !responseData
                  ? "..."
                  : "Rejected"
              }}
            </button>
          </div>
        </div>
        <div class="text-sm">
          <div>
            <!-- <div
              v-if=" responseData.status === 'pending'"
              class="flex space-x-4"
            >
              <ButtonBlue>
                <template v-slot:placeholder>Approve Payroll</template>
              </ButtonBlue>
              <ButtonLightBlue  textColor="text-red">
                <template v-slot:placeholder>Decline Payroll</template>
              </ButtonLightBlue>
            </div> -->
            <div class="text-left">
              <!-- Button -->
              <ButtonBlue @click="toggleDropdown">
                <template v-slot:placeholder>Download</template>
              </ButtonBlue>

              <!-- Dropdown -->
              <div
                v-if="isOpen"
                class="mt-2 w-56 bg-white border border-grey rounded-lg shadow-xl z-100"
              >
                <button
                  @click="downloadAsCSV"
                  class="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Download as CSV
                </button>
                <button
                  @click="downloadToEmail"
                  class="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Download to Email
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="text-sm whitespace-nowrap">
          <div v-if="responseData">
            <div class="flex space-x-4">
              <ButtonBlue v-if="responseData?.status != 'approved'">
                <template v-slot:placeholder>Approve Payroll</template>
              </ButtonBlue>
              <ButtonLightBlue
                textColor="text-red"
                v-if="responseData?.status != 'approved'"
              >
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
        <div class="h-full rounded-lg p-4 bg-blue-lighter space-y-8">
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
          <button
            v-if="failedPayment"
            :disabled="retryPaymentsId[0] ? false : true"
            class="flex items-center cursor-pointer space-x-2.5 bg-[#003b3d] py-2+1 rounded-full px-4+1 flex-shrink-0 text-white"
            :class="!retryPaymentsId[0] ? 'disabled:opacity-75' : ' '"
            @click="confirmRetryPayments()"
          >
            <spinner v-if="retrying == true" />
            <span v-else> Retry payment</span>
          </button>
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
                        <th scope=" col" class="py-4 text-left">Gross pay</th>

                        <th scope="col" class="py-4 text-left">State</th>
                        <th scope="col" class="py-4 text-left">Tax Value</th>
                        <th scope="col" class="py-4 text-left">Tax ID</th>
                        <th scope="col" class="py-4 text-left">
                          Total Tax Paid
                        </th>
                        <th scope="col" class="py-4 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-grey-200">
                      <tr
                        v-for="(row, index) in 5"
                        :key="index"
                        class="text-black-100"
                      >
                        <td class="py-4 whitespace-nowrap">
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-sm font-semimedium"
                              >Ighayere Ehondor Jemima</span
                            >
                            <span class="text-xs text-gray-rgba-3"
                              >₦800,000/yr</span
                            >
                          </div>
                        </td>

                        <td class="py-4 whitespace-nowrap">
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-sm font-semimedium">₦72,900</span>
                            <span class="text-xs text-gray-rgba-3"
                              >Net: ₦72,900 r</span
                            >
                          </div>
                        </td>
                        <td class="py-4 flex whitespace-nowrap">
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-sm font-semimedium">Lagos</span>
                          </div>
                        </td>
                        <td
                          class="py-4 items-center text-left whitespace-nowrap"
                        >
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-sm font-semimedium">₦34,000</span>
                          </div>
                        </td>
                        <td
                          class="py-4 items-center text-left whitespace-nowrap"
                        >
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-sm font-semimedium">0001</span>
                          </div>
                        </td>
                        <td
                          class="py-4 items-center text-left whitespace-nowrap"
                        >
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-sm font-semimedium">₦34,000</span>
                          </div>
                        </td>
                        <td class="py-4 text-left whitespace-nowrap">
                          <div class="flex flex-col">
                            <!-- <span class="text-sm font-semimedium">{{
                              item.narration
                            }}</span> -->
                            <span class="text-sm text-[#46A754] font-semimedium"
                              >Approved</span
                            >
                            <span class="text-xs text-[#626669A3]"
                              >Submitted: 12/10/2022 15:32</span
                            >
                          </div>
                        </td>
                      </tr>
                    </tbody>

                    <!-- empty state below -->
                    <!-- <tbody v-else class="w-full">
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
                    </tbody> -->
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
