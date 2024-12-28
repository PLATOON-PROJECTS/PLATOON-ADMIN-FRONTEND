<script setup lang="ts">
import { ref, reactive, inject, computed, provide } from "vue";
import ButtonBlue from "../components/buttons/ButtonBlue.vue";
import SuccessAlert from "../components/alerts/SuccessAlert.vue";
import { IArrowDown, IClose } from "../core/icons";
import { request } from "../composables/request.composable";
import handleError from "../composables/handle_error.composable";
import handleSuccess from "../composables/handle_success.composable";
import spinner from "../components/timer/Spinner.vue";
import { useEmployeeStore, useUserStore } from "../store/index";
import { stringValidate, numberValidate } from "../validations/validate";
import { storeItem, getItem } from "../core/utils/storage.helper";
import useVuelidate from "@vuelidate/core";
import Departments from "../components/dropdowns/department.vue";
import { required, email, helpers } from "@vuelidate/validators";
import Grade from "../components/dropdowns/grades.vue";
// store initializaion

// initialize store
const employeeStore = useEmployeeStore();
const userStore = useUserStore();
// emits
const emit = defineEmits<{
  (e: "close"): void;
}>();

// variables
const loading = ref(false);
const grades = ref<any[]>([]);
// const data = ref({
//   email: "",
//   name: "",
//   notes: "",
//   telephone: "",
//   department: "",
//   grade: "",
// });

const data = ref<{
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  employmentType: string;
  gradeId: number | null;
  departmentId: number | null;
}>({
  name: "",
  email: "",
  phoneNumber: "",
  countryCode: "",
  employmentType: "",
  gradeId: null,
  departmentId: null,
});

const departmentName = ref("");
const showDepartment = ref(false);
const gradeName = ref("");
const showGrade = ref(false);
const showSuccess = ref(false);
const responseData = ref<any>({ data: [], message: "" });
const valid = ref(false);
const invalidDomain = ref(false);

// provide and injects
provide("showDepartment", showDepartment);
provide("selectedDepartment", [data, departmentName]);
provide("showGrade", showGrade);
provide("selectedGrade", [data, gradeName]);
const render = inject<any>("render");

// methods
// const onInput = (phone: number, phoneObject: any, input: any) => {
//   if (phoneObject?.formatted) {
//     data.value.phoneNumber = phoneObject.number;
//     valid.value = phoneObject.valid;
//   }
// };

// const onInput = (phone: number, phoneObject: any, input: any) => {
//   if (phoneObject?.formatted) {
//     data.value.phoneNumber = phoneObject.number;
//     data.value.countryCode = phoneObject.countryCode; // Capture the country code
//     valid.value = phoneObject.valid;
//   }
// };


const validatePhone = () => {
  return valid.value;
};

const setGrades = (value: any[]) => {
  grades.value = value;
};

async function checkDomainExists(email:string | null) {
  const domain = email?.split('@')[1];
  try {
    const response = await fetch(`https://${domain}`, { mode: 'no-cors' });
    return true; // Returns true if the domain exists
  } catch (error) {
    return false; // Returns false if there's an error or domain doesn't exist
  }
}

const handleInvite = async () => {
  const isFormCorrect = await v$.value.$validate();
  invalidDomain.value = false;

  if (isFormCorrect == true) {
    console.error("Form is not valid", v$);
    // const sendData = {
    //   email: v$.value.email.$model as string,
    //   department: v$.value.department.$model as string,
    //   notes: v$.value.notes.$model as string,
    //   telephone: v$.value.telephone.$model as string,
    //   name: v$.value.name.$model as string,
    //   grade: data.value.grade as string,
    // };

    const sendData = {
      firstName: v$.value.name.$model.split(' ')[0], // Assuming name is "First Last"
      lastName: v$.value.name.$model.split(' ')[1],
      email: v$.value.email.$model as string,
      phoneNumber: data.value.phoneNumber as string,
      countryCode: data.value.countryCode, 
      employmentType: data.value.employmentType, 
      gradeId: Number(data.value.gradeId), 
      // gradeId: Number(data.value.gradeId), 
      departmentId: Number(data.value.departmentId),
    };
    console.log("Data to be sent:", sendData);

    loading.value = true;
    const is_alive = await checkDomainExists(data.value.email)
    .then((result: any) => {
      if (result) {
        return true;
      } else {
        return false;
      }
    })
    .catch(error => {
      return "Not yet ready";
    });

    if(is_alive){
      const response = await request(
        employeeStore.invitationCreate(sendData),
        loading
      );
      console.log("Response from API:", response);

      handleError(response, userStore);
      if (response && response.data) {
        console.error("Error details:", response.data);
      }
      const successResponse = handleSuccess(response, showSuccess);

      if (successResponse && typeof successResponse !== "undefined") {
        responseData.value.message = "Invitation sent successfully.";
        showSuccess.value = true;
        setTimeout(() => {
          render.value = true;
          emit("close");
        }, 5000)
      }
    }else{
      loading.value = false;
      invalidDomain.value = true;
    }
  }
};

