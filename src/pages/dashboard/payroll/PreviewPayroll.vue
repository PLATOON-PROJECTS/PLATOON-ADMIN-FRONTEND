<script setup lang="ts">
import { ref, computed, inject } from "vue";

import ButtonLightBlue from "../../../components/buttons/ButtonLightBlue.vue";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../components/timer/Spinner.vue";

import EmptyState from "../../../components/EmptyState.vue";
import { useRouter } from "vue-router";
import { IUserThree, IMenuVertical } from "../../../core/icons";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import { usePayrollStore, useUserStore, useWalletStore } from "../../../store/index";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import {
  dateValidateLesserOrEqual,
  dateValidateGreater,
} from "../../../validations/validate";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import cache from "../../../composables/swr_cache";
import {currency} from '../../../core/utils/currencyType'

const router = useRouter();

// initialize store
const payrollStore = usePayrollStore();
const userStore = useUserStore();

// variables

const showSuccess = ref(false);
const saving = ref(false);
const data = ref({ department: "all" });
const loading = ref(false);
const savingDraft = ref(false);
const settings = ref<any>();
const edit = ref(false);
const draft = ref({
  month: "",
  year: "",
  department: null,
  start_date: "",
  end_date: "",
  draft: true,
});
const dataObj = ref<any>({
  month: "",
  year: "",
  department: null,
  start_date: "",
  end_date: "",
});
const responseData = ref<any>({
  data: [],
  message: "Payroll  created  successfully",
});
const successMessage = ref("");
const walletData = ref({
  data: {
    acc_details: {
      account_number: "",
      account_name: "",
      bank: "",
    }
  }
})

const walletStore = useWalletStore();

// provide and inject
const render = inject<any>("render");

// methods
const saveAsDraft = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect == true) {
    savingDraft.value = true;
    draft.value.month = new Date(dataObj.value.start_date).toLocaleString(
      "default",
      { month: "long" }
    );

    draft.value.year = new Date(
      dataObj.value.start_date
    ).getFullYear() as unknown as string;

    draft.value.start_date = dataObj.value.start_date;
    draft.value.end_date = dataObj.value.end_date;

    const response = await request(
      payrollStore.create(draft.value as any),
      savingDraft
    );

    // console.log(response);
    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);

    if (successResponse && typeof successResponse !== "undefined") {
      // console.log(successResponse.data);
      successMessage.value = "payroll added to draft successfully";
      setTimeout(() => {
        render.value = true;
        router.push({ name: 'dashboard.payroll.drafts'})
      }, 6000);
    }
  }
};

const fetchPayrollSettings = async () => {
  const response = await request(payrollStore.getSettings());

  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);
    settings.value = successResponse.data;

    // console.log(successResponse.data);
  }
};

const preview = async () => {
  loading.value = true;

  const response = await request(
    payrollStore.preview(data.value.department),
    loading
  );
  // console.log(loading.value);

  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    if (typeof successResponse.data.data.length !== "undefined") {
      responseData.value.data = successResponse.data.data;
    } else {
      responseData.value.data.push(successResponse.data.data);
    }

    // console.log(successResponse.data);
  } else {
    responseData.value.data = [];
  }
};
const createPayroll = async () => {
  // check if form is formatted correctly

  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect == true) {
    dataObj.value.month = new Date(dataObj.value.start_date).toLocaleString(
      "default",
      { month: "long" }
    );

    dataObj.value.year = new Date(dataObj.value.start_date).getFullYear();
    saving.value = true;

    // console.log(dataObj.value);
    const response = await request(
      payrollStore.create(dataObj.value as any),
      saving
    );

    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);

    if (successResponse && typeof successResponse !== "undefined") {
      // console.log(successResponse.data);
      successMessage.value = "payroll created successfully";
      setTimeout(() => {
        render.value = true;
        router.push({name: 'dashboard.payroll'});
      }, 6000);
    }
  }
};

const fetchWallet = async () => {
  const walletCached = cache("wallet");

  if (typeof walletCached !== "undefined") {
    walletData.value.data = walletCached;
  }

  const response = await request(walletStore.getWallet());

  const successResponse = handleSuccess(response);
  if (successResponse && typeof successResponse !== "undefined") {
    cache("wallet", successResponse.data.data);
    walletData.value.data = successResponse.data.data;
    // console.log(walletData.value.data);
    // console.log('jdkjfhkjhdfkjjdhfkjhkd')
  }
};


