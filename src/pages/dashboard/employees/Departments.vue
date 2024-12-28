<script lang="ts" setup>
import { ref } from "vue";
import spinner from "../../../components/timer/Spinner.vue";
import EmptyState from "../../../components/EmptyState.vue";
import CalenderInterface from "../../../layouts/CalenderLayout.vue";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import confirmAlert from "../../../components/alerts/ConfirmAlert.vue";
import { FCheckBoxComp } from "../../../core/form";
import { ICaretUpDown, IMenuVertical, IUserThree } from "../../../core/icons";
import { useRouter } from "vue-router";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import { useGroupStore, useUserStore } from "../../../store/index";
import cache from "../../../composables/swr_cache";
import { Update } from "../../../service/group/interface/group.interface";
import { getItem } from "../../../core/utils/storage.helper";
import Pagination from "../../../components/Pagination.vue";

// initialize router
const router = useRouter();

// initialize store
const groupStore = useGroupStore();
const userStore = useUserStore();

// variables
const openCalender = ref(false);
const confirmMessage = ref({ message: "", id: "" });
const showSuccess = ref(false);
const showConfirm = ref(false);
const disabled = ref(true);
const groupRemoveId = ref("");
const loading = ref(false);
const deleting = ref(false);
const isEmptyTable = ref(false);
const responseData = ref<any>({ data: [], message: "" });
const successMessage = ref("");
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10);  // Make sure this is set to the page size used in the API
const totalItems = ref(0);

// emit
const emit = defineEmits<{ 
  (e: "refetchDepartment"): void;
  (e: "showCreateDepartment"): void;  
  (e: "updateId", id: string): void;
}>();

// methods
const showOptions = (id: string) => {
  const element = document.getElementById(id);
  if (element?.classList.contains("hidden")) {
    element.classList.replace("hidden", "block");
  } else {
    element?.classList.replace("block", "hidden");
  }
};
const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;

// Access the organisationId safely
const organisationId = parsedUserInfo?.customerInfo?.organisationId;

console.log("Organisation ID:", organisationId);

// const fetchGroups = async () => {
//   loading.value = true;

//   const departmentData = cache("departments");
//   if (typeof departmentData !== "undefined") {
//     responseData.value.data = departmentData;
//     loading.value = false;
//   }

//   const response = await request(groupStore.index(), loading);
//   // console.log(loading.value);

//   const successResponse = handleSuccess(response);

//   if (successResponse && typeof successResponse !== "undefined") {
//     responseData.value = successResponse.data;
//     console.log("_______",successResponse.data);
//   }
// };

const fetchGroups = async (page = 1) => {
  loading.value = true;

  const departmentData = cache("departments");
  if (typeof departmentData !== "undefined") {
    responseData.value.data = departmentData;
    loading.value = false;
  }

  const response = await request(groupStore.index(organisationId, 10, page), loading);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {

    responseData.value = successResponse.data; 
    // responseData.value.data = successResponse.data.data.pageItems;
    currentPage.value = successResponse.data.data.currentPage;
    totalPages.value = successResponse.data.data.numberOfPages;
    totalItems.value = successResponse.data.data.pageSize * totalPages.value;
    console.log("Updated responseData:", responseData.value);

    await Promise.all(responseData.value.data.pageItems.map(async (department: any) => {
      const organisationId = department.organisationId;
      const departmentId = department.id;

      try {
        const employeeCountResponse = await groupStore.fetchEmployeesCount(organisationId, departmentId);
        const activeEmployeeCountResponse = await groupStore.fetchActiveEmployeesCount(organisationId, departmentId);

        // Assuming the response has a structure like { data: { count: number } }
        department.employeeCount = employeeCountResponse.data;
        department.activeEmployeeCount = activeEmployeeCountResponse.data;
      } catch (error) {
        console.error(`Error fetching counts for department ${departmentId}:`, error);
      }
    }));

    console.log("Updated department data with employee counts:", responseData.value.data.pageItems);
  }
};


fetchGroups(currentPage.value);
const updatePage = (page: number) => {
  fetchGroups(page);
}