// validations rule
const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage("Email address is required", required),
      email: helpers.withMessage("Must be a valid email", email),
    },
    name: {
      required: helpers.withMessage("Name is required", required),
    },
    // department: {
    //   required: helpers.withMessage("Department  is required", required),
    // },
    // notes: {
    //   required: helpers.withMessage("Notes is required", required),
    // },

    // telephone: {
    //   required: helpers.withMessage("Telephone is required", required),
    //   validatePhone: helpers.withMessage("Invalid Phone Number", validatePhone),
    // },
  };
});

const v$ = useVuelidate(rules as any, data);
</script>

<template>
  <div
    class="relative z-[99999]"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}</successAlert
    >
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md"
        >
          <form
            v-if="!showSuccess"
            @submit.prevent="handleInvite"
            class="bg-white px-[37px] py-[27px] space-y-8"
          >
            <!-- content -->
            <header>
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-black-rgba font-medium text-2xl">
                    Invite new employee
                  </h3>
                  <p class="text-sm font-semimedium text-black-rgba-100">
                    Employee will receive an email notification
                  </p>
                </div>
                <div>
                  <button
                    v-on:click="$emit('close')"
                    class="bg-blue-lighter rounded-full top-12 right-12 p-3"
                  >
                    <IClose />
                  </button>
                </div>
              </div>
            </header>

            <!-- form -->
            <div class="space-y-6">
              <div
                class="font-normal text-left rounded-xl px-4 h-[48px] relative border border-grey-300"
              >
                <p
                  class="absolute -top-2 font-normal text-xs left-5 text-[#000000] bg-white"
                >
                  Full name
                </p>
                <div class="flex justify-between items-center h-full w-full">
                  <input
                    type="text"
                    required
                    v-model="data.name"
                    placeholder="Full name of employee"
                    class="placeholder-strong rounded-lg w-full text-sm outline-none border-none h-full focus:outline-none focus:border-none"
                  />
                </div>
                <div v-if="v$.name.$error" class="!text-red-100 text-xs">
                  {{ "* " + v$.name.$errors[0].$message }}
                </div>
              </div>

              <!--  -->

              <div>
                <div
                  class="font-normal text-left rounded-xl px-4 h-[48px] relative border border-grey-300"
                >
                  <input
                    required
                    type="email"
                    v-model="data.email"
                    class="rounded-lg placeholder-strong text-black text-sm outline-none border-none h-full focus:outline-none focus:border-none w-full overflow-x-auto"
                    placeholder="Employee's email"
                  />
                </div>
                <div v-if="v$.email.$error" class="!text-red-100 text-xs">
                  {{ "* " + v$.email.$errors[0].$message }}
                </div>
                <div v-if="invalidDomain" class="!text-red-100 text-xs">
                  Invalid Email Address.
                </div>
              </div>
              <!--  -->

              <!-- <div>
                <vue-tel-input
                  :value="data.phoneNumber"
                  @input="onInput"
                  class="text-black text-sm border py-2 telinput"
                ></vue-tel-input>

                <div v-if="v$.telephone.$error" class="!text-red-100 text-xs">
                  {{ "* " + v$.telephone.$errors[0].$message }}
                </div>
              </div> -->

              <div class="flex space-x-2">
                <div class="font-normal text-left rounded-xl px-4 h-[48px] w-[25%] relative border border-grey-300">
                  <input
                    type="text"
                    v-model="data.countryCode"
                    placeholder="Mobile"
                    class="rounded-lg w-full placeholder-strong text-black text-sm outline-none border-none h-full focus:outline-none focus:border-none"
                  />
                </div>
                <div class="font-normal text-left rounded-xl px-4 h-[48px] w-[75%] relative border border-grey-300">
                  <input
                    type="text"
                    v-model="data.phoneNumber"
                    placeholder="Employee phone number"
                    class="w-full rounded-lg placeholder-strong text-black text-sm outline-none border-none h-full focus:outline-none focus:border-none"
                  />
                </div>
              </div>
             <!--  -->
            
             <!--  -->

              <div
                class="font-normal relative w-auto text-left rounded-xl px-4 h-[48px] text-gray-rgba-3 border text-black"
              >
                <div class="flex justify-between items-center h-full">
                  <input
                    @click="showDepartment = !showDepartment"
                    type="text"
                    v-model="departmentName"
                    class="text-sm text-black w-full border-none outline-none focus:outline-none focus:border:none"
                    placeholder="Select department"
                  />

                  <span>
                    <IArrowDown @click="showDepartment = !showDepartment" />
                  </span>
                </div>
                <div
                  class="absolute z-50 h-56 right-0 shadow-lg scrollbar-hide overflow-auto top-15 w-full"
                  v-if="showDepartment == true"
                >
                  <div>
                    <component
                      :is="Departments"
                      @setGrades="setGrades"
                    ></component>
                  </div>
                </div>