// fetchWallet();

// fetchPayrollSettings();
// preview();

// validations rule
const rules = computed(() => {
  return {
    start_date: {
      required: helpers.withMessage("Start  date is required", required),
      dateValidateGreater: helpers.withMessage(
        "Start date cannot be less  than today",
        () =>
          dateValidateLesserOrEqual(
            new Date(Date.now()),
            dataObj.value.start_date
          ) as any
      ),
    },
    end_date: {
      required:
        settings.value && settings.value.data.frequency === "bi-monthly"
          ? helpers.withMessage("End  date is required", required)
          : "",
      dateValidateGreater: helpers.withMessage(
        "End date cannot be lesser than start date",
        () =>
          dateValidateGreater(
            dataObj.value.end_date,
            dataObj.value.start_date
          ) as any
      ),
    },
  };
});
const v$ = useVuelidate(rules as any, dataObj);
</script>
<template>
  <div>
    <!-- successAlert -->
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ successMessage }}</successAlert
    >
    <div
      class="bg-white h-full rounded-t-lg py-6 space-y-5 overflow-auto scrollbar-hide"
    >
      <div class="px-5 py-2 flex justify-between lg:space-x-0 space-x-3">
        <div class="space-y-6 md:flex justify-between items-center w-full">
          <div>
            <h3 class="font-bold lg:text-2xl text-xl whitespace-nowrap">
              Preview payroll
            </h3>
            <p
              class="text-sm pt-1 text-black-200 font-semimedium whitespace-nowrap"
            >
              Continue edit to complete process
            </p>
          </div>
          <div>
            <ButtonLightBlue @click="createPayroll()">
              <template v-slot:placeholder>
                <spinner v-if="saving == true" />
                <span v-else
                  >Submit For Approval</span
                ></template
              >
            </ButtonLightBlue>
          </div>
        </div>

        <!-- <div>
          <div class="flex space-x-4" v-if="responseData.data[0]">
            <ButtonBlue text-color="text-white">
              <template v-slot:placeholder>Download data</template>
            </ButtonBlue>
            <ButtonLightBlue textColor="text-red">
              <template v-slot:placeholder>Delete</template>
            </ButtonLightBlue>
          </div>
        </div> -->
      </div>
      <div class="space-y-10">
        <!-- table -->

        <div class="border-t border-grey">
          <div class="py-6">
            <div class="px-4">
              <spinner
                v-if="loading == true"
                class="flex justify-center items-center lg:h-[400px] h-[300px]"
              />
              <div v-else class="bg-white">
                <div class="md:block">
                  <div v-if="responseData.data[0]">
                    <div
                      v-for="(data, index) in responseData.data"
                      :key="index"
                    >
                      <div  class="flex sm:flex-row flex-col sm:space-x-5 space-x-0 sm:space-y-0 space-y-5">
                        <div class="ml-[9px]">
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-xs font-bold mb-2">Start Date:</span>
                            <input
                              type="date"
                              @click="edit = true"
                              v-model="dataObj.start_date"
                              class="text-xs font-medium py-3 px-5 md:w-[200px] border border-black/20 rounded-full"
                            />
                            <div
                              v-if="v$.start_date.$error"
                              class="text-red-600 text-xs"
                            >
                              {{ "* " + v$.start_date.$errors[0].$message }}
                            </div>
                          </div>
                        </div>
                        <div v-if="settings && settings.data.frequency === 'bi-monthly'">
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-xs font-bold mb-2">End Date:</span>
                            <input
                              type="date"
                              @click="edit = true"
                              v-model="dataObj.end_date"
                              class="text-xs font-medium py-3 px-5 md:w-[200px] border border-black/20 rounded-full"
                            />
                            <div
                              v-if="v$.end_date.$error"
                              class="text-red-600 text-xs"
                            >
                              {{ "* " + v$.end_date.$errors[0].$message }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="md:flex">
                        <div class="md:w-[70%] w-[100%] py-6 px-2 md:block">
                          <div>
                            <div>
                              <div class="grid sm:grid-cols-2 grid-cols-1 sm:h-[120px] text-white bg-[#003b3d] p-8 rounded-md sm:space-y-0 space-y-5">
                                <div>
                                  <p class="text-[13px] font-bold mb-3">Total Payroll Charge</p>
                                  <span>₦ {{
                                    data.total_charge ? currency(data.total_charge) : "0"
                                  }}</span>
                                </div>
                                <div>
                                  <p class="text-[13px] font-bold mb-3">Employees on Payroll</p>
                                  <span>{{
                                    data.total_employees
                                      ? data.total_employees
                                      : "0"
                                  }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="mt-[30px]">
                            <div class="rounded-md overflow-hidden border border-black/20">
                              <div class="py-3 px-3 text-[14px] border-b border-black/20 bg-black/10">
                                <span>Salary</span>
                              </div>
                              <div class="grid sm:grid-cols-3 grid-cols-1">
                                <div class="p-6 py-3">
                                  <p class="font-bold text-[12px] mb-2">Total Salaries</p>
                                  <span>₦ {{
                                    data.total_salaries ? currency(data.total_salaries) : "0"
                                  }}</span>
                                </div>
                                <div class="p-6 py-3">
                                  <p class="font-bold text-[12px] mb-2">Total Processing fee</p>
                                  <span>₦ {{
                                    data.total_payroll_fee
                                      ? data.total_payroll_fee
                                      : "0"
                                  }}</span>
                                </div>
                                <div class="p-6 py-3 border-l border-black/20">
                                  <p class="font-bold text-[12px] mb-2">Total Salary Payout</p>
                                  <span>₦ {{
                                    data.total_payroll_fee || data.total_salaries
                                      ? currency(data.total_payroll_fee + data.total_salaries)
                                      : "0"
                                  }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="md:w-[30%] w-[100%] py-6 px-2 md:block">
                          <div class="lg:p-6 sm:p-3 p-6 lg:py-[20px] sm:py-[20px] py-[20px] bg-gradient-to-br from-[#1e3f32] from-10% via-[#cc4a94]-500 via-30% to-[#003b3d] to-90% h-[120px] w-full rounded-lg flex flex-col space-y-1">
                            <div class="w-[160px] bank-name">
                              <span class="block md:text-[12px] sm:text-[9.5px] text-[12px] text-white !min-w-[300px]">{{ walletData?.data.acc_details.bank }}: {{ walletData?.data.acc_details.account_name }}</span>
                            </div>
                            <span class="font-bold text-white text-[20px]">{{
                              data.wallet_balance ? data.wallet_balance : "___"
                            }}</span>
                            <span class="text-[9.5px] text-white font-bold">Account Number: {{ walletData?.data.acc_details.account_number }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="w-full">
                    <div class="w-full no-hover">
                      <EmptyState>
                        <template #icon>
                          <IUserThree />
                        </template>
                        <template #heading> Payroll Preview</template>
                        <template #desc>
                          Preiewed payroll will be displayed here. Click on “add 
                          payroll” <br />
                          to add new payroll
                        </template>
                        <template #actions>
                          <button
                            @click="router.push('/dashboard/payroll/add-new')"
                            class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
                          >
                            + Add payroll
                          </button>
                        </template>
                      </EmptyState>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        <!-- end of table -->
        <div class="md:flex px-4 md:space-x-3" v-if="responseData.data[0]">
          <!-- <div>
            <ButtonLightBlue @click="router.go(-1)">
              <template v-slot:placeholder>
                <span>Back</span>
              </template>
            </ButtonLightBlue>
          </div> -->
          <div>
            <ButtonLightBlue @click="createPayroll()">
              <template v-slot:placeholder>
                <spinner v-if="saving == true" />
                <span v-else
                  >Submit For Approval</span
                ></template
              >
            </ButtonLightBlue>
          </div>
          <div>
            <ButtonBlue v-if="edit == true" @click="saveAsDraft">
              <template v-slot:placeholder>
                <spinner v-if="savingDraft == true" />
                <span v-else>Save As Draft</span>
              </template>
            </ButtonBlue>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bank-name{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 1130px) {
  .bank-name{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: .8em !important;
  }
}
</style>
