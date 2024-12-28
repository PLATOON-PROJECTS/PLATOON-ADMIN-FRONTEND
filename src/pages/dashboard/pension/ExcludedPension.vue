<script setup lang="ts">
import { ref, inject, watch, provide } from "vue";
import { useRoute } from "vue-router";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import ButtonColorless from "../../../components/buttons/ButtonColorless.vue";
// icons

import successAlert from "../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../components/timer/Spinner.vue";
import cache from "../../../composables/swr_cache";
import Departments from "../../../components/dropdowns/department.vue";

// icons

import {
  IIncDec,
  IArrowDown,
  IMenuVertical,
  IUserThree,
} from "../../../core/icons";
import EmptyState from "../../../components/EmptyState.vue";
import { useRouter } from "vue-router";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import {
  usePensionStore,
  useEmployeeStore,
  useUserStore,
} from "../../../store/index";

// initialize router
const router = useRouter();
const route = useRoute();

// initialize store
const pensionStore = usePensionStore();
const employeeStore = useEmployeeStore();
const userStore = useUserStore();

// variables

const showSuccess = ref(false);
const departmentName = ref("");
const showDepartment = ref(false);
const data = ref({ department: "" });
const loading = ref(false);
const excludedData = ref<any>([]);
const responseData = ref<any>([]);
const sending = ref(false);
const dataObj = ref<any>([]);

const issuers = ref<string[]>([]);
const successMessage = ref("Action successful");

// provide and inject
const render = inject<any>("render");
provide("showDepartment", showDepartment);
provide("selectedDepartment", [data, departmentName]);

// methods
const fetchIssuer = async () => {
  loading.value = true;
  const response = await request(pensionStore.getIssuers());

  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data.data);
    successResponse.data.data.map((issuer: any) => {
      issuers.value.push(issuer.name);
    });
  }
};

const fetchEmployeeByDepartment = async () => {
  loading.value = true;
  const response = await request(
    employeeStore.employeesInDepartment(data.value.department),
    loading
  );

  handleError(response, userStore);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    excludedData.value.length = 0;
    successResponse.data.data.forEach((data: any) => {
      data.meta.pension ? " " : excludedData.value.push(data);
    });
    // console.log(successResponse.data);
  }
  data.value.department = "";
};

const showIssuer = (id: any) => {
  const body = document.getElementById(id);
  if (body?.classList.contains("hidden")) {
    body?.classList.replace("hidden", "block");
  } else {
    body?.classList.replace("block", "hidden");
  }
};
const createPension = async () => {
  if (dataObj.value[0]) {
    sending.value = true;
    const response = await request(pensionStore.create(dataObj.value), sending);

    // console.log(response);
    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);

    if (successResponse && typeof successResponse !== "undefined") {
      successResponse.message = "Employee enrolled for pension successfully";
      responseData.value = successResponse;
      // console.log(successResponse.data);

      render.value = true;
    }
  }
};

const setIssuer = (issuer: string, id: string) => {
  const issuerField: HTMLElement = document.getElementById(
    id + "issuerField"
  ) as HTMLElement;

  add(id, issuer, "issuer");

  issuerField.innerHTML = issuer;
  showIssuer(id + "issuerBody");
};

const add = (id: any, valueId: string, type?: string) => {
  const target: any = document.getElementById(valueId) as any;

  let encounteredId = false;

  const data = { employee_id: "", issuer: "", pension_no: "" };

  type && type === "issuer"
    ? (data.issuer = valueId)
    : (data[valueId.split(id)[1] as keyof Object] = target.value as any);
  data.employee_id = id;

  if (dataObj.value[0]) {
    for (let i = 0; i < dataObj.value.length; i++) {
      if (dataObj.value[i].employee_id && dataObj.value[i].employee_id === id) {
        encounteredId = true;
        data.issuer !== "" && (dataObj.value[i].issuer = data.issuer);
        data.pension_no !== "" &&
          (dataObj.value[i].pension_no = data.pension_no);

        // console.log(dataObj.value);
        return;
      }
    }
    if (encounteredId == false) {
      dataObj.value.push(data);
    }
  } else {
    dataObj.value.push(data);
    // console.log(dataObj.value);
    return;
  }
};

// const fetchEmployees = async () => {
//   loading.value = true;
//   const totalExcludedPensionCache = cache("total_excluded_pension");

//   if (typeof totalExcludedPensionCache !== "undefined") {
//     loading.value = false;
//     excludedData.value.length = 0;
//     excludedData.value = totalExcludedPensionCache;
//   }
//   const response = await request(employeeStore.index(), loading);

//   const successResponse = handleSuccess(response);

//   if (successResponse && typeof successResponse !== "undefined") {
//     excludedData.value.length = 0;
//     // console.log(successResponse.data);

//     successResponse.data.data.forEach((data: any) => {
//       data.meta.pension ? " " : excludedData.value.push(data);
//     });

//     cache("total_excluded_pension", excludedData.value);

//     // console.log(successResponse.data);
//   }
// };
// fetchEmployees();

// watchers
watch(showDepartment, (newValue, oldValue) => {
  // console.log(newValue, oldValue);
  if (newValue !== oldValue && data.value.department != "") {
    fetchEmployeeByDepartment();
  }
});

