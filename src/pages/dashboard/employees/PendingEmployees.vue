<script lang="ts" setup>
import { ref } from "vue";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import confirmAlert from "../../../components/alerts/ConfirmAlert.vue";
import spinner from "../../../components/timer/Spinner.vue";
import EmptyState from "../../../components/EmptyState.vue";
import CalenderInterface from "../../../layouts/CalenderLayout.vue";
import { FCheckBoxComp } from "../../../core/form";
import { ICaretUpDown, IMenuVertical, IUserThree } from "../../../core/icons";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import { useEmployeeStore, useUserStore } from "../../../store/index";
import cache from "../../../composables/swr_cache";
import Pagination from "../../../components/Pagination.vue";

// initialize store
const employeeStore = useEmployeeStore();
const userStore = useUserStore();

// variables
const openCalender = ref(false);
const confirmMessage = ref({ message: "", id: "" });
const showSuccess = ref(false);
const showConfirm = ref(false);
const loading = ref(false);
const isEmptyTable = ref(false);
const responseData = ref<any>({ data: [], message: "" });
const successMessage = ref("");
const copied = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10);  // Make sure this is set to the page size used in the API
const totalItems = ref(0);


// emit
// const emit = defineEmits<{ (e: "refetchEmployee"): void }>();
const emit = defineEmits(['refetchEmployee', 'showInviteEmployee']) 


// // methods
// const fetchEmployees = async () => {
//   loading.value = true;

//   const totalPendingEmployeeCached = cache("total_pending_employees");
//   // console.log(totalPendingEmployeeCached);

//   if (typeof totalPendingEmployeeCached !== "undefined") {
    
//     responseData.value.data = totalPendingEmployeeCached;
//     loading.value = false;
//   }

//   const response = await request(employeeStore.invitationIndex(), loading);

//   // console.log(loading.value);

//   const successResponse = handleSuccess(response);

//   if (successResponse && typeof successResponse !== "undefined") {
//     responseData.value.data = successResponse.data.data;
//     cache("total_pending_employees", successResponse.data.data);
//     // console.log(successResponse.data);
//   }
// };

const capitalizeName = (name: string) => {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const fetchAllEmployees = async (page = 1) => {
  loading.value = true;

  const totalPendingEmployeeAllCached = cache("total_pending_all_employees");
  // console.log(totalPendingEmployeeCached);

  if (typeof totalPendingEmployeeAllCached !== "undefined") {
    
    responseData.value.data = totalPendingEmployeeAllCached;
    loading.value = false;
  }

  const response = await request(employeeStore.pendingInvitationIndex(10, page), loading);

  console.log("........",  responseData.value.data);

  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    responseData.value.data = successResponse.data.data.pageItems;
    currentPage.value = successResponse.data.data.currentPage;
    totalPages.value = successResponse.data.data.numberOfPages;
    totalItems.value = successResponse.data.data.pageSize * totalPages.value; 
    cache("total_pending_all_employees", successResponse.data.data.pageItems);
    console.log("Pending TABLE",successResponse.data);
  }
};
fetchAllEmployees(currentPage.value);
const updatePage = (page: number) => {
  fetchAllEmployees(page);
}
// fetchEmployees();

const removeEmployee = async (id: string) => {
  // console.log("removeEmployee hit");
  loading.value = true;

  const response = await request(employeeStore.delete(id), loading);
  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (typeof successResponse !== "undefined") {
    responseData.value = responseData.value.filter((data: any) => {
      return data.id !== id;
    });
    successMessage.value = `Employee with id '${id}' was successfully deleted`;
    emit("refetchEmployee");
  }
};

const confirmRemoveEmployee = (id: string) => {
  confirmMessage.value.message = `Do you really  want to delete employee with id '${id}' `;
  confirmMessage.value.id = id;
  showConfirm.value = true;
};

