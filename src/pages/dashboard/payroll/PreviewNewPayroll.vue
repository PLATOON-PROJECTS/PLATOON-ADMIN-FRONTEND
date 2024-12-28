<script setup lang="ts">
import { ref, provide, watch, onMounted, nextTick, reactive, computed } from "vue";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../components/timer/Spinner.vue";

import { Create, EmployeePayroll } from "../../../service/payroll/interface/payroll.interface";
import {
  IIncDec,
  IMenuVertical,
  IArrowLeftTail,
  ITablePencil,
} from "../../../core/icons";
import Departments from "../../../components/dropdowns/department.vue";

import ButtonBlueOutline from "../../../components/buttons/ButtonBlueOutline.vue";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import ButtonLightBlue from "../../../components/buttons/ButtonLightBlue.vue";
import general from "../../../components/dropdowns/general.vue";

import AddBonus from "../../../modals/AddBonus.vue";
import AddDeduction from "../../../modals/AddDeduction.vue";
import EmptyState from "../../../components/EmptyState.vue";
import { useRouter } from "vue-router";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import {
  usePayrollStore,
  useEmployeeStore,
  useUserStore,
} from "../../../store/index";
import cache from "../../../composables/swr_cache";
import { getItem } from "../../../core/utils/storage.helper";
import AddTax from "../../../modals/AddTax.vue";
import AddNetPay from "../../../modals/AddNetPay.vue";

// initialize router
const router = useRouter();

// initialize store
const payrollStore = usePayrollStore();
const userStore = useUserStore();
const employeeStore = useEmployeeStore();

// variables

const departmentName = ref("");
const showDepartment = ref(false);
const data = ref({ department: "all" });

const showSuccess = ref(false);
const loading = ref(false);
const saving = ref(false);
const showBonus = ref(false);
const showDeduction = ref(false);
const showTax = ref(false);
const showNetPay = ref(false);
const dataObj = ref<any>({});
const responseData = ref<any>({ data: [], message: "" });
const employeeMap = ref<Record<string, string>>({}); 
const successMessage = ref("Action successful");

const dataObjj = reactive({
    employees: []
});

const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10); 
const totalItems = ref(0);
const employeeSalaries = ref([]);
const totalSalaries = ref(0);
const totalEmployees = ref(0);

const payrollData = ref<any>(null);
const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;

const month = computed(() => {
  const date = new Date(responseData.value?.payroll?.scheduledDate);
  return isNaN(date.getTime()) ? "" : date.toLocaleString('default', { month: 'long' }); 
});

const period = computed(() => {
  const date = new Date(responseData.value?.payroll?.scheduledDate);
  if (isNaN(date.getTime())) {
    return ""; 
  }
  const year = date.getFullYear();
  const startOfMonth = new Date(year, date.getMonth(), 1);
  const endOfMonth = new Date(year, date.getMonth() + 1, 0);
  return `${startOfMonth.toLocaleDateString()} - ${endOfMonth.toLocaleDateString()}`;
});

const edit = ref(false);
// inject and provide
provide("showDepartment", showDepartment);
provide("selectedDepartment", [data, departmentName]);
provide("employeeMap", employeeMap);
// method

const formatNumber = (number:number) => {
  return number.toLocaleString();
}

