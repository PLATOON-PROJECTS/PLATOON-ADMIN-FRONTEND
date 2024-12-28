<script setup lang="ts">
import { ref, provide, watch, onMounted, nextTick, reactive } from "vue";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../components/timer/Spinner.vue";

import { Create, EmployeePayroll } from "../../../service/payroll/interface/payroll.interface";
import {
  IIncDec,
  IMenuVertical,
  IUserThree,
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
const editInput = ref(false);
const loading = ref(false);
const saving = ref(false);
const showBonus = ref(false);
const showDeduction = ref(false);
const showTax = ref(false);
const showNetPay = ref(false);
const employeeId = ref("");
const employeeAmount = ref(0);
const dataObj = ref<any>({});
const responseData = ref<any>({ data: [], message: "" });
const employeeMap = ref<Record<string, string>>({}); 
const successMessage = ref("Action successful");
const showDropDown = ref(false);
const grandTotal = ref({
  grossPay: 0,
  bonus: 0,
  deductions: 0,
  taxAmount: 0,
  netPay: 0,
})

const dataObjj = reactive({
    employees: []
});

const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10); 
const totalItems = ref(0);

const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;

// const savingDraft = ref(false);
const edit = ref(false);
// const draft = ref({
//   month: "",
//   year: "",
//   department: null,
//   start_date: "",
//   end_date: "",
//   draft: true,
// });
// inject and provide
provide("showDepartment", showDepartment);
provide("selectedDepartment", [data, departmentName]);
provide("employeeMap", employeeMap);
// method

// const saveAsDraft = async () => {
//   savingDraft.value = true;

//   const day = new Date(Date.now()).getDate() as unknown as string;
//   const year = new Date(Date.now()).getFullYear() as unknown as string;
//   const month = new Date(Date.now()).toLocaleString("default", {
//     month: "long",
//   });
//   let numberMonth: any = new Date(Date.now()).getMonth() + 1;

//   if (numberMonth < 10) {
//     numberMonth = `0${numberMonth}`;
//   }

//   draft.value.year = year;
//   draft.value.month = month;
//   draft.value.start_date = `${year}-${numberMonth}-${day}`;

//   const response = await request(
//     payrollStore.create(draft.value as any),
//     savingDraft
//   );

//   console.log(response);
//   handleError(response, userStore);
//   const successResponse = handleSuccess(response, showSuccess);

//   if (successResponse && typeof successResponse !== "undefined") {
//     console.log(successResponse.data);
//   }
// };

const formatNumber = (number:number) => {
  return number.toLocaleString();
}
const fetchEmployees = async (page = 1) => {
  loading.value = true;

  const totalEmployeeCached = cache("total_employees");
  if (typeof totalEmployeeCached !== "undefined") {
    loading.value = false;
    responseData.value.data = totalEmployeeCached;
  }

  const response = await request(employeeStore.index(organisationId, 10, page), loading);
  const successResponse = handleSuccess(response);

  if (successResponse) {
    const employees = successResponse.data.data.pageItems;
    responseData.value.data = employees;
    console.log("$$$$$", employees)

    employees.forEach((employee: { firstName: any; lastName: any; id: string | number; }) => {
      const fullName = `${employee.firstName} ${employee.lastName}`;
      employeeMap.value[employee.id] = fullName;
      console.log("", fullName)
      console.log("Mapped Employee:", employee.id, fullName);
    });

    cache("total_employees", employees);
    currentPage.value = successResponse.data.data.currentPage;
    totalPages.value = successResponse.data.data.numberOfPages;
    totalItems.value = responseData.value.data.length; 
    return employees; 
  }
};


