log
<script setup lang="ts">
import { ref, provide, watchEffect } from "vue";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import { IArrowLeftTail } from "../../../core/icons";
import FCheckedComponent from "../../../components/forms/FCheckBox.vue";
import FRadioComponent from "../../../components/forms/FRadioBox.vue";
import FSwitchBox from "../../../components/forms/FSwitchBox.vue";
import ButtonLightBlue from "../../../components/buttons/ButtonLightBlue.vue";
import { useRouter } from "vue-router";
import { request } from "../../../composables/request.composable";

import handleSuccess from "../../../composables/handle_success.composable";
import { usePayrollStore, useUserStore } from "../../../store/index";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../components/timer/Spinner.vue";
import { UpdateSettings } from "../../../service/payroll/interface/payroll.interface";
import month from "../../../components/dropdowns/month.vue";
import handleError from "../../../composables/handle_error.composable";
// initialize router

const router = useRouter();

// initialize store
const payrollStore = usePayrollStore();
const userStore = useUserStore();

// variable
const percentages = ref(["5", "15", "25", "50"]);
const showMonth = ref(false);

const selectedMonth = ref("");
const salaryBreakdown = ref([{ key: "", value: "" }]);
const showPayrollBonus = ref(false);
const showSalaryBreakdown = ref(false);
const data = ref<UpdateSettings>({
  frequency: "",
  scheduled_at: "",
  payroll: {
    bonus: {
      month: "",
      percentage: "",
    },
  },
  leave_bonus: "",
  payroll_pension: "",
  salary_breakdown: {},
});
const showpercentage = ref(false);
const showSuccess = ref(false);
const loading = ref(false);
const responseData = ref<any>([]);
const successMessage = ref("Payroll  settings updated successful");

// methods

const removeField = (id: number) => {
  if (salaryBreakdown.value.length > 1) {
    salaryBreakdown.value = salaryBreakdown.value.filter((value: any) => {
      return value !== salaryBreakdown.value[id];
    });
  }
};

const addMoreSalaryBreakdown = () => {
  salaryBreakdown.value.push({ key: "", value: "" });
};

const setShowpayRoll = (value: boolean) => {
  showPayrollBonus.value = value;
};

const setShowSalaryBreakdown = (value: boolean) => {
  showSalaryBreakdown.value = value;
};

const setFrequency = (frequency: string) => {
  // console.log(frequency);
  data.value.frequency = frequency;
};

const updatePayrollSettings = async () => {
  // set salary breakdown

  salaryBreakdown.value.forEach((breakdown) => {
    data.value.salary_breakdown[[breakdown.key] as any] = breakdown.value;
  });
  // console.log(data.value);
  loading.value = true;
  const response = await request(
    payrollStore.updateSettings(data.value),
    loading
  );
  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);
    fetchPayrollSettings();
  }
};
const fetchPayrollSettings = async () => {
  const response = await request(payrollStore.getSettings());
  handleError(response, userStore);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);
    responseData.value = successResponse.data;
    data.value.frequency = responseData.value.data.frequency
      ? responseData.value.data.frequency
      : "monthly";
    data.value.payroll.bonus.month = responseData.value.data.payroll_bonus
      ? responseData.value.data.payroll_bonus.month
      : "";
    data.value.payroll.bonus.percentage = responseData.value.data.payroll_bonus
      ? responseData.value.data.payroll_bonus.percentage
      : "";

    data.value.salary_breakdown = responseData.value.data.salary_options
      ? responseData.value.data.salary_options
      : {};
    salaryBreakdown.value.length = 0;
    Object.keys(data.value.salary_breakdown).map((item, i) => {
      const obj = {
        key: item,
        value: data.value.salary_breakdown[[item] as any],
      };
      salaryBreakdown.value.push(obj);
    });
  }
};

// provide and inject

provide("showMonth", showMonth);
provide<any>("selectedMonth", selectedMonth);

