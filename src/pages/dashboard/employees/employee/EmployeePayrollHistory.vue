<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, provide, reactive, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { email, helpers, minLength, sameAs } from "@vuelidate/validators";
import ButtonBlue from "../../../../components/buttons/ButtonBlue.vue";
import EmptyState from "../../../../components/EmptyState.vue";
import Grade from "../../../../components/dropdowns/grades.vue";
import {
  IEyeOpened,
  ICaretUpDown,
  IMenuVertical,
  IUserThree,
  IArrowDown,
} from "../../../../core/icons";
import SuccessAlert from "../../../../components/alerts/SuccessAlert.vue";
import { request } from "../../../../composables/request.composable";
import handleError from "../../../../composables/handle_error.composable";
import handleSuccess from "../../../../composables/handle_success.composable";
import spinner from "../../../../components/timer/Spinner.vue";
import {
  useEmployeeStore,
  useUserStore,
  useWalletStore,
} from "../../../../store/index";
import {
  stringValidate,
  numberValidate,
} from "../../../../validations/validate";
import html2pdf from 'html2pdf.js';

import { formatNumber, dateFormat } from "../../../../core/helpers/actions"

import { useRoute } from "vue-router";

// initialize route
const route = useRoute();

// initialize store
const employeeStore = useEmployeeStore();
const userStore = useUserStore();
const walletStore = useWalletStore();

// variables
const disabled = ref(true);
const showBank = ref(false);
const loading = ref(false);
const fetchLoading = ref(false);
const valid = ref(false);

let data = ref<{
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  telephone: number | null;
  active: number | null;
  group_id: number | null;
  grade_id: number | null;
  account_details: {
    bank: string | null;
    account_name: string | null;
    account_number: number | null;
  };
}>({
  firstname: null,
  lastname: null,
  email: null,
  telephone: null,
  active: 1,
  group_id: null,
  grade_id: null,
  account_details: {
    bank: null,
    account_name: null,
    account_number: null,
  },
});
const grades = ref<any[]>([]);
const payments:any = ref([
  {
    payroll: {
      created_at: "",
    },
    meta: {
      salary: {
        gross: 0,
        total: 0,
      },
      breakdown: {
        tax: 0,
        bonus: 0,
        deduction: 0,
      }
    }
  }
]);

const departmentName = ref("");
const showDepartment = ref(false);
const gradeName = ref("");
const showGrade = ref(false);
const banks = ref<string[]>([]);

const showSuccess = ref(false);

const errorResponse = ref("");
const responseData = ref<any>({ data: null, message: "" });
const slip = ref({
  name: "",
  narration: "",
  paymentDate: "",
  grossPay: 0,
  bonus: 0,
  deductions: 0,
  tax: 0,
  netPay: 0,
})

// provide and inject
provide("showDepartment", showDepartment);
provide("selectedDepartment", [data, departmentName]);
provide("showGrade", showGrade);
provide("selectedGrade", [data, gradeName]);
// emits
const emit = defineEmits<{
  (e: "setSingleEmployeeName", name: string): void;
  (e: "doNotEdit", value: boolean): void;
}>();

// computed
const employeeId = computed(() => {
  return route.params.id as string;
});

// methods

const parseBank = (item: any) => {
  return item.bankName;
};
const fetchBank = async () => {
  const response = await request(walletStore.getBanks());

  // handleError(response, userStore);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);

    banks.value = successResponse.data.data;
  }
};
const setGrades = (value: any[]) => {
  // console.log("set grade fired");
  gradeName.value = "";
  grades.value = value;
  showGrade.value = false;
};

const onInput = (phone: number, phoneObject: any, input: any) => {
  if (phoneObject?.formatted) {
    data.value.telephone = phoneObject.number;
    valid.value = phoneObject.valid;
  }
};

const validatePhone = () => {
  return valid.value;
};




