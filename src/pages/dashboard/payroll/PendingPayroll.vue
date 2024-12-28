<script setup lang="ts">
import { ref, inject } from "vue";
import CalenderInterface from "../../../layouts/CalenderLayout.vue";
import { IIncDec, IIncDecBlue, IMenuVertical, IUserThree } from "../../../core/icons";
import FCheckedComponent from "../../../components/forms/FCheckBox.vue";
import ButtonLightBlue from "../../../components/buttons/ButtonLightBlue.vue";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import { FCheckBoxComp } from "../../../core/form";
import Departments from "../../../components/dropdowns/department.vue";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../components/timer/Spinner.vue";
import confirmAlert from "../../../components/alerts/ConfirmAlert.vue";
import EmptyState from "../../../components/EmptyState.vue";
import { useRouter } from "vue-router";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import { usePayrollStore, useUserStore } from "../../../store/index";
import cache from "../../../composables/swr_cache";
import {currency} from '../../../core/utils/currencyType'
import { getItem } from "../../../core/utils/storage.helper";
import Pagination from "../../../components/Pagination.vue";
import { Payroll } from "../../../service/payroll/interface/payroll.interface";
import ButtonLightRed from "../../../components/buttons/ButtonLightRed.vue";

// initialize router
const router = useRouter();

// initialize store
const payrollStore = usePayrollStore();
const userStore = useUserStore();

// variables
const openCalender = ref(false);
const showSuccess = ref(false);
const deletePayrollsId = ref<string[]>([]);
const confirmType = ref("");
const deleting = ref(false);
const showConfirm = ref(false);
const confirmMessage = ref({ message: "" });
const deletePayrollId = ref<any>();
const loading = ref(false);
const responseData = ref<any>([]);
const successMessage = ref("Action successful");
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10);  
const totalItems = ref(0);
const responseDataa = ref<{ data: Payroll[] }>({
  data: []
});
let allPayrolls: Payroll[] = [];

// poroovide and inject
const render = inject<any>("render");

// methods
const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;

const organisationId = parsedUserInfo?.customerInfo?.organisationId;

// Helper function for date formatting
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString(undefined, options).replace(",", "");
};

const getCurrentMonthPayrollId = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-based
  const currentYear = currentDate.getFullYear();

  // Filter payrolls for the current month and year
  const payrolls = allPayrolls.filter((payroll) => {
    const scheduledDate = new Date(payroll.scheduledDate);
    
    // Skip invalid dates
    if (isNaN(scheduledDate.getTime()) || scheduledDate.getFullYear() < 2023) {
      return false; // Skip invalid dates
    }
    
    // Check if it falls in the current month/year
    return scheduledDate.getMonth() + 1 === currentMonth && scheduledDate.getFullYear() === currentYear;
  });

  console.log("ressss:", allPayrolls);

  // Return the payroll ID of the first matching payroll or null
  return payrolls.length > 0 ? payrolls[0].payrollId : null;
};





// Method to navigate to CreateNew page
// const navigateToCreateNew = () => {
//   console.log("Navigating to CreateNew..."); // Check if this logs
//   const payrollId = getCurrentMonthPayrollId();
//   console.log("Payroll ID:", payrollId);
//   // ...
// };

const approvePayroll = async (id: any) => {

}

const declinePayroll = async (id: any) => {

}
// Helper function for formatting scheduled date
const formatScheduledDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'long' }); // Get the month name
  return `${month} Salary Payment`; // Return the formatted string
};


const checkState = (id: any) => {
  return deletePayrollsId.value.includes(id) ? true : false;
};
const handlePayroll = (id: any) => {
  if (deletePayrollsId.value.includes(id)) {
    deletePayrollsId.value = deletePayrollsId.value.filter((value: any) => {
      return value !== id;
    });
  } else {
    deletePayrollsId.value.push(id);
  }
};
const addAllPayrollsForDelete = () => {
  if (deletePayrollsId.value[0]) {
    deletePayrollsId.value.length = 0;
  } else {
    responseData.value.forEach((value: any) => {
      deletePayrollsId.value.push(value.id);
    });
  }
};