const removeGroup = async () => {
  deleting.value = true;

  const response = await request(
    groupStore.delete(groupRemoveId.value),
    deleting
  );
  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (typeof successResponse !== "undefined") {
    responseData.value.data = responseData.value.data.filter((data: any) => {
      return data.id !== groupRemoveId.value;
    });
    successMessage.value = `Department with id'${groupRemoveId.value}' was successfully deleted`;
    emit("refetchDepartment");
  }
};

const confirmRemoveGroup = () => {
  confirmMessage.value.message = `Do you really  want to delete department with id '${groupRemoveId.value}' `;
  confirmMessage.value.id = groupRemoveId.value;
  showConfirm.value = true;
};
</script>
<template>
  <!-- Table -->
  <div
    class="bg-white rounded-t-lg divide-y overflow-auto scrollbar-hide w-full divide-grey-200"
  >
    <!-- confirm alert -->
    <confirmAlert
      :showConfirm="showConfirm"
      @closeConfirm="showConfirm = false"
      v-if="showConfirm == true"
    >
      <template #title> Delete</template>
      <template #confirm>
        <span @click="[removeGroup(), (showConfirm = false)]">
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
      <div
        class="flex items-center justify-between"
        v-if="responseData && responseData.data.pageItems"
      >
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
          <!--  -->
          <!-- <div class="relative cursor-pointer">
            <div class="flex items-center space-x-2 cursor-pointer">
              <span
                @click="openCalender = !openCalender"
                class="text-sm text-black-200"
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
          </div> -->
        </div>

        <!-- buttons -->
        <div class="flex items-center space-x-4 pr-6 flex-shrink-0">
          <!-- <button
            class="bg-[#003b3d] py-3 font-medium rounded-full text-white px-4+1 text-sm"
          >
            Download Data
          </button> -->
          <button
            @click="confirmRemoveGroup"
            :disabled="disabled"
            :class="disabled == true ? 'disabled:opacity-75' : ' '"
            class="text-red text-sm font-medium bg-red-light px-4+1 py-3 rounded-full"
          >
            <spinner v-if="deleting == true" />
            <span v-else>Remove Department</span>
          </button>
        </div>
      </div>
      <!--  -->
      <div class="py-6">
        <div class="align-middle inline-block min-w-full">
          <div class="overflow-auto scrollbar-hide sm:rounded-lg">
            <table class="min-w-full table-fixed">
              <thead
                v-if="responseData && responseData.data.pageItems"
                class="text-black-200 text-sm text-left"
              >
                <tr>
                  <th
                    scope="col"
                    class="py-4 font-normal text-left flex items-center space-x-3 flex-shrink-0"
                  >
                    <span> Name </span>
                  </th>
                  <th scope=" col" class="py-4 font-normal text-left">
                    Employees
                  </th>
                  <th scope="col" class="py-4 font-normal text-left">Tax</th>
                  <th scope="col" class="py-4 font-normal text-left">
                    Pensions
                  </th>
                  <th scope="col" class="py-4 font-normal text-left">
                    Health Access
                  </th>
                  <th scope="col" class="py-4 font-normal text-left">
                    Tax Remit
                  </th>
                  <th scope="col" class="py-4 font-normal text-left">
                    Pension Remit
                  </th>
                  <th scope="col" class="py-4 font-normal text-left">
                    Salary Breakdown
                  </th>
                  <th scope="col" class="py-4 font-normal text-left">Action</th>
                </tr>
              </thead>
              <tbody
                v-if="responseData && responseData.data.pageItems"
                class="bg-white divide-y divide-grey-200"
              >
                <tr
                  @click="[(groupRemoveId = department.id), (disabled = false)]"
                  v-for="department in responseData.data.pageItems"
                  :key="department.id"
                  class="text-black-100"
                  :class="
                    groupRemoveId === department.id ? 'bg-blue-lighter' : ''
                  "
                >
                  <td class="py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-3">
                      <div class="flex flex-col">
                        <span class="text-sm font-semimedium">
                          {{ department.name }}</span
                        >
                        <span class="text-xs text-gray-rgba-3">{{department.supportingName}}</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="text-left flex flex-col">
                      <span class="text-sm font-semimedium"></span>
                      <span class="text-sm font-semimedium">{{ department.employeeCount }}</span>
                      <span class="text-xs">{{ department.activeEmployeeCount }} active</span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="font-normal text-left flex flex-col">
                      <span :class="department.settings?.tax ? 'text-green bg-green-rgba' : 'text-red bg-red-rgba'" class="text-xs font-semimedium p-1 rounded-full text-center max-w-[60px]">
                        {{ department.settings?.tax ? "Enabled" : "Disabled" }}
                      </span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="font-normal text-left flex flex-col">
                      <span :class="department.settings?.pension ? 'text-green bg-green-rgba' : 'text-red bg-red-rgba'" class="text-xs font-semimedium p-1 rounded-full text-center max-w-[60px]">
                        {{ department.settings?.pension ? "Enabled" : "Disabled" }}
                      </span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="font-normal text-left flex flex-col">
                      <span :class="department.settings?.healthAccess ? 'text-green bg-green-rgba' : 'text-red bg-red-rgba'" class="text-xs font-semimedium p-1 rounded-full text-center max-w-[60px]">
                        {{ department.settings?.healthAccess ? "Enabled" : "Disabled" }}
                      </span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="font-normal text-left flex flex-col">
                      <span :class="department.settings?.taxRemit ? 'text-green bg-green-rgba' : 'text-red bg-red-rgba'" class="text-xs font-semimedium p-1 rounded-full text-center max-w-[60px]">
                        {{ department.settings?.taxRemit ? "Enabled" : "Disabled" }}
                      </span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="font-normal text-left flex flex-col">
                      <span :class="department.settings?.pensionRemit ? 'text-green bg-green-rgba' : 'text-red bg-red-rgba'" class="text-xs font-semimedium p-1 rounded-full text-center max-w-[60px]">
                        {{ department.settings?.pensionRemit ? "Enabled" : "Disabled" }}
                      </span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="font-normal text-left flex flex-col">
                      <span :class="department.settings?.salaryBreakdown ? 'text-green bg-green-rgba' : 'text-red bg-red-rgba'" class="text-xs font-semimedium p-1 rounded-full text-center max-w-[60px]">
                        {{ department.settings?.salaryBreakdown ? "Enabled" : "Disabled" }}
                      </span>
                    </div>
                  </td>
                  <td class="py-4 text-left whitespace-nowrap w-[18%]">
                    <div class="flex items-center justify-between space-x-2">
                      <button
                        :disabled="true"
                        @click="
                          router.push(
                            `/dashboard/employees/departments/${department.id}`
                          )
                        "
                        class="text-[#003b3d] bg-red-light text-sm text-bold px-4+1 py-2 rounded-full"
                      >
                        Manage Department
                      </button>

                      <button
                          :disabled="true"
                          @click="
                              [
                                $emit('showCreateDepartment'),
                                $emit('updateId', department.id),
                                showOptions(department.id + 'options'),
                              ]
                            "
                        class="text-[#003b3d] bg-red-light text-sm text-bold px-4+1 py-2 rounded-full"
                      >
                        Edit
                      </button>


                      <!-- <div class="relative w-full space-x-2">
                        <div
                          :id="department.id + 'options'"
                          class="bg-white rounded-lg text-sm space-y-3 absolute hidden right-2 top-0 p-4 shadow-lg"
                        >
                          <p
                            @click="
                              [
                                $emit('showCreateDepartment'),
                                $emit('updateId', department.id),
                                showOptions(department.id + 'options'),
                              ]
                            "
                          >
                            Edit
                          </p>
                        </div>
                        <button>
                          <IMenuVertical
                            @click="showOptions(department.id + 'options')"
                          />
                        </button>
                      </div> -->
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
                    <template #heading> Department </template>
                    <template #desc>
                      All departments will be displayed here. Click on the
                      “create department” <br />
                      to start managing departments
                    </template>
                    <template #actions>
                      <button
                        @click="$emit('showCreateDepartment')"
                        class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
                      >
                        + Add new department
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
          v-if="responseData && responseData.data.pageItems"
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
