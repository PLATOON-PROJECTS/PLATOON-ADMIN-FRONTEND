<script setup lang="ts">
import { ref, inject, onBeforeUnmount } from "vue";
import ButtonBlue from "../components/buttons/ButtonBlue.vue";
import FCheckBoxRec from "../components/forms/FCheckBoxRec.vue";
import { IArrowDown, IClose } from "../core/icons";
import SuccessAlert from "../components/alerts/SuccessAlert.vue";
import { request } from "../composables/request.composable";
import handleError from "../composables/handle_error.composable";
import handleSuccess from "../composables/handle_success.composable";
import spinner from "../components/timer/Spinner.vue";
import cache from "../composables/swr_cache";

import { useGroupStore, useUserStore } from "../store/index";
import { AnyFn } from "@vueuse/core";
import { getItem } from "../core/utils/storage.helper";

// initialize store
const groupStore = useGroupStore();
const userStore = useUserStore();
const list = ref(false);
const grade_id = ref("0")
const addGarde = ref(false);
const loadingPage = ref(true)
// emits
const emit = defineEmits<{
  (e: "close"): void;
}>();

// props
const props = defineProps<{ departmentId: any }>();
// variables
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));
const updateId = ref("");
const gradesArr = ref([{ key: "", value: "",grossPay: null, id: "" }]);
const gradesArrCreate = ref([{ key: "", value: "", grossPay: null, id: "" }]);

const loading = ref(false);
const removeLoading = ref([false]);
const gradeLoading = ref(false);
const updateLoading = ref([false]);
const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;

const organisationId = parsedUserInfo?.customerInfo?.organisationId;
// const data = ref<any>({
//   name: null,
//   supportingName: null,
//   grades: [],
//   settings: { tax: false, nhf: false, pension: false },
// });

// const dataCreateGrade = ref<any>({
//   name: null,
//   supportingName: null,
//   grades: [],
//   settings: { tax: false, nhf: false, pension: false },
// });

const data = ref<any>({
  name: null,
  supportingName: null,
  grades: [],
});

const dataCreateGrade = ref<any>({
  name: null,
  supportingName: null,
  grades: [],
});


const showSuccess = ref(false);
const responseData = ref<any>({ message: "Action successful" });

// provides and inject
const render = inject<any>("render");
// methods

const setField = async (page = 1) => {
  const departmentData = cache("departments");

  if (typeof departmentData !== "undefined") {
    departmentData.map((department: any) => {
      if (props.departmentId && department.id === props.departmentId) {
        data.value.name = department.name;
        data.value.settings = { ...department.settings };
        if (department.grades[0]) {
          gradesArr.value.length = 0;
          removeLoading.value = []
          updateLoading.value = []
          department.grades.forEach((grade: any) => {
            removeLoading.value.push(false);
            updateLoading.value.push(false);
            gradesArr.value.push({ key: grade.name, value: grade.code, grossPay: grade.grossPay || 0, id: grade.id });
            // gradesArr.value.push({ key: grade.name, value: grade.salary, id: grade.id });
          });
        }
      }
    });
  }

  const response = await request(groupStore.index(organisationId, 10, page), loading);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    loadingPage.value = false;

    successResponse.data.data.pageItems.map((department: any) => {
      if (props.departmentId && department.id === props.departmentId) {
        data.value.name = department.name;
        data.value.settings = { ...department.settings };
        if (department.grades[0]) {
          gradesArr.value.length = 0;
          updateLoading.value = []
          removeLoading.value = []
          department.grades.forEach((grade: any) => {
            removeLoading.value.push(false);
            updateLoading.value.push(false);
            // gradesArr.value.push({ key: grade.name, value: grade.salary, id: grade.id });
            gradesArr.value.push({ key: grade.name, value: grade.code, grossPay: grade.grossPay || 0, id: grade.id });
          });
        }
      }
    });

    // responseData.value = successResponse.data;
    // console.log(successResponse.data);
  }
};
const save = () => {
  if (typeof props.departmentId === "undefined" || !props.departmentId) {
    createGroup();
  } else {
    updateGroup();
  }
};
const removeField = async (id: number, gradeKey: any) => {
  if (gradesArr.value.length > 1) {
    removeLoading.value[id] = true;

    const found = gradesArr.value.find((item:any) => item.key == gradeKey);

    if(found){
      const response = await request(groupStore.removeGrade(found.id, props.departmentId), loading);
  
      handleError(response, userStore);
      const successResponse = handleSuccess(response, showSuccess);

      removeLoading.value[id] = false;
  
      if (successResponse && typeof successResponse !== "undefined") {
        gradesArr.value = gradesArr.value.filter((value: any) => {
          return value !== gradesArr.value[id];
        });
      }
    }

  }
};

