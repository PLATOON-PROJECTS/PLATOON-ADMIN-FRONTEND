<script setup lang="ts">
import { ref, inject } from "vue";

import FCheckedComponent from "../../../components/forms/FCheckBox.vue";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import ButtonLightBlue from "../../../components/buttons/ButtonLightBlue.vue";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../components/timer/Spinner.vue";
import confirmAlert from "../../../components/alerts/ConfirmAlert.vue";
import EmptyState from "../../../components/EmptyState.vue";
import { useRouter } from "vue-router";
import { FCheckBoxComp } from "../../../core/form";
import { IUserThree, IMenuVertical } from "../../../core/icons";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import { usePayrollStore, useUserStore } from "../../../store/index";
import {currency} from '../../../core/utils/currencyType'
import { getItem } from "../../../core/utils/storage.helper";
import Pagination from "../../../components/Pagination.vue";

const router = useRouter();

// initialize store
const payrollStore = usePayrollStore();
const userStore = useUserStore();

// variables
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10); 
const totalItems = ref(0);
const departmentName = ref("");
const deleteDraftsId = ref<number[]>([]);
const confirmType = ref("");
const deleting = ref(false);
const showConfirm = ref(false);
const confirmMessage = ref({ message: "" });
const deleteDraftId = ref<any>();

const showDepartment = ref(false);
const openCalender = ref(false);
const showSuccess = ref(false);
const saving = ref(false);
const data = ref({ department: "all" });
const loading = ref(false);
const month = ref();
const group = ref();
// const dataObj = ref<any>({
//   month: month.value,
//   group: group.value,
//   employees: [],
// });

const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;


const responseData = ref<any>({
  data: [],
  message: "",
});

const successMessage = ref("");

// provide and inject
const render = inject<any>("render");

// methods

const checkState = (id: any) => {
  return deleteDraftsId.value.includes(id) ? true : false;
};
const handleDraft = (id: any) => {
  if (deleteDraftsId.value.includes(id)) {
    deleteDraftsId.value = deleteDraftsId.value.filter((value: any) => {
      return value !== id;
    });
  } else {
    deleteDraftsId.value.push(id);
  }
};
const addAllDraftsForDelete = () => {
  if (deleteDraftsId.value[0]) {
    deleteDraftsId.value.length = 0;
  } else {
    responseData.value.data.forEach((value: any) => {
      deleteDraftsId.value.push(value.id);
    });
  }
};

// const deleteSingleDraft = async () => {
//   if (deleteDraftsId.value[0]) {
//     deleting.value = true;

//     const response = await request(
//       payrollStore.delete(deleteDraftsId.value[0]),
//       deleting
//     );

//     handleError(response, userStore);
//     const successResponse = handleSuccess(response, showSuccess);
//     showSuccess.value=true
   

//     if (successResponse && typeof successResponse !== "undefined") {
//       responseData.value.data = responseData.value.data.filter((data: any) => {
//         return !deleteDraftsId.value.includes(data.id) && data.id;
//       });
//       responseData.value.message = "Draft  deleted succesfully";
//       deleteDraftsId.value.length = 0;
//       render.value = true;
//     }
//   }
// };

const deleteSingleDraftedPayroll = async () => {
  if (deleteDraftsId.value[0]) {
  deleting.value = true;
  try {
    const response = await payrollStore.deleteDraftedPayroll(deleteDraftsId.value[0]);
    if (response.succeeded) {
      console.log("OOOO", response)
      showSuccess.value = true;
      successMessage.value = "Drafted payroll deleted successfully.";
      responseData.value.data = responseData.value.data.filter((data: any) => {
          return !deleteDraftsId.value.includes(data.id) && data.id;
        });
        deleteDraftsId.value = [];
        render.value = true;
      // await fetchDraftedPayroll();
    }
  } catch (error) {
    handleError(error, "Failed to delete drafted payroll");
  } finally {
    deleting.value = false;
  }
  }
};


// const deleteManyDrafts = async () => {
//   if (deleteDraftsId.value[0]) {
//     if (deleteDraftsId.value.length < 2) {
//       deleteSingleDraft();
//     } else {
//       deleting.value = true;

//       const response = await request(
//         payrollStore.deleteMany(deleteDraftsId.value),
//         deleting
//       );

//       handleError(response, userStore);
//       const successResponse = handleSuccess(response, showSuccess);

//       if (successResponse && typeof successResponse !== "undefined") {
//         responseData.value.data = responseData.value.data.filter(
//           (data: any) => {
//             return !deleteDraftsId.value.includes(data.id) && data.id;
//           }
//         );

