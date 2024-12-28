<script lang="ts" setup>
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
import Departments from "../../../../components/dropdowns/department.vue";
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
import { formatNumber, dateFormat } from "../../../../core/helpers/actions"
// @ts-ignore comment
import html2pdf from 'html2pdf.js';

import { useRoute } from "vue-router";
import { getItem } from "../../../../core/utils/storage.helper";

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
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));
const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;
let data = ref<{
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  telephone: number | null;
  active: number | null;
  group: number | null;
  grade: number | null;
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
  group: null,
  grade: null,
  account_details: {
    bank: null,
    account_name: null,
    account_number: null,
  },
});
const grades = ref<any[]>([]);

const departmentName = ref("");
const showDepartment = ref(false);
const gradeName = ref("");
const showGrade = ref(false);
const banks = ref<string[]>([]);

const grandTotal = ref({
  gross_salary: 0,
  bonus: 0,
  deductions: 0,
  tax: 0,
  net_salary: 0,
})

const showSuccess = ref(false);

const errorResponse = ref("");
const responseData = ref<any>({ data: null, message: "" });

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

// const saveChanges = async () => {
//   // check if form is formattted correctly
//   const isFormCorrect = await v$.value.$validate();

//   if (isFormCorrect == true) {
//     const dataObj = {
//       email: v$.value.email.$model as string,
//       firstname: v$.value.firstname.$model as string,
//       lastname: v$.value.lastname.$model as string,
//       telephone: v$.value.telephone.$model as number,
//       active: 1,
//       department: data.value as object,
//       grade_id: data.value as object,
//       account_details: {
//         bank: data.value.account_details.bank as string,
//         account_name: data.value.account_details.account_name as string,
//         account_number: v$.value.account_details.account_number
//           .$model as number,
//       },

//       // photo: data.photo as any,
//     };
//     // console.log(dataObj, v$.value.account_details.account_number.$model);

//     loading.value = true;
//     const response = await request(
//       employeeStore.update(dataObj, employeeId.value),
//       loading
//     );

//     handleError(response, userStore);
//     const successResponse = handleSuccess(response, showSuccess);

//     if (successResponse && typeof successResponse !== "undefined") {
//       responseData.value = successResponse;
//       getProfile();
//     }
//   }
// };

// const getProfile = async () => {
//   // console.log(employeeId.value);
//   const response = await request(
//     employeeStore.show(organisationId ,employeeId.value), 
//     fetchLoading
//   );

//   // handleError(response, userStore);
//   const successResponse = handleSuccess(response);

//   if (successResponse && typeof successResponse !== "undefined") {
//     // console.log(successResponse.data);
//     data.value.email = successResponse.data.data.email;
//     data.value.firstname = successResponse.data.data.firstname;
//     data.value.lastname = successResponse.data.data.lastname;
//     data.value.telephone = successResponse.data.data.telephone;
//     data.value.active = successResponse.data.data.active;
//     data.value.group = successResponse.data.data.group ? successResponse.data.data.group : '---';
//     data.value.grade = successResponse.data.data.grade ? successResponse.data.data.grade : '---';
//     gradeName.value =
//       successResponse.data.data.grade && successResponse.data.data.grade.name;
//     departmentName.value = successResponse.data.data.group ?  successResponse.data.data.group.name : '---';
//     data.value.account_details.bank =
//       successResponse.data.data.bank_data &&
//       successResponse.data.data.bank_data.bank;
//     data.value.account_details.account_name =
//       successResponse.data.data.bank_data &&
//       successResponse.data.data.bank_data.account_name;
//     data.value.account_details.account_number =
//       successResponse.data.data.bank_data &&
//       successResponse.data.data.bank_data.account_number;
//     // data.value = successResponse.data;
//     responseData.value.data = successResponse.data;
//     // console.log(response.data.data);

//     responseData.value.data.data.payments.forEach((item:any) => { 
//       if(item.status == 'completed'){
//         grandTotal.value.gross_salary = item.meta && item.meta.salary.gross ? grandTotal.value.gross_salary + item.meta.salary.gross : 0;
//         grandTotal.value.net_salary = item.meta && item.meta.salary.total ? grandTotal.value.net_salary + item.meta.salary.total : 0;
//         grandTotal.value.bonus = item.meta ? grandTotal.value.bonus + item.meta.breakdown.bonus : 0;
//         grandTotal.value.deductions = item.meta ? grandTotal.value.deductions + item.meta.breakdown.deductions : 0;
//         grandTotal.value.tax = item.meta ? grandTotal.value.tax + item.meta.breakdown.tax : 0;
//       }
//      });