const fetchPayroll = async () => {
  const { payrollId } = router.currentRoute.value.query;
  const parsedPayrollId = Number(payrollId);
  console.log("AAA", parsedPayrollId)
  const organisationId = parsedUserInfo?.customerInfo?.organisationId;

  if (isNaN(parsedPayrollId)) {
    console.error("Invalid parameters");
    return;
  }

  try {
    const response = await payrollStore.getPayroll({
      organisationId,
      payrollId: parsedPayrollId,
      pageSize: 10,
      pageNumber: 1,
    });

    if (response.succeeded) {
      responseData.value = response.data.pageItems; 
      console.log("Payroll data fetched successfully:", responseData.value);
      const data = response.data.pageItems;
      employeeSalaries.value = data.employeeSalaries;
      totalSalaries.value = data.totalSalaries;
      totalEmployees.value = data.totalEmployees;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Error fetching payroll:", error);
  }
};

// onMounted(() => {
  fetchPayroll();
// });

const removeEmployee = async (employeeId: number) => {
  const { payrollId } = router.currentRoute.value.query;
  const parsedPayrollId = Number(payrollId);

  if (isNaN(parsedPayrollId)) {
    console.error("Invalid payroll ID");
    return;
  }

  try {
    loading.value = true; 
    const response = await payrollStore.removeEmployee(parsedPayrollId, employeeId);
    
    if (response.succeeded) {
      showSuccess.value = true;
      successMessage.value = "Employee removed successfully!";
      await fetchPayroll(); 
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Error removing employee:", error);
  } finally {
    loading.value = false; 
  }
};

const saveAndContinue = async () => {
  const payrollId = responseData.value?.payroll?.id;
  if (payrollId) {
    await router.push({ 
      name: "dashboard.payroll.summary", 
      query: { payrollId } 
    });
  } else {
    console.error("Payroll ID is missing.");
  }
};

const selectedEmployee = ref({ id: null, bonus: 0, deduction: 0, taxAmount: 0, netPay: 0 });

const handleBonusSave = (bonusData: { amount: number; reason: string }) => {
  console.log("Bonus Data Received:", bonusData);
  const employee = responseData.value.data.find((e: { id: null }) => e.id === selectedEmployee.value.id);
  if (employee) {
    employee.bonus = { ...bonusData }; 
  }
  showBonus.value = false;
};

const handleDeductionSave = (deductionData: { amount: number; reason: string }) => {
  console.log("Deduction Data Received:", deductionData);
  const employee = responseData.value.data.find((e: { id: null }) => e.id === selectedEmployee.value.id);
  if (employee) {
    employee.deduction = { ...deductionData }; 
   
  }
  showDeduction.value = false;
};

const handleTaxSave = (taxData: { amount: number }) => {
  console.log("Tax Data Received:", taxData);
  const employee = responseData.value.data.find(
    (e: { id: null }) => e.id === selectedEmployee.value.id
  );
  console.log("Taxxxx:", taxData.amount);

  if (employee) {
    employee.taxAmount = taxData.amount;
  }
  showTax.value = false;
};

const handleNetSave = (netPayData: { amount: number }) => {
  console.log("NetPay Data Received:", netPayData);
  const employee = responseData.value.data.find(
    (e: { id: null }) => e.id === selectedEmployee.value.id
  );
  if (employee) {
    employee.netPay = netPayData.amount; 
  }
  showNetPay.value = false;
};

</script>
<template>
  <div class="bg-white h-full rounded-t-lg py-6 space-y-5 overflow-auto scrollbar-hide">
    <!-- modals -->
    <AddBonus
    v-if="showBonus"
    :employeeId="selectedEmployee.id"
    :employeeAmount="selectedEmployee.bonus"
    @save_bonus="handleBonusSave"
    @close_bonus="showBonus = false"
    />
    <AddDeduction
    v-if="showDeduction"
    :employeeId="selectedEmployee.id"
    :employeeAmount="selectedEmployee.deduction"
    @save_deduction="handleDeductionSave"
    @close_deduction="showDeduction = false"
    />
    <AddTax
    v-if="showTax"
    :employeeId="selectedEmployee.id"
    :employeeAmount="selectedEmployee.taxAmount"
    @save_tax="handleTaxSave"
    @close_tax="showTax = false"
    />
    <AddNetPay
    v-if="showNetPay"
    :employeeId="selectedEmployee.id"
    :employeeAmount="selectedEmployee.netPay"
    @save_net="handleNetSave"
    @close_net="showNetPay = false"
    />
    <!-- successAlert -->
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ successMessage }}</successAlert
    >
    <div class="px-5 py-2">
      <div class="space-y-6">
        <div class="flex justify-between">
            <div class="flex space-x-5">
                <div class="pt-1">
                  <IArrowLeftTail />
                </div>
                <div>
                  <h3 class="font-bold text-2xl whitespace-nowrap">
                    {{ month }} Salary Payment
                  </h3>
                  <p class="text-sm pt-1 font-semimedium whitespace-nowrap">
                    <span class="text-black-200">Payroll period: </span>
                    <span>{{ period }}</span>
                  </p>
                </div>
              </div>
              <div>
                <ButtonBlue @click="saveAndContinue">
                <template v-slot:placeholder>
                    <span>Save & Continue</span></template>
                </ButtonBlue>
            </div>
        </div>

        <div class="relative w-20">
          <div class="flex space-x-2">
            <span
              @click="showDepartment = !showDepartment"
              class="text-sm pt-1 font-semimedium text-black-200 whitespace-nowrap cursor-pointer"
            >
              {{ departmentName === "" ? "Sort by Department" : departmentName }}</span
            >
            <span class="pt-2">
              <IIncDec @click="showDepartment = !showDepartment" />
            </span>
          </div>

          <div
            class="absolute z-50 max-h-56 shadow-lg scrollbar-hide overflow-auto top-8 w-auto"
            v-if="showDepartment == true"
          >
            <div class="">
              <component :is="Departments"></component>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="space-y-10">
      <spinner
        v-if="loading == true"
        class="flex justify-center items-center lg:h-[400px] h-[300px]"
      />
      <!-- table -->
      <div v-else>
        <div class="border-t border-grey">
          <div class="py-6">
            <div class="align-middle inline-block min-w-full">
              <div class="overflow-hidden sm:rounded-lg">
                <table id="data-table" class="min-w-full table-fixed">
                  <thead
                    class="text-black-200 text-sm text-left"
                  >
                    <tr>
                      <th scope="col" class="py-4 text-left flex items-center space-x-3">
                        <span> Name </span>
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Gross Pay
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Bonus
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Deductions
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Tax
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Net Pay
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-grey-200">
                    <tr
                      v-for="(employee, index) in responseData?.employeeSalaries"
                      :key="employee.employeeId"
                      class="text-black-100"
                    >
                      <td class="py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-3">
                          <div class="flex flex-col">
                            <span class="text-sm font-semimedium">{{ employee.firstName }} {{ employee.lastName }}</span>
                            <span class="text-xs text-gray-rgba-3">₦{{ employee.grossPay }}/yr</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 whitespace-nowrap">
                        <div class="text-left flex flex-col">
                          <span class="text-sm font-semimedium"> ₦{{ employee.grossPay }}  </span>
                          <span class="text-xs text-gray-rgba-3">Direct deposit</span>
                        </div>
                      </td>
                      <td class="py-4 whitespace-nowrap">
                        <div class="flex space-x-2">
                          <ITablePencil
                            @click="
                              [
                                (showBonus = true),
                                (selectedEmployee.id = employee.id),
                              ]
                            "
                          />
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-sm font-semimedium">
                              ₦{{ employee.bonus?.amount || 0 }}
                            </span>
                            <span class="text-xs text-gray-rgba-3">Commisions</span>
                          </div>
                        </div>
                      </td>
                    
                      <td class="py-4 flex whitespace-nowrap">
                        <div class="flex space-x-2">
                          <ITablePencil
                            @click="
                              [
                                (showDeduction = true),
                                (selectedEmployee.id = employee.id),
                              ]
                            "
                          />
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-sm font-semimedium">
                                ₦{{ employee.deduction?.amount || 0 }}
                            </span>
                            <span class="text-xs text-gray-rgba-3">Pensions, Health</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 text-left whitespace-nowrap">
                        <div class="flex space-x-2">
                          <ITablePencil
                            @click="
                              [
                                (showTax = true),
                                (selectedEmployee.id = employee.id),
                              ]
                            "
                            />
                          <div class="font-normal flex flex-col">
                            <span class="text-sm font-semimedium">  ₦{{ employee.taxAmount || 0 }} </span>
                            <span class="text-xs text-gray-rgba-3">LAGIT</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 text-left whitespace-nowrap">
                        <div class="flex space-x-2">
                          <ITablePencil 
                            @click="
                              [
                                (showNetPay = true),
                                (selectedEmployee.id = employee.id),
                              ]
                            "
                          />
                          <div class="flex w-full justify-between">
                            <div class="text-left flex flex-col">
                              <span class="text-sm font-semimedium"> ₦{{ employee.netPay || 0 }} </span>
                              <span class="text-xs text-gray-rgba-3">Direct deposit</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-3">
                          <div class="flex flex-col">
                            <span class="text-sm font-semimedium text-red" @click="removeEmployee(employee.employeeId)">Remove</span>                          
                          </div>
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