//         render.value = true;
//       }
//     }
//   }
// };
const confirmRemoveDrafts = () => {
  confirmType.value = "delete";
  confirmMessage.value.message = `Do you really  want to delete multiple drafts(${deleteDraftsId.value.length})?  `;
  showConfirm.value = true;
};

// const Drafts = async () => {
//   loading.value = true;

//   const response = await request(payrollStore.draft(), loading);
//   // console.log(loading.value);

//   const successResponse = handleSuccess(response);

//   if (successResponse && typeof successResponse !== "undefined") {
//     if (typeof successResponse.data.data.length !== "undefined") {
//       responseData.value.data = successResponse.data.data;
//     } else {
//       responseData.value.data.push(successResponse.data.data);
//     }

//     // console.log(successResponse.data);
//   } else {
//     responseData.value.data = [];
//   }
// };

const getMonthFromDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return ""; 
  }
  
  const options: Intl.DateTimeFormatOptions = { month: 'long' };
  return date.toLocaleString('default', options);
};

const fetchDraftedPayroll = async (page = 1) => {
  loading.value = true;

  try {
    const params = {
      organisationId,
      pageSize: pageSize.value,
      pageNumber: currentPage.value,
    };
    const response = await payrollStore.getOrganisationDraftedPayroll(params);

    if (response.data) {
      console.log("========", response.data.pageItems)
      console.log("======______===", response.data)
      responseData.value.data = response.data.pageItems;
      currentPage.value = response.data.currentPage;
      totalPages.value = response.data.numberOfPages;
      totalItems.value = response.data.pageSize * totalPages.value;
    }
  } catch (error) {
    console.error("Error fetching drafted payroll:", error);
  } finally {
    loading.value = false;
  }
};

// fetchDraftedPayroll();
fetchDraftedPayroll(currentPage.value);
const updatePage = (page: number) => {
  fetchDraftedPayroll(page);
}

