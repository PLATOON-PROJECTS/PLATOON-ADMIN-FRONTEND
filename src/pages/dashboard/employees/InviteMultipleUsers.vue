<script setup lang="ts">
import { ref, provide, reactive, onMounted, inject } from "vue";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../components/timer/Spinner.vue";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import { useRouter } from "vue-router";
import Grade from "../../../components/dropdowns/grades.vue";
import useVuelidate from "@vuelidate/core";
import { computed } from "vue";
import { email, helpers, required } from "@vuelidate/validators";
import { useEmployeeStore, useUserStore } from "../../../store";
import { getItem } from "../../../core/utils/storage.helper";
import { IArrowLeftTail, IArrowDown } from "../../../core/icons";
import Departments from "../../../components/dropdowns/department.vue";


// initialize router
const router = useRouter();
const grades = ref<any[]>([]);

// initialize store
const employeeStore = useEmployeeStore();
const userStore = useUserStore();
const showModal = ref(false);

const emit = defineEmits<{
  (e: "close"): void;
}>();
// variables

const departmentName = ref("");
const showDepartment = ref(false);
const gradeName = ref("");
const showGrade = ref(false);
// const data = ref({ department: "all" });
const showSuccess = ref(false);
const loading = ref(false);
const employeeMap = ref<Record<string, string>>({}); 
const successMessage = ref("Action successful");
const responseData = ref<any>({ data: [], message: "" });
const valid = ref(false);
const invalidDomain = ref(false);



const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));

const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;

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

// inject and provide
provide("showDepartment", showDepartment);
provide("selectedDepartment", [data, departmentName]);
provide("showGrade", showGrade);
provide("selectedGrade", [data, gradeName]);
const render = inject<any>("render");
// method

const { payrollId } = router.currentRoute.value.query;
const parsedPayrollId = Number(payrollId);
const setGrades = (value: any[]) => {
  grades.value = value;
};

const inviteUsers = async () => {
  loading.value = true; 
};
const navigateToCreateNew = () => {
  router.push({ name: "dashboard.payroll.add" });
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
  };
});

const v$ = useVuelidate(rules as any, data);

</script>
<template>
  <div class="bg-white h-full rounded-t-lg py-6 space-y-5 overflow-auto scrollbar-hide">
    <!-- successAlert -->
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ successMessage }}</successAlert
    >
    <div v-if="showModal" class="flex items-center justify-center fixed top-0 left-0 bg-black/20 h-screen w-screen z-[99999]">
        <div class="box bg-white rounded-md md:w-[400px] w-auto p-6 flex flex-col items-center justify-center space-y-6">
          <div>
            <svg width="69" height="69" viewBox="0 0 69 69" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="34.5" cy="34.5" r="34.5" fill="#F0F2F2" />
              <path
                d="M34.5 15.8125C30.804 15.8125 27.1909 16.9085 24.1178 18.9619C21.0446 21.0153 18.6494 23.9339 17.235 27.3486C15.8206 30.7633 15.4505 34.5207 16.1716 38.1458C16.8926 41.7708 18.6725 45.1006 21.286 47.7141C23.8994 50.3276 27.2292 52.1074 30.8543 52.8284C34.4793 53.5495 38.2367 53.1794 41.6514 51.765C45.0661 50.3506 47.9847 47.9554 50.0381 44.8822C52.0915 41.8091 53.1875 38.196 53.1875 34.5C53.1823 29.5454 51.2117 24.7952 47.7083 21.2917C44.2048 17.7883 39.4546 15.8177 34.5 15.8125ZM42.7045 31.2045L32.642 41.267C32.5085 41.4007 32.35 41.5067 32.1755 41.5791C32.001 41.6514 31.8139 41.6886 31.625 41.6886C31.4361 41.6886 31.249 41.6514 31.0745 41.5791C30.9 41.5067 30.7415 41.4007 30.608 41.267L26.2955 36.9545C26.0257 36.6848 25.8742 36.319 25.8742 35.9375C25.8742 35.556 26.0257 35.1902 26.2955 34.9205C26.5652 34.6507 26.931 34.4992 27.3125 34.4992C27.694 34.4992 28.0598 34.6507 28.3295 34.9205L31.625 38.2177L40.6705 29.1705C40.804 29.0369 40.9626 28.931 41.1371 28.8587C41.3116 28.7864 41.4986 28.7492 41.6875 28.7492C41.8764 28.7492 42.0634 28.7864 42.2379 28.8587C42.4124 28.931 42.571 29.0369 42.7045 29.1705C42.8381 29.304 42.944 29.4626 43.0163 29.6371C43.0886 29.8116 43.1258 29.9986 43.1258 30.1875C43.1258 30.3764 43.0886 30.5634 43.0163 30.7379C42.944 30.9124 42.8381 31.071 42.7045 31.2045Z"
                fill="black" />
            </svg>
          </div>
                <div class="text-center font-bold text-lg">
                    Users invited succeccfully
                </div>
                <!-- <div class="text-center text-sm text-gray-100 px-6">
                    Payroll payment for <span class="font-bold">{{ summaryData.executionMonth }}</span> was successful. Check the status of each transaction once completed.
                </div> -->
                <ButtonBlue @click="navigateToCreateNew">
            <template v-slot:placeholder>
              <span>Done</span>
            </template>
          </ButtonBlue>
        </div>
      </div>
      
    <div class="px-5 py-2">
      <div class=" h-full space-y-6">
        <div class="flex justify-between">
            <div class="flex space-x-5">
                <div v-on:click="$emit('close')" class="pt-1">
                  <IArrowLeftTail/>
                </div>
                <div>
                  <h3 class="font-bold text-2xl whitespace-nowrap">
                    Invite Multiple Users
                  </h3>
                  <p class="text-sm pt-1 font-semimedium whitespace-nowrap">
                    <span class="text-black-200">Fill the form below to invites users</span>
                  </p>
                </div>
            </div>
            <div>
                    <ButtonBlue @click="inviteUsers">
                    <template v-slot:placeholder>
                        <span>Invite User?</span></template>
                    </ButtonBlue>
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
        <div class="border-t border-grey h-full">
          <div class="">
            <div class="align-middle inline-block min-w-full">
              <div class="overflow-hidden sm:rounded-lg">
                <div class=" h-full space-y-6">
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
                    </div>
      
      
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
                  </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  </div>
</template>

<style></style>