//     emit(
//       "setSingleEmployeeName",
//       `${data.value.firstname} ${data.value.lastname}`
//     );
//   } else {
//     errorResponse.value = response.data.message;
//   }
// };

// getProfile();
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

    html2pdf().set(opt).from(element).save();
}

</script>

<template>
  <spinner
      v-if="fetchLoading == true"
      class="flex justify-center items-center lg:h-[400px] h-[300px]"
    />
  <div class="pt-6 pb-24 lg:px-16+2" v-else>
    <div class="mx-auto lg:w-[500px] space-y-18">
      <div class="space-y-9 lg:px-[30px] px-[20px]" id="element-to-print">
        <!-- <div v-if="responseData.data"> -->
        <div>
          <!-- <h3 class="text-black-rgba text-2xl font-black">NGN {{ formatNumber(responseData.data.data.grade.salary) }}</h3> -->
          <h3 class="text-black-rgba text-2xl font-black">NGN 1,500,000</h3>
          <span class="text-sm text-gray-rgba-3">Gross Salary</span>
        </div>

        <div class="divide-grey-200 divide-y">
          <div class="text-base flex items-center justify-between py-4">
            <span class="font-semi-medium text-gray-rgba-3">Basic/Net</span>
            <!-- <span class="text-black-100 font-semi-medium">N{{ formatNumber(responseData.data.data.grade.salary) }}</span> -->
            <span class="text-black-100 font-semi-medium">N 990,000.32</span>
            <!-- <span class="text-black-100 font-semi-medium">n/a</span> -->
            <!-- <span class="text-black-100 font-semi-medium">n/a</span> -->
          </div>
          <div class="text-base flex items-center justify-between py-4">
            <span class="font-semi-medium text-gray-rgba-3">Pension</span>
            <!-- <span class="text-black-100 font-semi-medium">N{{ formatNumber(grandTotal.bonus) }}</span> -->
            <span class="text-black-100 font-semi-medium">N19,000</span>
            <!-- <span class="text-black-100 font-semi-medium">n/a</span> -->
          </div>
          <div class="text-base flex items-center justify-between py-4">
            <span class="font-semi-medium text-gray-rgba-3">Health</span>
            <!-- <span class="text-black-100 font-semi-medium">N{{ formatNumber(responseData.data.data.grade.salary) }}</span> -->
            <span class="text-black-100 font-semi-medium">N32,000</span>
            <!-- <span class="text-black-100 font-semi-medium">n/a</span> -->
            <!-- <span class="text-black-100 font-semi-medium">n/a</span> -->
          </div>
          <div class="text-base flex items-center justify-between py-4">
            <span class="font-semi-medium text-gray-rgba-3">Housing</span>
            <!-- <span class="text-black-100 font-semi-medium">N{{ formatNumber(responseData.data.data.grade.salary) }}</span> -->
            <span class="text-black-100 font-semi-medium">N24,000</span>
            <!-- <span class="text-black-100 font-semi-medium">n/a</span> -->
            <!-- <span class="text-black-100 font-semi-medium">n/a</span> -->
          </div>
          <div class="text-base flex items-center justify-between py-4">
            <span class="font-semi-medium text-gray-rgba-3">Transport</span>
            <!-- <span class="text-black-100 font-semi-medium">N{{ formatNumber(grandTotal.deductions) }}</span> -->
            <span class="text-black-100 font-semi-medium">N16,800</span>
            <!-- <span class="text-black-100 font-semi-medium">n/a</span> -->
          </div>
          <div class="text-base flex items-center justify-between py-4">
            <span class="font-semi-medium text-gray-rgba-3">Tax</span>
            <!-- <span class="text-black-100 font-semi-medium">N{{ formatNumber(grandTotal.tax) }}</span> -->
            <span class="text-black-100 font-semi-medium">N150,000</span>
            <!-- <span class="text-black-100 font-semi-medium">n/a</span> -->
          </div>
        </div>
      </div>

      <div class="lg:space-x-4 lg:block flex  flex-col justify-center lg:space-y-0 space-y-2">
        <button
          class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm whitespace-nowrap"
        >
          Update employee salary
        </button>
        <button
          class="text-[#003b3d] bg-red-light text-sm text-bold px-4+1 py-2.5+1 rounded-full whitespace-nowrap"
          @click="exportToPDF()"
        >
          Print salary
        </button>
      </div>
    </div>
  </div>
</template>