const updateGrade = async (id: number, gradeKey: any) => {

  updateLoading.value[id] = true;

  const found:any = gradesArr.value.find((item:any) => item.key == gradeKey);

  if(found) {
    const gradeData:any = ref({})
  
    gradeData.value[gradeKey] = found.value
  
    const response = await request(groupStore.gradeUpdate(gradeData.value, found.id, props.departmentId), loading);
  
    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);
  
    updateLoading.value[id] = false;
  
    if (successResponse && typeof successResponse !== "undefined") {
      // console.log(successResponse)
    }
  }
};
const removeFieldWIthoutLoading = (id:number) => {
  if (gradesArr.value.length > 1) {
    gradesArr.value = gradesArr.value.filter((value: any) => {
      return value !== gradesArr.value[id];
    });
  }
}

const removeCreateField = (id: number) => {
  if (gradesArrCreate.value.length > 1) {
    gradesArrCreate.value = gradesArrCreate.value.filter((value: any) => {
      return value !== gradesArrCreate.value[id];
    });
  }
};
const addMoreFields = () => {
  gradesArr.value.push({ key: "", value: "",grossPay: null, id: "" });
  // console.log(gradesArr.value);
 };
const addMoreCreateFields = () => {
  gradesArrCreate.value.push({ key: "", value: "",grossPay: null, id: "" });
  // console.log(gradesArr.value);
 };
const createGroup = async () => {
  // set grades
  // gradesArr.value.forEach((grade) => {
  //   data.value.grades[grade.key] = grade.value;
  // });
  data.value.grades = gradesArr.value.map(grade => ({
  name: grade.key,
  code: grade.value,
  grossPay: Number(grade.grossPay) || 0
}));


  loading.value = true;
  const response = await request(groupStore.create(data.value), loading);

  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (successResponse && typeof successResponse !== "undefined") {
        responseData.value = successResponse;
        responseData.value.message = "Department created successfully.";
        showSuccess.value = true;
        setTimeout(() => {
          render.value = true;
          emit("close");
        }, 5000)
      }
  loading.value = false;
};
const updateGroup = async () => {
  // set grades
  // gradesArr.value.forEach((grade) => {
  //   data.value.grades[grade.key] = grade.value;
  // });

  data.value.grades = gradesArr.value.map(grade => ({
  name: grade.key,
  code: grade.value,
  grossPay: Number(grade.grossPay) || 0
}));


  loading.value = true;
  const response = await request(
    groupStore.update(data.value, props.departmentId),
    loading
  );

  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (successResponse && typeof successResponse !== "undefined") {
    responseData.value = successResponse;
    render.value = true;
    emit("close");
  }
};
const updateDepartmentGroup = async () => {

  // set grades
  gradesArrCreate.value.forEach((grade) => {
    dataCreateGrade.value.grades[grade.key] = grade.value;
  });

  const gradeData = {
    "grades": dataCreateGrade.value.grades,
  }

  loading.value = true;
  const response = await request(
    groupStore.updateGradeList(gradeData, props.departmentId),
    loading
  );

  loading.value = true;
  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (successResponse && typeof successResponse !== "undefined") {
    responseData.value = successResponse;
    render.value = true;
    emit("close");
  }
  loading.value = false;
};

setField();

onBeforeUnmount(() => {
  render.value = true;
});
</script>