// fetchBank();
// validations rule
const rules = computed(() => {
  return {
    email: {
      email: helpers.withMessage("Must be a valid email", email),
    },

    firstname: {
      stringValidate: helpers.withMessage(
        "First name can only include alphabets",
        () => stringValidate(data.value.firstname as string) as any
      ),
    },
    lastname: {
      stringValidate: helpers.withMessage(
        "Last name can only include alphabets",
        () => stringValidate(data.value.lastname as string) as any
      ),
    },
    telephone: {
      validatePhone: helpers.withMessage("Invalid Phone Number", validatePhone),
    },
    account_details: {
      account_number: {
        numberValidate: helpers.withMessage(
          "Account number can only include numbers",
          () =>
            numberValidate(
              data.value.account_details.account_number as number
            ) as any
        ),
      },
    },
    // active: {
    //   numberValidate: helpers.withMessage(
    //     "Active line can only include numbers",
    //     () => numberValidate(data.value.active as number) as any
    //   ),
    // },

    // group_id: {
    //   numberValidate: helpers.withMessage(
    //     "GroupId line can only include numbers",
    //     () => numberValidate(data.value.group_id as number) as any
    //   ),
    // },
    // grade_id: {
    //   numberValidate: helpers.withMessage(
    //     "GradeId line can only include numbers",
    //     () => numberValidate(data.value.grade_id as number) as any
    //   ),
    // },

    // bank: {
    //   stringValidate: helpers.withMessage(
    //     "Bank name can only include alphabets",
    //     () => stringValidate(data.value.account_details.bank as string) as any
    //   ),
    // },
  };
});

const v$ = useVuelidate(rules as any, data);

// define emits
defineExpose({
  // saveChanges,
  disabled,
  loading,
  v$,
});

const exportToPDF = () => {
    var element = document.getElementById('element-to-print');
    var opt = {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts:true,
        floatPrecision: 16,
        image: { type: 'jpeg', quality: 1.50 },
        html2canvas:  { scale: 4 },
    };

    html2pdf().set(opt).from(element).save(`${responseData.value.data.data.firstname+' '+responseData.value.data.data.lastname+slip.value.narration}-${slip.value.paymentDate}`);
}

const slipInfo = (item:any) => {
  slip.value = {
    name: responseData.value.data.data.firstname+' '+responseData.value.data.data.lastname,
    narration: item.narration,
    paymentDate: item.payroll ? dateFormat(item.payroll.created_at) : '--/--/---- --:-- --',
    grossPay: item.meta ? formatNumber(item.meta.salary.gross) : 0,
    bonus: item.meta ? formatNumber(item.meta.breakdown.bonus) : 0,
    deductions: item.meta ? formatNumber(item.meta.breakdown.deductions) : 0,
    tax: item.meta ? formatNumber(item.meta.breakdown.tax) : 0,
    netPay: item.meta ? formatNumber(item.meta.salary.total) : 0,
  }

  exportToPDF();
}


