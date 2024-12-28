<script lang="ts" setup>
import { ref, provide, reactive, computed, inject, Ref } from "vue";
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

import { useRoute } from "vue-router";
import { getItem } from "../../../../core/utils/storage.helper";
import { getCountryCode } from "../../../../core/helpers/country_code";

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
const fetchLoading = ref(true);
const valid = ref(false);
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));
const defaultCountryCode = ref("234"); 
// Inject isEditForm from parent component
const isEditForm = inject('isEditForm') as Ref<boolean>;
const props = defineProps<{
  childComponentRef: any; // Define the prop type
}>();


let data = ref<{
  userId: number | null;        
  gender: string | null; 
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  telephone: string | null; 
  status: string | null;
  group_id: number | null;
  grade_id: number | null;
  countryCode: string | null; 
  account_details: {
    bank: string | null;
    account_name: string | null;
    account_number: number | null; 
  };
}>({
  userId: null,              
  gender: null,
  firstname: null,
  lastname: null,
  email: null,
  telephone: null,
  status: null,
  group_id: null,
  grade_id: null,
  countryCode: null, // Initialize countryCode
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

const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;
// Access the organisationId safely
const organisationId = parsedUserInfo?.customerInfo?.organisationId;

const capitalizeFirstLetter = (name: string | null) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

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

const onInput = (phone: string, phoneObject: any, input: any) => {
  if (phoneObject?.formatted) {
    data.value.telephone = phoneObject.number; 
    // data.value.countryCode = phoneObject.countryCode || '234'; 
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
//     const dataObj:any = {
//       email: v$.value.email.$model as string,
//       firstname: v$.value.firstname.$model as string,
//       lastname: v$.value.lastname.$model as string,
//       telephone: {
//         number: v$.value.telephone.$model as string, 
//         countryCode: data.value.countryCode as string, 
//       },      
//       status: data.value.status as string,
//       department: data.value.group_id as number,
//       grade_id: data.value.grade_id as number,
//       account_details: {
//         bank: data.value.account_details.bank as string,
//         account_name: data.value.account_details.account_name as string,
//         account_number: v$.value.account_details.account_number
//           .$model as number,
//       },

//       // photo: data.photo as any,
//     };

    
//     if(dataObj.department == "---"){
//       dataObj.department = null;
//       dataObj.grade_id = null;
//     }
//     // console.log(dataObj);

    
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
const saveChanges = async () => {
    const isFormCorrect = await v$.value.$validate();

    if (isFormCorrect) {
        const dataObj = {
          userId: data.value.userId, 
          isActive: data.value.status === 'Active', 
            firstName: v$.value.firstname.$model,
            lastName: v$.value.lastname.$model,
            countryCode: data.value.countryCode,
            phoneNumber: data.value.telephone,
            gender: data.value.gender,
            employementType: "Full time", 
            email: v$.value.email.$model,
            departmentId: data.value.group_id,
            gradeId: data.value.grade_id,
        };
        loading.value = true;
        const response = await request(
            employeeStore.update(dataObj),
            loading
        );

        handleError(response, userStore);
        const successResponse = handleSuccess(response, showSuccess);

        if (successResponse && typeof successResponse !== "undefined") {
            responseData.value = successResponse;
            getProfile();
            isEditForm.value = false; 
            props.childComponentRef.disabled = true; 
        }
    }
};


const getProfile = async () => {
  console.log(employeeId.value);
  const response = await request(
    employeeStore.show(employeeId.value, organisationId),
    fetchLoading
  );

  // handleError(response, userStore);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log("*****",successResponse.data);
    const employeeData = successResponse.data.data.employee;
    console.log("*****", employeeData);
    // Map the values from the response to the data object
    data.value.email = employeeData.user.email;
    data.value.firstname = capitalizeFirstLetter(employeeData.user.firstname);
    data.value.lastname = capitalizeFirstLetter(employeeData.user.lastname);
    data.value.gender = employeeData.user.gender.toLowerCase() === "male" ? "male" : "female";
    data.value.telephone = employeeData.user.phone.number;
    data.value.countryCode = getCountryCode(employeeData.user.phone.countryCode) || defaultCountryCode.value;   
    data.value.status = employeeData.isActive ? 'Active' : 'Inactive';     
    data.value.group_id = employeeData.department ? employeeData.department.id : '---';
    data.value.grade_id = employeeData.grade ? employeeData.grade.id : '---';
    gradeName.value = employeeData.grade ? employeeData.grade.name : '---';
    departmentName.value = employeeData.department ? employeeData.department.name : '---';
    data.value.account_details.bank = employeeData.bank_data?.bank ?? '---';
    data.value.account_details.account_name = employeeData.bank_data?.account_name ?? '---';
    data.value.account_details.account_number = employeeData.bank_data?.account_number || '';
    responseData.value.data = successResponse.data;
    data.value.userId = employeeData.user.id;
       // console.log(response.data.data);

    emit(
      "setSingleEmployeeName",
      `${data.value.firstname} ${data.value.lastname}`
    );
  } else {
    errorResponse.value = response.data.data.message;
  }
};

getProfile();
// fetchBank();

const fullName = computed({
  get() {
    return `${data.value.firstname || ''} ${data.value.lastname || ''}`.trim();
  },
  set(value: string) {
    const names = value.split(' ');
    data.value.firstname = names[0] || '';
    data.value.lastname = names.length > 1 ? names.slice(1).join(' ') : '';
  }
});

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
  saveChanges,
  disabled,
  loading,
  v$,
});

</script>
<template>
  <div class="">
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}</successAlert
    >

    <!--  -->
    <spinner
      v-if="fetchLoading == true"
      class="flex justify-center items-center lg:h-[400px] h-[300px]"
    />

    <div v-else class="py-6 lg:px-16+2">
      <div>
        <EmptyState v-if="!responseData?.data">
          <template #icon>
            <IUserThree />
          </template>
          <template #heading> Employees details </template>
          <template #desc> Resource not found </template>
        </EmptyState>
        <div v-else class="space-y-9">
          <div>
            <h3 class="text-black-rgba font-medium text-base">
              Update profile
            </h3>
            <span class="text-sm text-gray-rgba-3"
              >Edit your profile information</span
            >
          </div>
          <form action="" @submit.prevent="saveChanges" class="space-y-6">
            <div class="space-y-4-1">
              <h4 class="text-base text-black-200 font-medium">Contact</h4>
              <div class="grid lg:grid-cols-3 gap-4">
                <div
                  class="relative"
                  @click="[(disabled = false), emit('doNotEdit', disabled)]"
                >
                  <input
                    type="text"
                    id="fullName"
                    v-model="fullName"
                    :disabled="disabled"
                    maxlength="110"
                    class="input-float peer pr-10.5"
                    placeholder=""
                  />
                  <label
                    for="fullName"
                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                  >
                    Fulll Name</label
                  >
                  <div v-if="v$.firstname.$error || v$.lastname.$error" class="text-red text-xs">
                    {{ "* " + (v$.firstname.$error ? v$.firstname.$errors[0].$message : v$.lastname.$errors[0].$message) }}
                  </div>
                </div>

                <!-- <div
                  class="relative"
                  @click="[(disabled = false), emit('doNotEdit', disabled)]"
                >
                  <input
                    type="text"
                    id="lastname"
                    v-model="data.lastname"
                    maxlength="55"
                    :disabled="disabled"
                    class="input-float text-black peer pr-10.5"
                    placeholder=""
                  />
                  <label
                    for="Name"
                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                  >
                    Last name</label
                  >
                  <div v-if="v$.lastname.$error" class="text-red text-xs">
                    {{ "* " + v$.lastname.$errors[0].$message }}
                  </div>
                </div> -->
                <div
                  class="relative"
                  @click="[(disabled = false), emit('doNotEdit', disabled)]"
                >
                  <input
                    type="email"
                    id="Email"
                    v-model="data.email"
                    maxlength="54"
                    :disabled="disabled"
                    class="input-float peer pr-10.5"
                    placeholder=""
                  />
                  <label
                    for="Email"
                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                  >
                    Email address</label
                  >
                  <div v-if="v$.email.$error" class="text-red text-xs">
                    {{ "* " + v$.email.$errors[0].$message }}
                  </div>
                </div>
                <div class="relative" @click="[(disabled = false), emit('doNotEdit', disabled)]">
                  <select
                    id="gender"
                    v-model="data.gender"
                    :disabled="disabled"
                    class="input-float peer pr-10.5 text-black"
                  >
                    <option disabled value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <label
                    for="gender"
                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                  >
                    Gender
                  </label>
                </div>
                

                <div
                  class="relative"
                  @click="[(disabled = false), emit('doNotEdit', disabled)]"
                >
                  <!-- <div
                    :value="data.telephone"
                    @input="onInput"
                    class="text-black text-sm border py-2"
                  ></div> -->
                  <input
                  type="text"
                  id="Telephone"
                  v-model="data.telephone"
                  :disabled="disabled"
                  maxlength="110"
                  class="input-float peer pr-10.5"
                  placeholder=""
                />
                  <label
                    for="Telephone"
                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                  >
                    Phone Number</label
                  >
                  <div v-if="v$.telephone.$error" class="text-red text-xs">
                    {{ "* " + v$.telephone.$errors[0].$message }}
                  </div>
                </div>
              </div>
            </div>
            <!--  -->
            <div class="space-y-4-1">
              <h4 class="text-base text-black-200 font-medium">Bank details</h4>
              <div class="grid lg:grid-cols-3 gap-4">
                <div
                  class="relative w-auto text-left rounded-lg px-4 border text-black"
                  @click="[(disabled = false), emit('doNotEdit', disabled)]"
                >
                  <div
                    @click="
                      [
                        (showBank = !showBank),

                        (disabled = false),
                        emit('doNotEdit', disabled),
                      ]
                    "
                    class="flex justify-between items-center"
                  >
                    <input
                      type="text"
                      id="Bank"
                      disabled="true"
                      v-model="data.account_details.bank"
                      maxlength="55"
                      class="input-float peer  border-none outline-none bg-transparent focus:outline-none focus:border:none"
                      placeholder=""
                    />

                    <label
                      for="Bank"
                      class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                    >
                      Bank</label
                    >
                    <span class="cursor-pointer">
                      <IArrowDown

                      />
                    </span>

                       </div>
                    <div
                      v-if="showBank"
                      class="font-bold scrollbar-hide absolute z-50 shadow-sm bg-white w-full text-sm h-32 overflow-y-scroll px-5"
                    >
                      <p v-for="(bank, indexBank) in banks" :key="indexBank"
                        @click="
                          [
                            (data.account_details.bank = parseBank(bank)),
                            (showBank = !showBank),
                          ]
                        "
                      >
                        {{ parseBank(bank) }}
                      </p>
                 
                  </div>
                </div>

                <div
                  class="relative"
                  @click="[(disabled = false), emit('doNotEdit', disabled)]"
                >
                  <input
                    type="text"
                    id="Account-number"
                    :disabled="disabled"
                    v-model="data.account_details.account_number"
                    maxlength="54"
                    class="input-float peer pr-10.5"
                    placeholder=""
                  />
                  <label
                    for="Account-number"
                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                  >
                    Account number</label
                  >
                  <div
                    v-if="v$.account_details.account_number.$error"
                    class="text-red text-xs"
                  >
                    {{
                      "* " +
                      v$.account_details.account_number.$errors[0].$message
                    }}
                  </div>
                </div>

                <div
                  class="relative"
                  @click="[(disabled = false), emit('doNotEdit', disabled)]"
                >
                  <input
                    type="text"
                    id="Account Name"
                    :disabled="disabled"
                    maxlength="55"
                    class="input-float peer pr-10.5"
                    placeholder=""
                  />
                  <label
                    for="Gross-Salary"
                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                  >
                    Gross Salary
                  </label>
                </div>

                <!-- <div
                  class="relative"
                  @click="[(disabled = false), emit('doNotEdit', disabled)]"
                >
                  <input
                    type="text"
                    id="Account Name"
                    v-model="data.account_details.account_name"
                    :disabled="disabled"
                    maxlength="55"
                    class="input-float peer pr-10.5"
                    placeholder=""
                  />
                  <label
                    for="Account Name"
                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                  >
                    Account Name</label
                  >
                </div> -->

                <div
                  class="relative"
                  @click="[(disabled = false), emit('doNotEdit', disabled)]"
                >
                  <input
                    type="text"
                    id="Base-Salary"
                    maxlength="54"
                    :disabled="disabled"
                    class="input-float peer pr-10.5"
                    placeholder=""
                  />
                  <label
                    for="Base-Salary"
                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                  >
                    Base Salary</label
                  >
                </div>
              </div>
            </div>
            <!--  -->
            <div class="space-y-4-1">
              <h4 class="text-base text-black-200 font-medium">Others (BEFORE SELECTING THE GRADE MAKE SURE TO SELECT YOUR DEPARTMENT FIRST)</h4>
              <div class="grid lg:grid-cols-3 gap-4">
                <div
                  class="font-normal relative w-auto text-left rounded-lg px-4 border text-black py-4"
                >
                  <div
                    @click="
                      [
                        (showDepartment = !showDepartment),
                        (disabled = false),
                        emit('doNotEdit', disabled),
                      ]
                    "
                    class="flex justify-between items-center"
                  >
                    <input
                      type="text"
                      disabled="true"
                      v-model="departmentName"
                      class="text-sm text-black w-full border-none outline-none bg-transparent focus:outline-none focus:border:none"
                      placeholder="Select department"
                    />

                    <span class="cursor-pointer">
                      <IArrowDown
                        
                      />
                    </span>
                  </div>
                  <div
                    class="absolute z-50 max-h-56 right-0 shadow-lg scrollbar-hide overflow-auto top-15 w-full"
                    v-if="showDepartment == true"
                  >
                    <div>
                      <component
                        :is="Departments"
                        @setGrades="setGrades"
                      ></component>
                    </div>
                  </div>
                </div>

                <!-- <div
                  class="relative"
                  @click="[(disabled = false), emit('doNotEdit', disabled)]"
                >
                  <input
                    type="text"
                    id="Department"
                    maxlength="54"
                    :disabled="disabled"
                    class="input-float peer pr-10.5"
                    placeholder=""
                  />
                  <label
                    for="Department"
                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                  >
                    Department</label
                  >
                </div> -->

                <div
                  class="font-normal relative w-auto text-left rounded-lg px-4 border text-black"
                >
                  <div
                    @click="
                      [
                        (disabled = false),
                        emit('doNotEdit', disabled),
                        (showGrade = !showGrade),
                      ]
                    "
                    class="flex justify-between items-center h-full"
                  >
                    <input
                      type="text"
                      disabled="true"
                      v-model="gradeName"
                      class="text-sm text-black bg-transparent w-full border-none outline-none focus:outline-none focus:border:none"
                      placeholder="Select grade"
                    />

                    <span class="cursor-pointer">
                      <IArrowDown
                        
                      />
                    </span>
                  </div>
                  <div
                    class="absolute z-50 max-h-56 right-0 shadow-lg scrollbar-hide overflow-auto top-15 w-full"
                    v-if="showGrade == true"
                  >
                    <div>
                      <component :is="Grade">
                        {{ grades }}
                      </component>
                    </div>
                  </div>
                </div>

                <div
                  class="font-normal relative w-auto text-left rounded-lg px-4 border text-black"
                >
                  <select id="status" class="text-sm h-full text-black bg-transparent w-full border-none outline-none focus:outline-none focus:border:none" v-model="data.status" :disabled="disabled">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <!-- <div
                  class="relative"
                  @click="[(disabled = false), emit('doNotEdit', disabled)]"
                >
                  <input
                    type="text"
                    :disabled="disabled"
                    id="Employment-Type"
                    maxlength="55"
                    class="input-float peer pr-10.5"
                    placeholder=""
                  />
                  <label
                    for="Employment-Type"
                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                  >
                    Employment Type</label
                  >
                </div> -->

                <!-- <div
                  class="relative"
                  @click="[(disabled = false), emit('doNotEdit', disabled)]"
                >
                  <input
                    type="text"
                    :disabled="disabled"
                    id="Tax-ID"
                    maxlength="54"
                    class="input-float peer pr-10.5"
                    placeholder=""
                  />
                  <label
                    for="Tax-ID"
                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                  >
                    Tax ID</label
                  >
                </div> -->
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--  -->
  </div>
</template>

<style scoped>
.telinput {
  border: 1px solid black;
  border-radius: 7px;
}
</style>