<template>
  <div
    class="relative z-50"
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

    <div class="fixed inset-0 z-10 overflow-y-auto" v-if="addGarde == false">
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md"
        >
          <form
            v-if="!showSuccess"
            @submit.prevent="save"
            class="bg-white px-[20px] py-[27px] space-y-8"
          >
            <!-- content -->
            <header>
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-black-rgba font-medium text-2xl">
                    Create new department
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
            <spinner
              v-if="loadingPage == true && props.departmentId"
              class="flex justify-center items-center lg:h-[400px] h-[300px]"
            />
            <div v-else>
              <div class="space-y-6">
                <div
                  class="font-normal text-left rounded-xl px-4 h-[48px] relative border text-black border-grey-300"
                >
                  <p
                    class="absolute -top-2 font-normal text-xs left-5 text-[#000000] bg-white"
                  >
                    Name of department
                  </p>
                  <div class="flex justify-between items-center h-full w-full">
                    <input
                      type="text"
                      required
                      v-model="data.name"
                      class="rounded-lg placeholder-strong w-full text-sm outline-none border-none h-full focus:outline-none focus:border-none"
                      placeholder=" Department name"
                    />
                  </div>
                </div>
                <div class="font-normal text-left rounded-xl px-4 h-[48px] relative border text-black border-grey-300">
                  <p class="absolute -top-2 font-normal text-xs left-5 text-[#000000] bg-white">
                    Supporting name
                  </p>
                  <div class="flex justify-between items-center h-full w-full">
                    <input
                      type="text"
                      required
                      v-model="data.supportingName"
                      class="rounded-lg placeholder-strong w-full text-sm outline-none border-none h-full focus:outline-none focus:border-none"
                      placeholder="Supporting name"
                    />
                  </div>
                </div>
                
                <!--  -->
  
                <!-- <div
                  class="font-normal text-left rounded-xl pl-4 h-[48px] my-4 border mb-1"
                >
                  <input
                    type="text"
                    class="rounded-lg placeholder-strong text-black text-sm outline-none border-none h-full focus:outline-none"
                    placeholder="Supporting department name"
                  />
                </div> -->
  
                <!--  -->
  
                <div class="space-y-4">
                  <h2 class="text-sm font-medium text-black-200">Grades</h2>
                  <!-- inputs -->
                  <div
                    class="grid grid-cols-2 gap-2"
                    id="grade"
                    v-for="(grade, i) in gradesArr"
                    :key="i"
                  > 
                    <input
                      type="text"
                      v-model="grade.key"
                      class="rounded-xl border px-4 h-[48px] font-normal text-left placeholder-strong text-black text-sm outline-none focus:outline-none"
                      placeholder="name"
                    />
  
                    <div class="flex items-center gap-3">
                      <!-- <input
                        v-model.number="grade.value"
                        type="number"
                        class="rounded-xl border pl-4 h-[48px] w-[120px] font-normal text-left placeholder-strong text-black text-sm outline-none focus:outline-none"
                        placeholder="salary"
                      /> -->
                       <input
                        v-model="grade.value"
                        type="text"
                        class="rounded-xl border px-4 h-[48px] w-[120px] font-normal text-left placeholder-strong text-black text-sm outline-none focus:outline-none"
                        placeholder="code"
                      />
                      <input
                      v-model.number="grade.grossPay"
                      type="number"
                      class="rounded-xl border px-4 h-[48px] font-normal text-left placeholder-strong text-black text-sm outline-none focus:outline-none"
                      placeholder="gross pay"
                    />
                      
                      <div v-if="props.departmentId">
                        <button type="button" v-if="!updateLoading[i]" @click="updateGrade(i, grade.key)" class="flex items-center cursor-pointer space-x-2.5 bg-[#003b3d] p-3 rounded-full px-2+1 flex-shrink-0">
                          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 17H17.01M15.6 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H8.4M12 15V4M12 4L15 7M12 4L9 7" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        </button>
                        <spinner v-else />
                      </div>
                      <div v-if="props.departmentId">
                        <div v-if="removeLoading[i] == false">
                          <span
                            v-if="gradesArr.length > 1"
                            class="font-extrabold cursor-pointer"
                            @click="removeField(i, grade.key)"
                            >X</span
                          >
                        </div>
                        <spinner v-else />
                      </div>
                      <div v-else>
                        <span
                            v-if="gradesArr.length > 1"
                            class="font-extrabold cursor-pointer"
                            @click="removeFieldWIthoutLoading(i)"
                            >X</span
                          >
                      </div>
                    </div>
                  </div>
                  <div class="flex pb-5 gap-3">
                    <button
                      v-if="!props.departmentId"
                      @click="addMoreFields"
                      type="button"
                      class="flex items-center cursor-pointer space-x-2.5 bg-[#003b3d] p-3 rounded-full px-4+1 flex-shrink-0"
                    >
                      <span class="font-medium text-sm text-white">
                        + Add More
                      </span>
                    </button>
                    <button
                      v-else
                      @click="addGarde = true"
                      type="button"
                      class="flex items-center cursor-pointer space-x-2.5 bg-[#003b3d] p-3 rounded-full px-4+1 flex-shrink-0"
                    >
                      <span class="font-medium text-sm text-white">
                        Add More Grades
                      </span>
                    </button>
                    <!-- <button
                      @click="list = false"
                      type="submit"
                      class="flex items-center cursor-pointer space-x-2.5 bg-[#003b3d] p-3 rounded-full px-4+1 flex-shrink-0"
                    >
                      <span class="font-medium text-sm text-white capitalize">
                        update current grades
                      </span>
                    </button> -->
                  </div>
                </div>
                <div class="space-y-4">
                  <!-- <h2 class="text-sm font-medium text-black-200">
                    Payroll Settings
                  </h2> -->
                  <!-- checkbox -->
                  <div class="space-y-3">
                    <!-- <div class="flex items-center space-x-3">
                      <FCheckBoxRec />
                      <span class="text-sm text-black-200">
                        Apply organization's Salary BHT</span
                      >
                    </div> -->
                    <!-- <div class="flex items-center space-x-3">
                      <FCheckBoxRec
                        :value="data.settings.tax"
                        @changeState="data.settings.tax = !data.settings.tax"
                      />
                      <span class="text-sm text-black-200">
                        Apply organization's tax setting</span
                      >
                    </div> -->
                    <!-- <div class="flex items-center space-x-3">
                      <FCheckBoxRec />
  
                      <span class="text-sm text-black-200">
                        Apply Withholding tax</span
                      >
                    </div> -->
  
                    <!-- <div class="flex items-center space-x-3">
                      <FCheckBoxRec
                        :value="data.settings.pension"
                        @changeState="
                          data.settings.pension = !data.settings.pension
                        "
                      />
                      <span class="text-sm text-black-200">
                        Apply organization's pension setting</span
                      >
                    </div> -->
                    <!-- <div class="flex items-center space-x-3">
                      <FCheckBoxRec
                        :value="data.settings.nhf"
                        @changeState="data.settings.nhf = !data.settings.nhf"
                      />
  
                      <span class="text-sm text-black-200">
                        Apply organization's NHF setting</span
                      >
                    </div> -->
                  </div>
                </div>
  
                <!--  -->
              </div>
  
              <!--  -->
  
              <div class="flex pb-5" @click="list = true">
                <ButtonBlue :disabled="loading">
                  <template v-slot:placeholder>
                    <spinner v-if="loading == true" />
                    <span v-else>{{ props.departmentId ? 'Update' : 'Add' }} Department</span></template
                  >
                </ButtonBlue>
              </div>
  
              <!-- end content -->
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="fixed inset-0 z-10 overflow-y-auto" v-else>
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md"
        >
          <form
            @submit.prevent="updateDepartmentGroup"
            class="bg-white px-[20px] py-[27px] space-y-8"
          >
            <!-- content -->
            <header>
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-black-rgba font-medium text-2xl">
                    Create new grade
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

              <div class="space-y-4">
                <h2 class="text-sm font-medium text-black-200">Grades</h2>
                <!-- inputs -->
                <div
                  class="grid grid-cols-2 gap-2"
                  id="grade"
                  v-for="(grade, i) in gradesArrCreate"
                  :key="i"
                >
                  <input
                    v-model="grade.key"
                    type="text"
                    class="rounded-xl border px-4 h-[48px] font-normal text-left placeholder-strong text-black text-sm outline-none focus:outline-none"
                    placeholder="name"
                  />

                  <div class="flex items-center gap-3">
                    <!-- <input
                      v-model="grade.value"
                      type="number"
                      class="rounded-xl border pl-4 h-[48px] font-normal text-left placeholder-strong text-black text-sm outline-none focus:outline-none"
                      placeholder="salary"
                    /> -->

                    <input
                      v-model="grade.value"
                      type="text"
                      class="rounded-xl border px-4 h-[48px] font-normal text-left placeholder-strong text-black text-sm outline-none focus:outline-none"
                      placeholder="code"
                    />
                    <input
                      v-model.number="grade.grossPay"
                      type="number"
                      class="rounded-xl border px-4 h-[48px] font-normal text-left placeholder-strong text-black text-sm outline-none focus:outline-none"
                      placeholder="gross pay"
                    />
                      <span
                        v-if="gradesArrCreate.length > 1"
                        class="font-extrabold cursor-pointer"
                        @click="removeCreateField(i)"
                        >X</span
                      >
                  </div>
                </div>
                <div class="flex pb-5 gap-3">
                  <button
                    @click="addMoreCreateFields"
                    type="button"
                    class="flex items-center cursor-pointer space-x-2.5 bg-[#003b3d] p-3 rounded-full px-4+1 flex-shrink-0"
                  >
                    <span class="font-medium text-sm text-white">
                      + Add More
                    </span>
                  </button>
                  <!-- <button
                    @click="list = false"
                    type="submit"
                    class="flex items-center cursor-pointer space-x-2.5 bg-[#003b3d] p-3 rounded-full px-4+1 flex-shrink-0"
                  >
                    <span class="font-medium text-sm text-white capitalize">
                      update current grades
                    </span>
                  </button> -->
                </div>
              </div>
              <div class="space-y-4">
                <!-- <h2 class="text-sm font-medium text-black-200">
                  Payroll Settings
                </h2> -->
                <!-- checkbox -->
                <div class="space-y-3">
                  <!-- <div class="flex items-center space-x-3">
                    <FCheckBoxRec />
                    <span class="text-sm text-black-200">
                      Apply organization's Salary BHT</span
                    >
                  </div> -->
                  <!-- <div class="flex items-center space-x-3">
                    <FCheckBoxRec
                      :value="data.settings.tax"
                      @changeState="data.settings.tax = !data.settings.tax"
                    />
                    <span class="text-sm text-black-200">
                      Apply organization's tax setting</span
                    >
                  </div> -->
                  <!-- <div class="flex items-center space-x-3">
                    <FCheckBoxRec />

                    <span class="text-sm text-black-200">
                      Apply Withholding tax</span
                    >
                  </div> -->

                  <!-- <div class="flex items-center space-x-3">
                    <FCheckBoxRec
                      :value="data.settings.pension"
                      @changeState="
                        data.settings.pension = !data.settings.pension
                      "
                    />
                    <span class="text-sm text-black-200">
                      Apply organization's pension setting</span
                    >
                  </div> -->
                  <!-- <div class="flex items-center space-x-3">
                    <FCheckBoxRec
                      :value="data.settings.nhf"
                      @changeState="data.settings.nhf = !data.settings.nhf"
                    />

                    <span class="text-sm text-black-200">
                      Apply organization's NHF setting</span
                    >
                  </div> -->
                </div>
              </div>

              <!--  -->
            </div>

            <!--  -->

            <div class="flex pb-5" @click="list = true">
              <ButtonBlue>
                <template v-slot:placeholder>
                  <spinner v-if="loading == true" />
                  <span v-else>Save</span></template
                >
              </ButtonBlue>
            </div>

            <!-- end content -->
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