const deleteSinglePayroll = async () => {
  if (deletePayrollsId.value[0]) {
    deleting.value = true;

    const response = await request(
      payrollStore.delete(deletePayrollsId.value[0]),
      deleting
    );

    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);
    showSuccess.value = true;

    
    if (successResponse && typeof successResponse !== "undefined") {
      responseData.value = responseData.value.filter((data: any) => {
        return !deletePayrollsId.value.includes(data.id) && data.id;
      });
      responseData.value.message = "Payroll deleted succesfully";
      deletePayrollsId.value.length = 0;
      render.value = true;
    }
  }
};

const deleteManyPayrolls = async () => {
  if (deletePayrollsId.value[0]) {
    if (deletePayrollsId.value.length < 2) {
      deleteSinglePayroll();
    } else {
      deleting.value = true;

      const response = await request(
        payrollStore.deleteMany(deletePayrollsId.value),
        deleting
      );

      handleError(response, userStore);
      const successResponse = handleSuccess(response, showSuccess);

      if (successResponse && typeof successResponse !== "undefined") {
        responseData.value.data = responseData.value.data.filter(
          (data: any) => {
            return !deletePayrollsId.value.includes(data.id) && data.id;
          }
        );

        render.value = true;
      }
    }
  }
};

// Add a new reactive variable to track the sorting order
const isAscendingOrder = ref(true);

// Method to sort responseData by month
const sortByMonth = () => {
  responseData.value.data.sort((a: any, b: any) => {
    const monthA = new Date(a.scheduledDate).getMonth();
    const monthB = new Date(b.scheduledDate).getMonth();
    return isAscendingOrder.value ? monthA - monthB : monthB - monthA;
  });

  // Toggle the sorting order for the next click
  isAscendingOrder.value = !isAscendingOrder.value;
};
const confirmRemovePayrolls = () => {
  // console.log("hit",deletePayrollsId.value)
  confirmType.value = "delete";
  confirmMessage.value.message = `Do you really  want to delete multiple Payrolls(${deletePayrollsId.value.length})?  `;
  showConfirm.value = true;
};

const fetchPayroll = async (page = 1) => {
  loading.value = true;
  try{
  const totalPayrollCached = cache("total_payroll");
  if (typeof totalPayrollCached !== "undefined") {
    loading.value = false;
    responseData.value.data = totalPayrollCached;
    // @ts-ignore comment above the problematic line
    responseData.value.sort(function(a, b){return b.id - a.id})
  }
  const response = await request(payrollStore.index(organisationId,null, "Pending", 10, page), loading);

  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    // cache("total_payroll", successResponse.data.data.pageItems);
    responseData.value.data = successResponse.data.data.pageItems;
    currentPage.value = successResponse.data.data.currentPage;
    totalPages.value = successResponse.data.data.numberOfPages;
    totalItems.value = successResponse.data.data.pageSize * totalPages.value; 
    // @ts-ignore comment above the problematic line
    responseData.value.data.sort(function(a, b){return b.id - a.id})

    // @ts-ignore comment above the problematic line
    // const sorted = responseData.value.sort(function(a, b){return b.id - a.id})
    // console.log(responseData.value, sorted);
    console.log("********",  responseData.value.data);
  }
} catch(error) {
  console.error("Error fetching payroll:", error);
} finally {
   loading.value = false;
}
}; 
// fetchPayroll();
fetchPayroll(currentPage.value);
const updatePage = (page: number) => {
  fetchPayroll(page);
}

