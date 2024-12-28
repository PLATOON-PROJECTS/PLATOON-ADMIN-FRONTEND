<script setup lang="ts">
import State from "../../../components/dropdowns/states.vue";
import ButtonBlueOutline from "../../../components/buttons/ButtonBlueOutline.vue";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";

// icons
import { IIncDec, IArrowDown, IArrowLeftTail } from "../../../core/icons";
import { ref, provide, reactive } from "vue";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import { ICaretUpDown, IMenuVertical, IScales } from "../../../core/icons";
import spinner from "../../../components/timer/Spinner.vue";
import CalenderInterface from "../../../layouts/CalenderLayout.vue";
import EmptyState from "../../../components/EmptyState.vue";
import { useRouter } from "vue-router";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import {
  useTaxStore,
  useEmployeeStore,
  useUserStore,
} from "../../../store/index";
import { State as StateEnum } from "../../../interface/enums.interface";
import cache from "../../../composables/swr_cache";

// initialize store
const taxStore = useTaxStore();
const employeeStore = useEmployeeStore();
const userStore = useUserStore();
const router = useRouter();

//// variables
const openCalender = ref(false);
const showSuccess = ref(false);
const loading = ref(false);
const sending = ref(false);
const disabled = ref(true);
const showState = ref(false);
const dataObj = ref<any>([]);
const excludedData = ref<any>([]);
const responseData = ref<any>();

const state = ref<StateEnum>();
const city = ref();
// provide and inject

provide("selectedState", state);
provide("showState", showState);

// methods
// const createTax = async () => {
//   // console.log(dataObj);
//   sending.value = true;
//   const response = await request(taxStore.create(dataObj.value), sending);
//   // console.log(loading.value);

//   handleError(response, userStore);
//   const successResponse = handleSuccess(response, showSuccess);

//   if (successResponse && typeof successResponse !== "undefined") {
//     // console.log(successResponse.data);
//     successResponse.message = "Employee enrolled for tax successfully ";
//     responseData.value = successResponse;
//     // successResponse.data.data.forEach((data: any) => {
//     //   data.meta.tax && excludedData.value.push(data);
//     // });
//     index();
//   }
// };
// const index = async () => {
//   loading.value = true;
//   const totalEmployeeCached = cache("total_employees");

//   if (typeof totalEmployeeCached !== "undefined") {
//     loading.value = false;

//     excludedData.value.length = 0;

//     totalEmployeeCached.forEach((data: any) => {
//       // console.log(data);

//       data.meta.tax ? " " : excludedData.value.push(data);
//     });
//   }
//   const response = await request(employeeStore.index(), loading);
//   // console.log(loading.value);

//   const successResponse = handleSuccess(response);

//   if (successResponse && typeof successResponse !== "undefined") {
//     cache("total_employees", successResponse.data.data);

//     excludedData.value.length = 0;

//     successResponse.data.data.forEach((data: any) => {
//       data.meta.tax ? " " : excludedData.value.push(data);
//     });
//   }
// };