// watchers
// watchEffect(() => {
//   data.value.payroll.bonus.month = selectedMonth.value;
// });
// fetchPayrollSettings();
</script>
<template>
  <div class="px-5 bg-white rounded-sm rounded-t-lg py-10 space-y-16">
    <!--  -->
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ successMessage }}</successAlert
    >

    <div class="flex justify-between">
      <div class="flex space-x-5-1">
        <div class="pt-1">
          <button @click="router.back()">
            <IArrowLeftTail />
          </button>
        </div>
  
        <div class="flex flex-col">
          <h3 class="text-black-rgba font-medium text-2xl">Payroll Settings</h3>
          <span class="text-sm text-gray-rgba-3"
            >Make changes and manage payroll</span
          >
        </div>
      </div>
      <div>
        <ButtonBlue>
          <template v-slot:placeholder>
            <spinner v-if="loading == true" />
            <span v-else>Save</span></template
          >
        </ButtonBlue>
      </div>
    </div>
    <!--  -->

    <form
      @submit.prevent="updatePayrollSettings"
      class="space-y-6 divide-y divide-grey"
    >
      <div>
        <p class="text-base font-medium text-gray-rgba-4">Payroll Frequency</p>
        <div class="space-y-4">
          <div class="flex space-x-4">
            <FRadioComponent
              @set-value="setFrequency"
              value="daily"
              :checked="data.frequency === 'daily' ? true : false"
              id="daily"
              name="frequency"
              class="mt-1"
            />
            <div class="flex-col flex">
              <span class="text-black-rgba font-medium text-base">Daily</span>
              <!-- <span class="text-xs text-gray-rgba-3">50 Employees</span> -->
            </div>
          </div>

          <div class="flex space-x-4">
            <FRadioComponent
              @set-value="setFrequency"
              value="weekly"
              :checked="data.frequency === 'weekly' ? true : false"
              id="weekly"
              name="frequency"
              class="mt-1"
            />
            <div class="flex-col flex">
              <span class="text-black-rgba font-medium text-base">Weekly</span>
              <!-- <span class="text-xs text-gray-rgba-3">50 Employees</span> -->
            </div>
          </div>

          <div class="flex space-x-4">
            <FRadioComponent
              @set-value="setFrequency"
              value="bi-monthly"
              id="bi-monthly"
              :checked="data.frequency === 'bi-monthly' ? true : false"
              name="frequency"
              class="mt-1"
            />
            <div class="flex-col flex">
              <span class="text-black-rgba font-medium text-base"
                >Bi-Monthly</span
              >
              <!-- <span class="text-xs text-gray-rgba-3">50 Employees</span> -->
            </div>
          </div>
          <!--  -->

          <!--  -->
          <div class="flex space-x-4">
            <FRadioComponent
              @set-value="setFrequency"
              value="monthly"
              :checked="data.frequency === 'monthly' ? true : false"
              id="monthly"
              name="frequency"
              class="mt-1"
            />
            <div class="flex-col flex">
              <span class="text-black-rgba font-medium text-base">Monthly</span>
              <!-- <span class="text-xs text-gray-rgba-3">50 Employees</span> -->
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <!--  -->
      <div class="flex pt-6">
        <div class="lg:flex-1">
          <div class="flex">
            <div class="space-y-1">
              <p class="text-base font-medium">Payroll Bonus (13th Month)</p>
              <p class="text-sm text-gray-rgba-3">
                This allows you to add a percentage of the employees' salary as
                a 13th month bonus to be paid in the selected month.
              </p>
            </div>
            <FSwitchBox
              :value="showPayrollBonus"
              @set-value="setShowpayRoll"
              id="id1"
            />
          </div>
          <div class="grid lg:grid-cols-2 pt-7 gap-4" v-if="showPayrollBonus">
            <div class="relative">
              <input
                type="text"
                id="Name"
                @click="showpercentage = !showpercentage"
                :value="data.payroll.bonus.percentage"
                maxlength="55"
                class="input-float peer pr-10.5"
                placeholder=""
              />
              <label
                for="Name"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Percentage of Salary</label
              >
              <div
                v-if="showpercentage"
                class="space-y-5 p-6 shadow-rgba bg-white text-sm font-bold rounded-lg"
              >
                <p
                  v-for="percentage in percentages"
                  :key="percentage"
                  @click="
                    [
                      (data.payroll.bonus.percentage = percentage),
                      (showpercentage = false),
                    ]
                  "
                >
                  {{ percentage }}
                </p>
              </div>
            </div>
            <div class="relative">
              <input
                @click="showMonth = !showMonth"
                type="text"
                id="12"
                :value="data.payroll.bonus.month"
                maxlength="54"
                class="input-float peer pr-10.5"
                placeholder=""
              />
              <label
                for="12"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Month
              </label>

              <div v-if="showMonth" class="w-full absolute z-50">
                <month class="h-60 overflow overflow-scroll scrollbar-hide" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 w-full"></div>
        <!--  -->
      </div>
      <!--  -->
      <!--  -->
      <!--  -->
      <div class="flex pt-6">
        <div class="lg:flex-1">
          <div class="flex">
            <div class="space-y-1">
              <p class="text-base font-medium">Salary breakdown</p>
              <p class="text-sm text-gray-rgba-3">
                This allows you to add a percentage of the employees' salary as
                a 13th month bonus to be paid in the selected month.
              </p>
            </div>
            <FSwitchBox
              :value="showSalaryBreakdown"
              @set-value="setShowSalaryBreakdown"
              id="id2"
            />
          </div>

          <div class="" v-if="showSalaryBreakdown">
            <div
              class="grid gap-4"
              v-for="(breakdown, i) in salaryBreakdown"
              :key="i"
            >
              <div class="grid lg:grid-cols-2 pt-7 gap-4" :id="i + 'index'">
                <div class="relative">
                  <input
                    type="text"
                    id="Nam"
                    v-model="breakdown.key"
                    maxlength="55"
                    class="input-float peer pr-10.5"
                    placeholder=""
                  />
                  <label
                    for="Nam"
                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                  >
                    Item</label
                  >
                </div>
                <div class="relative">
                  <div class="flex space-x-3">
                    <input
                      type="text"
                      v-model="breakdown.value"
                      id="1sa"
                      maxlength="54"
                      class="input-float peer pr-10.5"
                      placeholder=""
                    />
                    <label
                      for="1sa"
                      class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                    >
                    </label>
                  </div>
                  <span
                    v-if="salaryBreakdown.length > 1"
                    class="font-extrabold cursor-pointer"
                    @click="removeField(i)"
                    >X</span
                  >
                </div>
              </div>
            </div>
            <!--  -->
            <div class="flex mt-8">
              <ButtonLightBlue @click="addMoreSalaryBreakdown">
                <template v-slot:placeholder>+ Add new item</template>
              </ButtonLightBlue>
            </div>
          </div>
        </div>
        <div class="flex-1 w-full"></div>
        <!--  -->
      </div>
      <!--  -->
      <!--  -->
      <!--  -->
      <div class="flex pt-6">
        <div class="lg:flex-1">
          <div class="flex">
            <div class="space-y-1">
              <p class="text-base font-medium">Payroll Bonus (13th Month)</p>
              <p class="text-sm text-gray-rgba-3">
                This allows you to add a percentage of the employees' salary as
                a 13th month bonus to be paid in the selected month.
              </p>
            </div>
            <FSwitchBox :value="false" id="id3" />
          </div>
          <div class="grid lg:grid-cols-2 pt-7 gap-4">
            <div class="relative">
              <input
                type="text"
                id="Name"
                maxlength="55"
                class="input-float peer pr-10.5"
                placeholder=""
              />
              <label
                for="Name"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Item</label
              >
            </div>
          </div>
        </div>
        <div class="flex-1 w-full"></div>
        <!--  -->
      </div>
      <!--  -->
      <!--  -->
      <!--  -->
      <div class="flex py-6">
        <div class="lg:flex-1">
          <div class="flex">
            <div class="space-y-1">
              <p class="text-base font-medium">Payroll Pension</p>
              <p class="text-sm text-gray-rgba-3">
                This allows you add a percentage of your employees salary as
                leave allowance to be paid when an employee goes on leave.
              </p>
            </div>
            <FSwitchBox :value="false" id="id4" />
          </div>
        </div>
        <div class="flex-1 w-full"></div>
        <!--  -->
      </div>
      <!--  -->
      <!--  -->
      <!--  -->
      <div class="flex py-6">
        <div class="lg:flex-1">
          <div class="flex">
            <div class="space-y-1">
              <p class="text-base font-medium">Payroll NHF Contribution</p>
              <p class="text-sm text-gray-rgba-3">
                This allows you add a percentage of your employees salary as
                leave allowance to be paid when an employee goes on leave.
              </p>
            </div>
            <FSwitchBox
              :value="false"
              id="
            id5"
            />
          </div>
        </div>
        <div class="flex-1 w-full"></div>
        <!--  -->
      </div>
      <!--  -->
      <!--  -->
      <!--  -->
      <div class="flex py-6">
        <div class="lg:flex-1">
          <div class="flex">
            <div class="space-y-1">
              <p class="text-base font-medium">Payroll NSITF Contribution</p>
              <p class="text-sm text-gray-rgba-3">
                This allows you add a percentage of your employees salary as
                leave allowance to be paid when an employee goes on leave.
              </p>
            </div>
            <FSwitchBox :value="false" id="id6" />
          </div>
        </div>
        <div class="lg:flex-1 w-full"></div>
        <!--  -->
      </div>
      <!--  -->
      <!--  -->
      <!--  -->
      <div class="flex py-6">
        <div class="lg:flex-1">
          <div class="flex">
            <div class="space-y-1">
              <p class="text-base font-medium">Payroll ITF Contribution</p>
              <p class="text-sm text-gray-rgba-3">
                This allows you add a percentage of your employees salary as
                leave allowance to be paid when an employee goes on leave.
              </p>
            </div>
            <FSwitchBox :value="false" id="id7" />
          </div>
        </div>
        <div class="flex-1 w-full"></div>
        <!--  -->
      </div>
      <ButtonBlue>
        <template v-slot:placeholder>
          <spinner v-if="loading == true" />
          <span v-else>Save</span></template
        >
      </ButtonBlue>
      <!--  -->
    </form>
  </div>
</template>

<style></style>