const router = useRouter()
</script>
<template>
  <spinner
    v-if="fetchLoading == true"
    class="flex justify-center items-center lg:h-[400px] h-[300px]"
  />
  <div v-else class="w-full overflow-auto">
    <EmptyState v-if="!responseData?.data && !responseData?.data?.payments?.length">
      <template #icon>
        <IUserThree />
      </template>
      <template #heading> Payment details </template>
      <template #desc> No payment found </template>
    </EmptyState>
    <div v-else class="align-middle inline-block min-w-full">
      <div class="overflow-hidden sm:rounded-lg">
        <table class="min-w-full table-fixed">
          <thead class="text-black-200 text-sm text-left">
            <tr class="whitespace-nowrap">
              <th scope="col" class="py-4 font-normal text-left items-center space-x-3">
                <span> Payroll </span>
              </th>
              <th scope=" col" class="py-4 font-normal text-left">
                Payment Date
              </th>
              <th scope="col" class="py-4 font-normal text-left">Gross Pay</th>
              <th scope="col" class="py-4 font-normal text-left">Bonus</th>
              <th scope="col" class="py-4 font-normal text-left">Deductions</th>
              <th scope="col" class="py-4 font-normal text-left">Tax</th>
              <th scope="col" class="py-4 font-normal text-left">Net Pay</th>
              <th scope="col" class="py-4 font-normal text-left">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-grey-200">
            <tr v-for="(item, index) in payments" :key="index" class="text-black-100">
              <td class="py-4 whitespace-nowrap">
                <div class="flex items-center space-x-3">
                  <div class="flex flex-col">
                    <span class="text-sm font-semimedium">{{ item.narration }}</span>
                    <!-- <span class="text-sm font-semimedium">April 2022</span>
                    <span class="text-xs text-gray-rgba-3">₦800,000/yr</span> -->
                  </div>
                </div>
              </td>
              <td class="py-4 whitespace-nowrap">
                <div class="text-left flex flex-col">
                  <span class="text-sm font-semimedium">{{ item.payroll ? dateFormat(item.payroll.created_at) : '--/--/---- --:-- --' }}</span>
                  <span class="text-xs text-green">Direct deposit</span>
                </div>
              </td>
              <td class="py-4 whitespace-nowrap">
                <div class="font-normal text-left flex flex-col">
                  <span class="text-sm font-semimedium">₦{{ item.meta ? formatNumber(item.meta.salary.gross) : 0 }}</span>
                </div>
              </td>
              <td class="py-4 whitespace-nowrap">
                <div class="font-normal text-left flex flex-col">
                  <span class="text-sm font-semimedium">₦{{ item.meta ? formatNumber(item.meta.breakdown.bonus) : 0 }}</span>
                  <!-- <span class="text-xs text-gray-rgba-3">Commissions</span> -->
                </div>
              </td>
              <td class="py-4 text-left whitespace-nowrap">
                <div class="font-normal flex flex-col">
                  <span class="text-sm font-semimedium">₦{{ item.meta ? formatNumber(item.meta.breakdown.deductions) : 0 }}</span>
                  <!-- <span class="text-xs text-gray-rgba-3">Pensions, Health</span> -->
                </div>
              </td>
              <td class="py-4 text-left whitespace-nowrap">
                <div class="font-normal flex flex-col">
                  <span class="text-sm font-semimedium">₦{{ item.meta ? formatNumber(item.meta.breakdown.tax) : 0 }}</span>
                  <!-- <span class="text-xs text-gray-rgba-3">PAYEE</span> -->
                </div>
              </td>
              <td class="py-4 text-left whitespace-nowrap">
                <div class="font-normal flex flex-col">
                  <span class="text-sm font-semimedium">₦{{ item.meta ? formatNumber(item.meta.salary.total) : 0 }}</span>
                </div>
              </td>
              <td class="py-4 px-8 text-left whitespace-nowrap w-[18%]">
                <div class="flex items-center justify-between">
                  <button @click="slipInfo(item)"
                    class="text-[#003b3d] bg-red-light text-sm text-bold px-4+1 py-2 rounded-full">
                    Download Payslip
                  </button>
                  <!-- <button>
                    <IMenuVertical />
                  </button> -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Pagination -->

    <div class="px-6 mt-20 hidden items-center justify-between">
      <span class="opacity-50 text-sm font-semimedium whitespace-nowrap">Showing 1-6 of 30 items</span>

      <div class="flex items-center space-x-2">
        <span
          class="text-white bg-[#003b3d] text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full">1</span>
        <span class="text-sm w-8 h-8 flex items-center justify-center rounded-full border opacity-50">2</span>
        <span class="text-sm w-8 h-8 flex items-center justify-center rounded-full border opacity-50">3</span>
      </div>
    </div>

    <div class="hidden">
      <div class="bg-[#dcf7e6]" id="element-to-print">
        <div class="grid place-content-center h-[100px] w-full px-[60px] bg-[#ffffff]">
          <div class="mx-auto pt-[30px]">
            <img src="/images/png/logo.png" alt="logo" class="w-[200px]">
          </div>
        </div>
        <div class="mb-5 text-center bg-[#003b3d] p-2 pb-6">
          <h3 class="text-white text-[2.5em] uppercase">{{ slip.name }}</h3>
          <p class="text-md text-white/80 uppercase">{{ slip.narration }}</p>
          <p class="text-sm text-white/80 uppercase">{{ slip.paymentDate }}</p>
        </div>
        <div class="px-[60px] mb-4">
          <h3 class="text-black-rgba text-2xl font-black">NGN {{ slip.grossPay }}</h3>
          <span class="text-sm text-gray-rgba-3">Gross salary</span>
        </div>
        <div class="divide-grey-200 divide-y px-[70px]">
          <div class="text-base flex items-center justify-between py-4">
            <span class="font-semi-medium text-gray-rgba-3">Basic/Net</span>
            <span class="text-black-100 font-semi-medium">N{{ slip.netPay }}</span>
          </div>
          <div class="text-base flex items-center justify-between py-4">
            <span class="font-semi-medium text-gray-rgba-3">Bonus</span>
            <span class="text-black-100 font-semi-medium">N{{ slip.bonus }}</span>
          </div>
          <div class="text-base flex items-center justify-between py-4">
            <span class="font-semi-medium text-gray-rgba-3">Deductions</span>
            <span class="text-black-100 font-semi-medium">N{{ slip.deductions }}</span>
          </div>
          <div class="text-base flex items-center justify-between py-4">
            <span class="font-semi-medium text-gray-rgba-3">Tax</span>
            <span class="text-black-100 font-semi-medium">N{{ slip.tax }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