// navigateToCreateNew();
</script>
<template>
  <div>
    <div class="bg-white h-full rounded-lg py-6 space-y-5 overflow-auto scrollbar-hide">
      <confirmAlert
        :showConfirm="showConfirm"
        @closeConfirm="showConfirm = false"
      >
        <template #title> Delete</template>
        <template #confirm>
          <span @click="[deleteManyPayrolls(), (showConfirm = false)]">
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
        {{ responseData.message }}</successAlert
      >
      <div class="px-5 py-2 flex justify-between lg:space-x-0 space-x-3">
        <div class="space-y-6">
          <div>
            <h3 class="font-bold text-2xl">Payroll History</h3>
            <p class="text-sm pt-1 text-black-200 font-semimedium">
              Continue edit to complete process
            </p>
          </div>

          <div class="flex space-x-6">
            <div class="relative cursor-pointer">
              <div class="flex space-x-2 text-blue">
                <span
                @click="sortByMonth()"
                class="text-sm pt-1 font-semimedium whitespace-nowrap"
                  >Filter by Date</span
                >
                <span class="pt-2">
                  <IIncDecBlue />
                </span>
                <CalenderInterface
                  v-if="openCalender == true"
                  class="absolute top-[30px] w-full"
                />
              </div>
            </div>
            <!--  -->
            <!-- <div class="flex space-x-2">
              <span
                class="text-sm pt-1 font-semimedium text-[#626669] whitespace-nowrap"
                >Filter by Status</span
              >
              <span class="pt-2">
                <IIncDec />
              </span>
            </div> -->
            <!--  -->
          </div>
        </div>

        <div v-if="responseData && responseData.data" class="flex space-x-4">
          <!-- <div>
            <ButtonBlue :disabled="true">
              <template v-slot:placeholder>Download Csv</template>
            </ButtonBlue>
          </div> -->
          <div>
            <ButtonLightBlue
              textColor="text-red"
              :disabled="deletePayrollsId[0] ? false : true"
              class="text-red text-sm font-medium bg-red-light px-4+1 py-3 rounded-full"
              :class="!deletePayrollsId[0] ? 'disabled:opacity-75' : ' '"
              @click="confirmRemovePayrolls()"
            >
              <template v-slot:placeholder>
                <spinner v-if="deleting == true"></spinner>
                <span v-else>Delete</span>
              </template>
            </ButtonLightBlue>
          </div>
        </div>
      </div>
      <div class="space-y-10">
        <!-- table -->
        <div class="border-t border-grey">
          <div class="py-6">
            <!-- <div class="flex space-x-2 items-center px-6">
              <span class="pt-2">
                <FCheckBoxComp
                  :value="
                    responseData && responseData.data &&
                    deletePayrollsId.length === responseData.length
                      ? true
                      : false
                  "
                  name="payrolls"
                  @click="addAllPayrollsForDelete()"
                />
              </span>
              <span class="text-sm pt-1 font-semimedium text-[#626669]"
                >Select All</span
              >
            </div> -->
            <div class="align-middle inline-block min-w-full">
              <div class="overflow-hidden sm:rounded-lg">
                <spinner
                  v-if="loading == true"
                  class="flex justify-center items-center lg:h-[400px] h-[300px]"
                />
                <table class="min-w-full table-fixed">
                  <thead
                    v-if="responseData && responseData.data"
                    class="text-black-200 text-sm text-left"
                  >
                    <tr>
                      <!-- <th
                        scope=" col"
                        class="py-4 font-normal text-left whitespace-nowrap"
                      >
                        S/N
                      </th> -->
                      <th
                        scope=" col"
                        class="py-4 font-normal text-left whitespace-nowrap"
                      >
                        Title
                      </th>
                      <th
                        scope=" col"
                        class="py-4 font-normal text-left whitespace-nowrap"
                      >
                      Total Net Pay
                      </th>
                      <th
                        scope="col"
                        class="py-4 font-normal text-left whitespace-nowrap"
                      >
                        Total Payment
                      </th>
                      <th
                        scope="col"
                        class="py-4 font-normal text-left whitespace-nowrap"
                      >
                        Total Deductions
                      </th>
                      <th
                        scope="col"
                        class="py-4 font-normal text-left whitespace-nowrap"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        class="py-4 font-normal text-left whitespace-nowrap"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    v-if="responseData.data"
                    class="bg-white divide-y divide-grey-200"
                  >
                    <!--  -->
                    <tr
                      v-for="(pay, index) in responseData.data"
                      :key="pay.payrollId"
                      class="text-black-100"
                    >
                    <!-- <td class="py-4 whitespace-nowrap">
                        <div class="text-left flex flex-col">
                          <span class="text-sm font-semimedium"
                            >{{ index+1 }}
                          </span>
                          <span class="text-xs text-gray-rgba-3"> </span>
                        </div>
                      </td> -->
                      <td class="py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-3">
                          <!-- <FCheckBoxComp
                            :value="checkState(pay.payrollId)"
                            @click="handlePayroll(pay.payrollId)"
                          /> -->

                          <div class="flex flex-col">
                            <span class="text-sm font-semimedium"> {{ formatScheduledDate(pay.scheduledDate) }} </span
                            >
                            <span class="text-xs text-gray-rgba-3"> 
                              {{ pay.totalEmployees }} {{ pay.totalEmployees <= 1 ? 'Employee' : 'Employees' }}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 whitespace-nowrap">
                        <div class="text-left flex flex-col">
                          <span class="text-sm font-semimedium"
                            >₦{{ pay.totalNetPay ? currency(pay.totalNetPay) : "0" }}
                          </span>
                        </div>
                      </td>
                      <td class="py-4 whitespace-nowrap">
                        <div class="font-normal text-left flex flex-col">
                          <span class="text-sm font-semimedium"
                            >₦{{ pay.totalGrossPay ? currency(pay.totalGrossPay) : "0" }}</span
                          >
                          <span class="text-xs text-gray-rgba-3">Gross</span>
                        </div>
                      </td>
                      <td class="py-4 flex whitespace-nowrap">
                        <div class="font-normal text-left flex flex-col">
                          <span class="text-sm font-semimedium"
                            >₦ {{ pay.totalDeductions ? currency(pay.totalDeductions) : "0" }}
                          </span>
                          <span class="text-xs text-gray-rgba-3">Tax, Pensions, Health</span>
                        </div>
                      </td>
                      <td class="py-4 items-center text-left whitespace-nowrap">
                        <div class="font-normal flex flex-col">
                          <span
                            class="text-sm font-semimedium"
                            :style="{
                              color:
                                pay && pay.status 
                                  ? pay.status.toLowerCase() === 'approved'
                                    ? '#46A754'
                                    : pay.status.toLowerCase() === 'pending'
                                    ? '#FFB400'
                                    : pay.status.toLowerCase() === 'rejected'
                                    ? '#FF4C51'
                                    : 'inherit'
                                  : 'inherit', // Fallback color if pay or pay.status is null
                            }"
                            >{{ pay.status }}
                          </span>
                          <span class="text-xs text-gray-rgba-3"
                            >Submitted: {{ pay.submissionDate ? formatDate(pay.submissionDate) : "N/A" }}</span
                          >
                        </div>
                      </td>
                      <td class="py-4 text-left whitespace-nowrap">
                        <div class="flex items-center space-x-2">
                          <div class="flex w-full justify-between">
                            <ButtonBlue
                                @click="approvePayroll(pay.payrollId)"
                            >
                                <template v-slot:placeholder>Approve</template>
                            </ButtonBlue>
                            <ButtonLightRed
                                @click="declinePayroll(pay.payrollId)"
                            >
                            <template v-slot:placeholder>Decline</template>
                          </ButtonLightRed>
                            <ButtonLightBlue
                              @click="
                                router.push(
                                  `/dashboard/payroll/pending-approval/${pay.payrollId}`
                                )
                              "
                            >
                              <template v-slot:placeholder>View</template>
                            </ButtonLightBlue>
                            <!-- <button>
                              <IMenuVertical />
                            </button> -->
                          </div>
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
                        <template #heading> Payroll </template>
                        <template #desc>
                          All payroll history will be displayed here. Click on
                          “create payroll” <br />
                          to get started
                        </template>
                        <template #actions>
                          <button
                          @click="router.push('/dashboard/payroll/add-new')"
                            class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
                          >
                            + Create payroll
                          </button>
                        </template>
                      </EmptyState>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!-- end of table -->
        <Pagination 
        :currentPage="currentPage" 
        :totalPages="totalPages"
        :pageSize="pageSize"
        :totalItems="totalItems"
        @updatePage="updatePage"
        />
      </div>
    </div>
  </div>
</template>

<style></style>