// Drafts();
</script>
<template>
  <div>
    <div
      class="bg-white h-full rounded-t-lg py-6 space-y-5 overflow-auto scrollbar-hide"
    >
      <confirmAlert
        :showConfirm="showConfirm"
        @closeConfirm="showConfirm = false"
      >
        <template #title> Delete</template>
        <template #confirm>
          <span @click="[deleteSingleDraftedPayroll(), (showConfirm = false)]">
            CONFIRM</span
          ></template
        >
        <template #message> {{ confirmMessage.message }}</template>
      </confirmAlert>

      <successAlert
        :showSuccess="showSuccess"
        @closeSuccess="showSuccess = false"
        v-if="showSuccess == true"
      >
        <template #otherMessage>CLOSE</template>
        {{ responseData.message }}</successAlert
      >

      <div class="px-5 py-2 flex justify-between lg:space-x-0 space-x-3">
        <div class="space-y-6">
          <div>
            <h3 class="font-bold lg:text-2xl text-xl whitespace-nowrap">
              All saved payroll
            </h3>
            <p
              class="text-sm pt-1 text-black-200 font-semimedium whitespace-nowrap"
            >
              Continue edit to complete process
            </p>
          </div>

          <div class="flex space-x-2 items-center">
            <span class="pt-2">
              <FCheckBoxComp
                :value="
                  responseData.data[0] &&
                  deleteDraftsId.length === responseData.data.length
                    ? true
                    : false
                "
                name="drafts"
                @click="addAllDraftsForDelete()"
              />
            </span>
            <span class="text-sm pt-1 font-semimedium text-[#626669]"
              >Select All</span
            >
          </div>
        </div>

        <div>
          <div class="flex space-x-4" v-if="responseData.data[0]">
            <ButtonBlue text-color="text-white" :disabled="true">
              <template v-slot:placeholder>Download data</template>
            </ButtonBlue>
            <ButtonLightBlue
              textColor="text-red"
              :disabled="deleteDraftsId[0] ? false : true"
              class="text-red text-sm font-medium bg-red-light px-4+1 py-3 rounded-full"
              :class="!deleteDraftsId[0] ? 'disabled:opacity-55' : ' '"
              @click="confirmRemoveDrafts()"
            >
              <template v-slot:placeholder>
                <spinner v-if="deleting == true"></spinner>
                <span v-else>Delete</span>
              </template>
            </ButtonLightBlue>
          </div>
        </div>
      </div>
      <div class="space-y-10">
        <!-- table -->

        <div class="border-t border-grey">
          <div class="py-6">
            <div class="align-middle inline-block min-w-full">
              <div class="overflow-hidden sm:rounded-lg">
                <spinner
                  v-if="loading == true"
                  class="flex justify-center items-center lg:h-[400px] h-[300px]"
                />
                <table v-else class="min-w-full table-fixed">
                  <thead  v-if="responseData.data[0]" class="text-black-200 font-semimedium text-sm text-left">
                    <tr>
                      <th
                        scope="col"
                        class="py-4 text-left flex items-center space-x-3 whitespace-nowrap"
                      >
                        <!-- <CheckBox customClasses="indeterminate-check" /> -->
                        <span> Title </span>
                      </th>
                      <th scope=" col" class="py-4 text-left whitespace-nowrap">
                        Total Gross Pay
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Total Bonus
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Total Deductions
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Total Tax
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    v-if="responseData.data.length"
                    class="bg-white divide-y divide-grey-200"
                  >
                    <tr
                    v-for="(data, index) in responseData && responseData.data"
                      :key="data.draftedPayrollId"
                      class="text-black-100"
                    >
                      <td class="py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-3">
                          <FCheckBoxComp
                            :value="checkState(data.draftedPayrollId)"
                            @click="handleDraft(data.draftedPayrollId)"
                          />

                          <div class="flex flex-col">
                            <span class="text-sm font-semimedium"
                              >{{ getMonthFromDate(data?.fetchOrganisationPayrollResponse?.scheduledDate) }} Salary Payment</span
                            >
                            <span class="text-xs text-gray-rgba-3"
                              >{{ data?.fetchOrganisationPayrollResponse?.totalEmployees }} Employees</span
                            >
                          </div>
                        </div>
                      </td>
                      <td class="py-4 whitespace-nowrap">
                        <div class="text-left flex flex-col">
                          <span class="text-sm font-semimedium"
                            >₦{{ data?.fetchOrganisationPayrollResponse?.totalGrossPay ? currency(data.fetchOrganisationPayrollResponse?.totalGrossPay) : "0" }}</span
                          >
                          <span class="text-xs text-gray-rgba-3"
                            >Net: ₦{{ data?.fetchOrganisationPayrollResponse?.totalNetPay ? currency(data.fetchOrganisationPayrollResponse?.totalNetPay) : "0" }}
                          </span>
                        </div>
                      </td>
                      <td class="py-4 whitespace-nowrap">
                        <div class="font-normal text-left flex flex-col">
                          <span class="text-sm font-semimedium"
                            >₦ {{ data?.fetchOrganisationPayrollResponse?.totalBonus ? currency(data.fetchOrganisationPayrollResponse?.totalBonus) : "0" }}</span
                          >
                          <span class="text-xs text-gray-rgba-3"
                            >Commisions</span
                          >
                        </div>
                      </td>
                      <td class="py-4 flex whitespace-nowrap">
                        <div class="font-normal text-left flex flex-col">
                          <span class="text-sm font-semimedium"
                            >₦ {{ data?.fetchOrganisationPayrollResponse?.totalDeductions ? currency(data.fetchOrganisationPayrollResponse?.totalDeductions) : "0" }}</span
                          >
                          <span class="text-xs text-gray-rgba-3"
                            >Pensions, Health</span
                          >
                        </div>
                      </td>
                      <td class="py-4 items-center text-left whitespace-nowrap">
                        <div class="font-normal flex flex-col">
                          <span class="text-sm font-semimedium"
                            >₦ {{ data?.fetchOrganisationPayrollResponse?.totalTaxAmount ? currency(data.fetchOrganisationPayrollResponse?.totalTaxAmount) : "0" }}</span
                          >
                          <span class="text-xs text-gray-rgba-3">LAGIT</span>
                        </div>
                      </td>
                      <td class="py-4 text-left whitespace-nowrap">
                        <div class="flex items-center space-x-2">
                          <div class="flex w-full justify-between">
                            <ButtonLightBlue>
                              <template v-slot:placeholder
                                >Continue Edit</template
                              >
                            </ButtonLightBlue>
                            <!-- <button>
                              <IMenuVertical />
                            </button> -->
                          </div>
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
                        <template #heading> Payroll Drafts</template>
                        <template #desc>
                          All payroll drafts will be displayed here. Click on
                          “add payroll” <br />
                          to get started
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
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!-- end of table -->
        <Pagination 
        :currentPage="currentPage" 
        :totalPages="totalPages"
        :pageSize="pageSize"
        :totalItems="totalItems"
        @updatePage="updatePage"
        />
      </div>
    </div>
  </div>
</template>

<style></style>