const add = (id: any, valueId: string) => {
  disabled.value = false;
  const target: HTMLInputElement = document.getElementById(
    valueId
  ) as HTMLInputElement;

  let encounteredId = false;

  const data = { employee_id: "", payee_id: "", state: "", bvn: "" };

  valueId.split(id)[1] === "state"
    ? [
        (data[valueId.split(id)[1] as keyof Object] = state.value as any),
        (target.value = state.value as any),
      ]
    : (data[valueId.split(id)[1] as keyof Object] = target.value as any);
  data.employee_id = id;

  if (dataObj.value[0]) {
    for (let i = 0; i < dataObj.value.length; i++) {
      if (dataObj.value[i].employee_id && dataObj.value[i].employee_id === id) {
        encounteredId = true;
        data.payee_id !== "" && (dataObj.value[i].payee_id = data.payee_id);
        data.bvn !== "" && (dataObj.value[i].bvn = data.bvn);
        data.state !== "" && (dataObj.value[i].state = data.state);
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

const showStateComp = (id: any) => {
  const target = document.getElementById(id);
  target?.classList.replace("hidden", "flex");
};

const hideStateComp = (id: any) => {
  const target = document.getElementById(id);
  target?.classList.replace("flex", "hidden");
};

// hookes
// index();
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
    <!--  -->

    <div class="w-full">
      <div
        class="pt-2 flex justify-between overflow-auto scrollbar-hide w-full"
      >
        <div class="flex items-center space-x-5-1">
          <button @click="router.back()">
            <IArrowLeftTail />
          </button>
          <span class="text-black-rgba font-medium sm:text-2xl text-xl"
            >Tax</span
          >
        </div>
        <div class="flex">
          <ButtonBlue @click="" :disabled="disabled">
            <template v-slot:placeholder>
              <spinner v-if="sending == true" />
              <span v-else>Done</span></template
            >
          </ButtonBlue>
        </div>
      </div>
    </div>

    <!-- table -->

    <div>
      <div class="bg-white h-full rounded-lg py-6 space-y-5">
        <div class="space-y-10 px-5">
          <div class="flex flex-col space-y-3">
            <span class="font-medium text-2xl">Add Employees</span>
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
                      <ButtonBlue :disabled="disabled">
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
              <div class="">
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
                  <table class="w-full">
                    <thead v-if="excludedData[0]" class="text-sm text-left">
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
                          State
                        </th>
                        <th
                          scope="col"
                          class="py-4 text-left whitespace-nowrap"
                        >
                          PAY ID
                        </th>
                        <th
                          scope="col"
                          class="py-4 text-left whitespace-nowrap"
                        >
                          BVN
                        </th>
                      </tr>
                    </thead>

                    <tbody
                      v-if="excludedData[0]"
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
                              class="cursor-pointer space-x-2 font-normal mb-3 items-center text-left rounded-lg px-2 text-gray-rgba-3 flex"
                            >
                              <input
                                :id="employee.id + 'state'"
                                @click="
                                  [
                                    showStateComp(
                                      employee.id + 'stateComponent'
                                    ),
                                  ]
                                "
                                type="text"
                                class="rounded-lg font-semimedium lg:w-1/3 w-[80px] bg-transparent text-black text-sm outline-none border-none focus:outline-none focus:border-none"
                                placeholder="Select State"
                              />
                              <span
                                @click="
                                  hideStateComp(employee.id + 'stateComponent')
                                "
                              >
                                <IArrowDown />
                              </span>
                            </div>
                            <div
                              class="absolute z-50 h-56 shadow-lg scrollbar-hide overflow-auto top-15"
                            >
                              <div
                                :id="employee.id + 'stateComponent'"
                                class="hidden"
                              >
                                <component
                                  :is="State"
                                  @click="
                                    [
                                      add(employee.id, employee.id + 'state'),
                                      hideStateComp(
                                        employee.id + 'stateComponent'
                                      ),
                                    ]
                                  "
                                ></component>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td class="whitespace-nowrap">
                          <div
                            class="font-normal w-[80%] border text-left rounded-xl px-4 py-2 my-4 text-gray-rgba-3 mb-1"
                          >
                            <input
                              @input="
                                add(employee.id, employee.id + 'payee_id')
                              "
                              type="text"
                              :id="employee.id + 'payee_id'"
                              class="rounded-lg outline-none text-black bg-transparent focus:outline-none focus:border-none"
                              placeholder="0000000000000"
                            />
                          </div>
                        </td>
                        <td class="whitespace-nowrap">
                          <div
                            class="font-normal w-[80%] text-left rounded-xl px-4 py-2 my-4 border text-gray-rgba-3 mb-1"
                          >
                            <input
                              @input="add(employee.id, employee.id + 'bvn')"
                              type="text"
                              :id="employee.id + 'bvn'"
                              class="rounded-lg outline-none text-black border-none bg-transparent focus:outline-none focus:border-none"
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
                            <IScales />
                          </template>
                          <template #heading>Unregistered employees </template>
                          <template #desc>
                            All Unregistered employees for tax will be displayed
                            here. Click on<br />
                            the “Start now” button to add employee
                          </template>
                          <template #actions>
                            <button
                              @click="
                                router.push({ path: '/dashboard/employees' })
                              "
                              class="bg-blue text-white px-4+1 py-2.5+1 rounded-full text-sm"
                            >
                              Start Now
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
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
