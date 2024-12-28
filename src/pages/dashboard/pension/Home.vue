<script setup lang="ts">
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import EmptyState from "../../../components/EmptyState.vue";
import { IIncDec, IArrowDown, IScales } from "../../../core/icons";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import { ref } from "vue";
import spinner from "../../../components/timer/Spinner.vue";
import ButtonBlueOutline from "../../../components/buttons/ButtonBlueOutline.vue";
import ButtonLightBlue from "../../../components/buttons/ButtonLightBlue.vue";

import { useRouter, useRoute } from "vue-router";

import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import {
  usePensionStore,
  useUserStore,
  useEmployeeStore,
} from "../../../store/index";
import { getItem } from "../../../core/utils/storage.helper";

// initialize store
const pensionStore = usePensionStore();
const employeeStore = useEmployeeStore();
const userStore = useUserStore();
// initialize router
const router = useRouter();
const route = useRoute();

// variables

const showSuccess = ref(false);
const loading = ref(false);
const sending = ref(false);
const dataObj = ref<any>([]);

const issuers = ref<any>([]);
const enrolledData = ref<any>([]);
const excludedData = ref<any>([]);
const responseData = ref<any>();
  const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));


// methods
const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;

const fetchIssuer = async () => {
  loading.value = true;
  const response = await request(pensionStore.getIssuers());

  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data.data);
    successResponse.data.data.map((issuer:any)=>{
      issuers.value.push(issuer.name)
    })
    
  }
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

const fetchEmployees = async (page = 1) => {
  loading.value = true;
  const response = await request(employeeStore.index(organisationId, 10, page), loading);

  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);
    //filter response into excluded and enrolled

    successResponse.data.data.forEach((data: any) => {
      !data.meta.pension
        ? excludedData.value.push(data)
        : enrolledData.value.push(data);
    });

    // console.log(excludedData.value);
  }
};
fetchEmployees();
fetchIssuer();
</script>
<template>
  <div class="px-6 py-10 space-y-6">
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}</successAlert
    >

    <div class="w-full">
      <div class="pt-2">
        <h3 class="font-bold text-xl">Pensions</h3>
      </div>
    </div>

    <!-- table -->

    <div>
     
      <div class="bg-white h-full rounded-lg py-6 space-y-5">
        <div class="space-y-10 px-5">
          <div class="flex flex-col space-y-3">
            <span class="text-base font-medium">Update Beneficiaries</span>
            <span class="text-sm font-semimedium text-black-rgba-100"
              >Kindly update your beneficiaries via either of the
              followings</span
            >
          </div>
          <div class="space-y-5">
            <div class="flex space-x-6">
              <div class="space-y-7">
                <div
                  class="lg:flex lg:space-x-10 lg:space-y-0 space-y-3 items-center"
                >
                  <div class="flex flex-col">
                    <span class="text-sm font-semimedium">Method 1:</span>

                    <span class="text-sm font-normal"
                      >Download your unregistered employees and reupload the
                      sheet using the menus below</span
                    >

                    <span class="text-sm font-normal text-gray-rgba-3"
                      >Recommended for bulk updates</span
                    >
                  </div>
                  <div class="lg:flex lg:space-x-5 lg:space-y-0 space-y-3">
                    <div class="flex">
                      <ButtonBlueOutline>
                        <template v-slot:placeholder
                          >Download Sheet Format</template
                        >
                      </ButtonBlueOutline>
                    </div>
                    <div class="flex">
                      <ButtonBlue>
                        <template v-slot:placeholder>Upload Sheet</template>
                      </ButtonBlue>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semimedium">Method: 2</span>
                  <span class="text-sm font-normal"
                    >Scroll down and fill the form below</span
                  >
                  <span class="text-sm font-normal text-gray-rgba-3"
                    >Recommended for single or few updates</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <h3 class="text-black-rgba font-medium text-2xl">
              Unregistered employees
            </h3>

            <div class="py-2 flex justify-between overflow-auto scrollbar-hide">
              <div class="flex space-x-5">
                <div class="flex space-x-2 whitespace-nowrap">
                  <span class="text-sm pt-1 font-semimedium text-black-200"
                    >Sort by Pension Manager</span
                  >
                  <span class="pt-2">
                    <IIncDec />
                  </span>
                </div>
                <!--  -->
                <div class="flex space-x-2 whitespace-nowrap">
                  <span class="text-sm pt-1 font-semimedium text-black-200"
                    >Sort by Department</span
                  >
                  <span class="pt-2">
                    <IIncDec />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class=" ">
          <!-- table -->
          <div class="border-t border-grey overflow-auto scrollbar-hide">
            <spinner
              v-if="loading == true"
              class="flex justify-center items-center lg:h-[400px] h-[300px]"
            />
            <div class="py-6" v-else>
              <div class="align-middle inline-block min-w-full">
                <div class="w-full rounded-lg">
                  <table
                    v-if="excludedData && excludedData[0]"
                    class="w-full lg:w-[74%]"
                  >
                    <thead class="text-sm text-left">
                      <tr class="text-black-200 font-semimedium">
                        <th
                          scope="col"
                          class="py-4 text-left flex items-center space-x-3 whitespace-nowrap"
                        >
                          <!-- <CheckBox customClasses="indeterminate-check" /> -->
                          <span> Name </span>
                        </th>
                        <th
                          scope=" col"
                          class="py-4 text-left whitespace-nowrap"
                        >
                          PFA
                        </th>
                        <th
                          scope="col"
                          class="py-4 text-left whitespace-nowrap"
                        >
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
                          <div class="flex flex-col">
                            <span class="text-sm font-semimedium"
                              >{{ employee.firstname }}
                              {{ employee.lastname }}</span
                            >
                            <!-- <span class="text-xs text-gray-rgba-3">___</span> -->
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
                              class="absolute z-50 hidden h-20 scrollbar-hide overflow-auto top-5 space-y-2 p-6 shadow-xl bg-white text-sm cursor-pointer font-bold rounded-lg"
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
                            class="font-normal w-full text-left rounded-xl px-4 py-2 my-4 border-2 text-gray-rgba-3 mb-1"
                          >
                            <input
                              @input="
                                add(employee.id, employee.id + 'pension_no')
                              "
                              type="text"
                              :id="employee.id + 'pension_no'"
                              class="rounded-lg w-full outline-none border-none bg-transparent focus:outline-none focus:border-none"
                              placeholder="0000000000000"
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <!-- empty state below -->
                  </table>
                  <div v-else class="w-full flex no-hover justify-center">
                    <EmptyState>
                      <template #icon>
                        <IScales />
                      </template>
                      <template #heading>Unregistered employees </template>
                      <template #desc>
                        All Unregistered employees for pension will be displayed
                        here. Click on<br />
                        the “Start now” button to add employee
                      </template>
                      <template #actions>
                        <button
                          @click="router.push({ path: '/dashboard/employees' })"
                          class="bg-blue text-white px-4+1 py-2.5+1 rounded-full text-sm"
                        >
                          Start Now
                        </button>
                      </template>
                    </EmptyState>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- end of table -->
          <div class="text-sm px-6" v-if="excludedData && excludedData[0]">
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
      </div>
    </div>
  </div>
</template>

<style></style>