const handleSaveAndContinue = async () => {
  saving.value = true;

  try {
    const employeesSalary = responseData.value.data.map((employee: { id: any; bonus: any; deduction: any; taxAmount: any; netPay: any; }) => ({
      employeeId: employee.id,
      bonus: JSON.parse(JSON.stringify(employee.bonus || { amount: 0, reason: "" })),
      deduction: JSON.parse(JSON.stringify(employee.deduction || { amount: 0, reason: "" })),
      taxAmount: employee.taxAmount || 0,
      netPay: employee.netPay || 0,
    }));

    const payload = {
      organisationId,
      employeesSalary,
      paytype: "once",
      scheduledMonth: new Date().toISOString(),
    };

    console.log("Payload being sent:", JSON.stringify(payload));

    const response = await payrollStore.createPayroll(payload);

    if (response.succeeded) {
      const payrollId = response.data.payrollId; 
      console.log("----", payrollId)
      localStorage.setItem("payrollTableData", JSON.stringify(responseData.value.data));
      // showSuccess.value = true;
      // successMessage.value = "Payroll created successfully!";
      // router.push({ name: "PreviewNewPayroll", query: { payrollId } });
      router.push({ name: 'dashboard.payroll.confirm', query: { payrollId } });
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Error saving payroll:", error);
  } finally {
    saving.value = false;
  }
};

const loadSavedData = () => {
  const savedData = localStorage.getItem("payrollTableData");
  if (savedData) {
    responseData.value.data = JSON.parse(savedData);
  }
};

const handleSaveToDraft = async () => {
  saving.value = true;

  try {
    const employeesSalary = responseData.value.data.map((employee: { id: any; bonus: any; deduction: any; taxAmount: any; netPay: any; }) => ({
      employeeId: employee.id,
      bonus: JSON.parse(JSON.stringify(employee.bonus || { amount: 0, reason: "" })),
      deduction: JSON.parse(JSON.stringify(employee.deduction || { amount: 0, reason: "" })),
      taxAmount: employee.taxAmount || 0,
      netPay: employee.netPay || 0,
    }));

    const payload = {
      organisationId,
      employeesSalary,
      paytype: "once",
      scheduledMonth: new Date().toISOString(),
    };

    console.log("Payload being sent:", JSON.stringify(payload));

    const response = await payrollStore.savePayrollToDraft(payload);

    if (response.succeeded) {
      localStorage.setItem("payrollTableData", JSON.stringify(responseData.value.data));
      showSuccess.value = true;
      successMessage.value = "Payroll saved to draft successfully!";
      console.log("Paaaay", response);
      // Optionally, show a success message or navigate to another page
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Error saving payroll to draft:", error);
  } finally {
    saving.value = false;
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


onMounted(() => {
  loadSavedData();
  if (!responseData.value.data.length) {
    fetchEmployees();
  }
});
// fetchEmployees();


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
          <div>
            <h3 class="font-bold text-2xl">Create new Payroll</h3>
            <p class="text-sm pt-1 font-semimedium">
              <span class="text-black-200">Payroll period: </span>
              <span>&nbsp;</span>
            </p>
          </div>
          <!-- <div>
            <ButtonBlue @click="router.push('/dashboard/payroll/preview')">
              <template v-slot:placeholder>
                <span>Save & Continue</span></template
              >
            </ButtonBlue>
          </div> -->
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
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-grey-200">
                    <tr
                      v-for="(employee, index) in responseData && responseData.data"
                      :key="employee.id"
                      class="text-black-100"
                    >
                      <td class="py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-3">
                          <div class="flex flex-col">
                            <span class="text-sm font-semimedium">{{ employee.firstName }} {{ employee.lastName }}</span>
                            <span class="text-xs text-gray-rgba-3">₦{{ employee.grades.grossPay }}/yr</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 whitespace-nowrap">
                        <div class="text-left flex flex-col">
                          <span class="text-sm font-semimedium"> ₦{{ employee.grades.grossPay }}  </span>
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
                              ₦{{ employee.bonus ? employee.bonus.amount : 0 }}
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
                              ₦{{ employee.deduction ? employee.deduction.amount : 0 }}
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
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!-- Buttons -->
        <div class="px-5 flex space-x-4 mt-4 justify-left">
          <ButtonBlue @click="handleSaveAndContinue">
            <template v-slot:placeholder>
              <span>Save & Continue</span>
            </template>
          </ButtonBlue>
          <ButtonLightBlue @click="handleSaveToDraft">
            <template v-slot:placeholder>
              <span>Save changes for later</span>
            </template>
          </ButtonLightBlue>
        </div>
        <!-- Buttons -->
      </div>
    </div>
  </div>
</template>

<style></style>