const copyLink = (link:string) => {
  copied.value = true;
  navigator.clipboard.writeText(
    link
      ? link
      : ''
  );
}
</script>
<template>
  <!-- Table -->
  <div
    class="bg-white rounded-t-lg divide-y divide-grey-200 overflow-auto scrollbar-hide w-full"
  >
    <!-- confirm alert -->
    <confirmAlert
      :showConfirm="showConfirm"
      @closeConfirm="showConfirm = false"
      v-if="showConfirm == true"
    >
      <template #title> Delete</template>
      <template #confirm>
        <span
          @click="[removeEmployee(confirmMessage.id), (showConfirm = false)]"
        >
          CONFIRM</span
        ></template
      >
      <template #message> {{ confirmMessage.message }}</template>
    </confirmAlert>

    <!-- successAlert -->
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ successMessage }}</successAlert
    >
    <spinner
      v-if="loading == true"
      class="flex justify-center items-center lg:h-[400px] h-[300px]"
    />
    <!--  -->
    <div v-else>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-6 p-6 flex-shrink-0">
          <!-- <div class="flex items-center space-x-2 cursor-pointer">
            <span class="text-sm text-black-200">All Employees</span>
            <span>
              <ICaretUpDown />
            </span>
          </div> -->
          <!--  -->
          <div class="flex items-center space-x-2 cursor-pointer">
            <span class="text-sm text-black-200">Sort by Department</span>
            <span>
              <ICaretUpDown />
            </span>
          </div>
          <div class="relative cursor-pointer">
            <div class="flex items-center space-x-2">
              <span
                class="text-sm text-black-200"
                @click="openCalender = !openCalender"
                >Sort by Date</span
              >
              <span>
                <ICaretUpDown />
              </span>
            </div>
            <CalenderInterface
              v-if="openCalender == true"
              class="absolute top-[30px] w-full"
            />
          </div>
        </div>
      </div>
      <!--  -->
      <div class="py-6">
        <div class="align-middle inline-block min-w-full">
          <div class="overflow-hidden sm:rounded-lg">
            <table class="min-w-full table-fixed">
              <thead
                v-if="responseData && responseData.data[0]"
                class="text-black-200 text-sm text-left"
              >
                <tr>
                  <th
                    scope="col"
                    class="py-4 font-normal text-left flex items-center space-x-3 flex-shrink-0"
                  >
                    <!-- <CheckBox customClasses="indeterminate-check" /> -->
                    <FCheckBoxComp />
                    <span> Name </span>
                  </th>
                  <th scope=" col" class="py-4 font-normal text-left">
                    Date added
                  </th>
                  <th scope="col" class="py-4 font-normal text-left">Phone</th>
                  <th scope="col" class="py-4 font-normal text-left">Dept.</th>
                  <th scope="col" class="py-4 font-normal text-left">Grade</th>
                  <th scope="col" class="py-4 font-normal text-left">Action</th>
                </tr>
              </thead>
              <tbody
                v-if="responseData && responseData.data[0]"
                class="bg-white divide-y divide-grey-200"
              >
                <tr
                  v-for="employee in responseData.data"
                  :key="employee.id"
                  class="text-black-100"
                >
                  <td class="py-4 w-[25%] whitespace-nowrap">
                    <div class="flex items-center space-x-3 flex-shrink-0">
                      <FCheckBoxComp />
                      <div class="flex flex-col">
                        <span class="text-sm font-semimedium"
                          >{{ capitalizeName(employee.firstName) }} {{ capitalizeName(employee.lastName) }}
                        </span>
                        <span class="text-xs text-gray-rgba-3"
                          >{{ employee.email }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="text-left flex flex-col">
                      <span class="text-sm font-semimedium">{{
                        employee.createdAt?.split("T")[0]
                      }}</span>
                      <span
                        class="text-xs"
                        :class="
                          employee.status == 'pending'
                            ? 'text-orange'
                            : 'text-green'
                        "
                        >{{ employee.status }}</span
                      >
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="font-normal text-left flex flex-col">
                      <span class="text-sm font-semimedium">{{
                        employee.phoneNumber ? employee.phoneNumber : ""
                      }}</span>
                      <span class="text-xs text-gray-rgba-3">Mobile</span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="font-normal text-left flex flex-col">
                      <span class="text-sm font-semimedium">{{
                        employee.department ? employee.department.name : "---"
                      }}</span>
                      <span class="text-xs text-gray-rgba-3">{{
                        employee.department ? employee.department.supportingName : "---"
                      }}</span>
                    </div>
                  </td>
                  <td class="py-4 text-left whitespace-nowrap">
                    <div class="font-normal flex flex-col">
                      <span class="text-sm font-semimedium">{{
                        employee.grade ? employee.grade.name : "---"
                      }}</span>
                      <span class="text-xs text-gray-rgba-3">{{
                        employee.employmentType ? employee.employmentType : "---"
                      }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-0 text-left whitespace-nowrap w-[18%]">
                    <div class="flex items-center justify-between">
                      <button
                        @click="copyLink(employee.link)" 
                        :disabled="true"
                        class="text-green bg-red-light text-sm text-bold px-4+1 py-2 rounded-full"
                      >
                        {{ !copied ? 'Copy Invite Link' : 'Copied' }}
                      </button>
                      <button
                        @click="confirmRemoveEmployee(employee.id)"
                        :disabled="true"
                        class="text-red bg-red-light text-sm text-bold px-4+1 py-2 rounded-full"
                      >
                        Remove Employee
                      </button>
                      <!-- <button>
                        <IMenuVertical />
                      </button> -->
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
                    <template #heading> Employees </template>
                    <template #desc>
                      All employees will be displayed here. Click on the “invite
                      employee” <br />
                      to start managing employees
                    </template>
                    <template #actions>
                      <button
                        @click="$emit('showInviteEmployee')"
                        class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
                      >
                        + Invite Employees
                      </button>
                    </template>
                  </EmptyState>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Pagination -->

        <!-- <div
          v-if="responseData && responseData.data[0]"
          class="px-6 mt-8 hidden items-center justify-between"
        >
          <span class="opacity-50 text-sm font-semimedium"
            >Showing 1-6 of 30 items</span
          >

          <div class="flex items-center space-x-2">
            <span
              class="text-white bg-[#003b3d] text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full"
              >1</span
            >
            <span
              class="text-sm w-8 h-8 flex items-center justify-center rounded-full border opacity-50"
              >2</span
            >
            <span
              class="text-sm w-8 h-8 flex items-center justify-center rounded-full border opacity-50"
              >3</span
            >
          </div>
        </div> -->
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
<style scoped></style>