<!-- 
                <div v-if="v$.department.$error" class="!text-red-100 text-xs">
                  {{ "* " + v$.department.$errors[0].$message }}
                </div> -->
              </div>

              <!--  -->
              <!-- <div
              class="font-normal text-left rounded-xl pl-4 h-[48px] my-4 border text-gray-rgba-3 mb-1"
            >
              <input
                required
                type="text"
                v-model="data.employmentType"
                class="rounded-lg placeholder-strong text-black text-sm outline-none border-none h-full focus:outline-none focus:border-none"
                placeholder="Enter Grade"
              />
            </div> -->

              <!--  -->
              <div
              class="font-normal text-left rounded-xl px-4 h-[48px] relative border border-grey-300"
            >
              <input
                required
                type="text"
                v-model="data.employmentType"
                class="w-full rounded-lg placeholder-strong text-black text-sm outline-none border-none h-full focus:outline-none focus:border-none \"
                placeholder="Select employment type"
              />
            </div>
             <!-- <div
                class="font-normal relative w-auto text-left rounded-xl px-4 h-[48px] text-gray-rgba-3 border text-black"
              >
                <div class="flex justify-between items-center h-full">
                  <input
                    @click="showGrade = !showGrade"
                    type="text"
                    v-model="data.grade"
                    class="text-sm text-black w-full border-none outline-none focus:outline-none focus:border:none"
                    placeholder="Select employment type"
                  />

                  <span>
                    <IArrowDown @click="showGrade = !showGrade" />
                  </span>
                </div>
                <div
                  class="absolute z-50 h-56 right-0 shadow-lg scrollbar-hide overflow-auto top-15 w-full"
                  v-if="showGrade == true"
                >
                  <div>
                    <component :is="Grade">
                      {{ grades }}
                    </component>
                  </div>
                </div>
              </div> -->
              <!--  -->

              <div
                class="font-normal relative w-auto text-left rounded-xl px-4 h-[48px] text-gray-rgba-3 border text-black"
              >
                <div class="flex justify-between items-center h-full">
                  <input
                    @click="showGrade = !showGrade"
                    type="text"
                    v-model="gradeName"
                    class="text-sm text-black w-full border-none outline-none focus:outline-none focus:border:none"
                    placeholder="Select grade"
                  />

                  <span>
                    <IArrowDown @click="showGrade = !showGrade" />
                  </span>
                </div>
                <div
                  class="absolute z-50 h-56 right-0 shadow-lg scrollbar-hide overflow-auto top-15 w-full"
                  v-if="showGrade == true"
                >
                  <div>
                    <component :is="Grade">
                      {{ grades }}
                    </component>
                  </div>
                </div>
              </div>
              <!-- <div>
                <textarea
                  v-model="data.notes"
                  class="w-full focus:outline-none outline-none py-3 font-normal border-grey-300 text-left rounded-xl px-4 h-[70px] border text-black"
                  placeholder="Notes"
                ></textarea>
              </div>
              <div v-if="v$.notes.$error" class="!text-red-100 text-xs">
                {{ "* " + v$.notes.$errors[0].$message }}
              </div> -->
              <!--  -->
            </div>

            <!--  -->

            <div class="flex pb-5">
              <ButtonBlue :disabled="loading">
                <template #placeholder>
                  <spinner v-if="loading == true" />
                  <span v-else>Invite Employee</span>
                </template>
              </ButtonBlue>
            </div>

            <!-- end content -->
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.telinput {
  @apply font-normal text-left rounded-xl px-4 h-[48px] relative border;
}
</style>