fetchIssuer();
</script>
<template>
  <div class="bg-white h-full rounded-lg py-6 space-y-5">
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}</successAlert
    >
    <div class="px-5 py-2 flex justify-between">
      <div
        class="flex justify-between w-full overflow-auto scrollbar-hide lg:space-x-0 space-x-3"
      >
        <div class="flex space-x-2 whitespace-nowrap">
          <span class="text-sm pt-1 font-semimedium text-black-200"
            >Sort by Pension Manager</span
          >
          <span class="pt-2">
            <IIncDec />
          </span>
        </div>
        <!--  -->
        <div class="flex">
          <ButtonBlue @click="createPension">
            <template v-slot:placeholder>
              <spinner v-if="sending == true" />
              <span v-else>Proceed</span></template
            >
          </ButtonBlue>
        </div>
      </div>
    </div>
    <spinner
      v-if="loading == true"
      class="flex justify-center items-center lg:h-[400px] h-[300px]"
    />
    <div v-else>
      <div class="space-y-10 overflow-auto scrollbar-hide">
        <!-- table -->
        <div class="border-t border-grey">
          <div class="py-6">
            <div class="align-middle inline-block min-w-full">
              <div class="sm:rounded-lg">
                <table
                  class="max-w-full w-full"
                  :class="excludedData[0] && 'lg:w-[74%]'"
                >
                  <thead v-if="excludedData[0]" class="text-sm text-left">
                    <tr class="text-black-200 font-semimedium">
                      <th
                        scope="col"
                        class="py-4 text-left flex items-center space-x-3 whitespace-nowrap"
                      >
                        <!-- <CheckBox customClasses="indeterminate-check" /> -->
                        <span> Name </span>
                      </th>
                      <th scope=" col" class="py-4 text-left whitespace-nowrap">
                        PFA
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Pension Number
                      </th>
                    </tr>
                  </thead>

                  <tbody
                    v-if="excludedData && excludedData[0]"
                    class="bg-white divide-y divide-grey-200"
                  >
                    <tr
                      v-for="employee in excludedData"
                      :key="employee.id"
                      class="text-black-100"
                    >
                      <td class="py-4 whitespace-nowrap">
                        <div class="">
                          <div class="flex flex-col">
                            <span class="text-sm font-semimedium"
                              >{{ employee.firstname }}
                              {{ employee.lastname }}</span
                            >
                            <!-- <span class="text-xs text-gray-rgba-3">___</span> -->
                          </div>
                        </div>
                      </td>
                      <td class="py-4 whitespace-nowrap">
                        <div class="relative">
                          <div
                            @click="showIssuer(employee.id + 'issuerBody')"
                            class="text-left flex items-center space-x-3 mb-4"
                          >
                            <span
                              :id="employee.id + 'issuerField'"
                              class="text-sm font-semimedium"
                              >Select Pension Manager</span
                            >
                            <IArrowDown class="mt-1" />
                          </div>
                          <div
                            :id="employee.id + 'issuerBody'"
                            class="absolute z-50 h-20 hidden scrollbar-hide overflow-auto top-5 space-y-2 p-6 shadow-xl bg-white text-sm cursor-pointer font-bold rounded-lg"
                          >
                            <p
                              @click="setIssuer(issuer, employee.id)"
                              v-for="(issuer, index) in issuers"
                              :key="index"
                            >
                              <span :id="employee.id + 'issuer'">{{
                                issuer
                              }}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td class="whitespace-nowrap">
                        <div
                          class="font-normal text-left rounded-xl pl-4 py-2 my-4 border-2 text-gray-rgba-3 mb-1 w-full"
                        >
                          <input
                            @input="
                              add(employee.id, employee.id + 'pension_no')
                            "
                            :id="employee.id + 'pension_no'"
                            type="text"
                            class="rounded-lg text-black outline-none border-none focus:outline-none focus:border-none bg-transparent"
                            placeholder="0000000000000"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  <!-- empty state below -->
                  <tbody v-else class="w-full">
                    <tr class="w-full no-hover">
                      <EmptyState>
                        <template #icon>
                          <IUserThree />
                        </template>
                        <template #heading> Excluded Pension </template>
                        <template #desc>
                          All excluded employees for pension will be displayed
                          here. Click on the “enroll employee” <br />
                          to enroll employees for pension
                        </template>
                        <template #actions>
                          <button
                            @click="router.push('/dashboard/employees/')"
                            class="bg-blue text-white px-4+1 py-2.5+1 rounded-full text-sm"
                          >
                            + Enroll Employees
                          </button>
                        </template>
                      </EmptyState>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!-- end of table -->
        <div
          v-if="excludedData && excludedData[0]"
          class="hidden justify-between px-6 text-sm text-gray-rgba-3 whitespace-nowrap items-center lg:space-x-0 space-x-3"
        >
          <span> Showing 1-6 of 30 items</span>
          <div class="flex space-x-3">
            <ButtonBlue>
              <template v-slot:placeholder>1</template>
            </ButtonBlue>
            <ButtonColorless>
              <template v-slot:placeholder>2</template>
            </ButtonColorless>
            <ButtonColorless>
              <template v-slot:placeholder>3</template>
            </ButtonColorless>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
