<script lang="ts" setup>
import confirmAlert from "../../../components/alerts/ConfirmAlert.vue";
import Departments from "../../../components/dropdowns/department.vue";
import { FCheckBoxComp, FRadioBox } from "../../../core/form";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import { ref, inject, provide, watch } from "vue";
import spinner from "../../../components/timer/Spinner.vue";
import { ICaretUpDown, IMenuVertical, IUserThree } from "../../../core/icons";
import CalenderInterface from "../../../layouts/CalenderLayout.vue";
import EmptyState from "../../../components/EmptyState.vue";
import { useRouter } from "vue-router";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import { useEmployeeStore, useUserStore } from "../../../store/index";
import cache from "../../../composables/swr_cache";
import { useGroupStore } from "../../../store/index";
import { getItem } from "../../../core/utils/storage.helper";
import Pagination from "../../../components/Pagination.vue";

const router = useRouter();

// initialize store
const employeeStore = useEmployeeStore();
const userStore = useUserStore();
const groupStore = useGroupStore();
// variables
const departmentName = ref("");
const confirmType = ref("");
const downloading = ref(false);
const showDepartment = ref(false);
const data = ref({ department: "" });
const chossenDepartment = "";
const openCalender = ref(false);
const deleteEmployeesId = ref<string[]>([]);
const showSuccess = ref(false);
const deleteEmployeeId = ref<any>();
const loading = ref(false);
const confirmMessage = ref({ message: "" });
const deleting = ref(false);
const showConfirm = ref(false);
const isEmptyTable = ref(false);
const responseData = ref<any>({ data: [], message: "" });
const departmentState = ref(true)
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10);  // Make sure this is set to the page size used in the API
const totalItems = ref(0);


// provide and inject
provide("showDepartment", showDepartment);
provide("selectedDepartment", [data, departmentName]);
const render = inject<any>("render");
const emit = defineEmits(['refetchInvite', 'showInviteEmployee', 'emptyDepartment']) 
const departmentValues = ref();
const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;
// methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${formattedDate} ${formattedTime}`;
};

const capitalizeName = (name: string) => {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const download = () => {
  confirmType.value = "download";
  confirmMessage.value.message =
    "Employee  data will be downloaded to your local storage";

  showConfirm.value = true;
};

const confirmDownload = async () => {
  downloading.value = true;

  const response = await request(employeeStore.download(), downloading);

  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);
    // console.log('---')
    successResponse.message = "Employee data download began successfully";
    responseData.value.message= successResponse.message;

    // console.log(successResponse.data.data);
    // console.log('---')

    const link = document.createElement("a");
    link.setAttribute("href", successResponse.data.data.link);

    link.setAttribute("download", "platoon_employee_record.txt");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const checkState = (id: any) => {
  return deleteEmployeesId.value.includes(id) ? true : false;
};
const handleEmployee = (id: any) => {
  if (deleteEmployeesId.value.includes(id)) {
    deleteEmployeesId.value = deleteEmployeesId.value.filter((value: any) => {
      return value !== id;
    });
  } else {
    deleteEmployeesId.value.push(id);
  }
};
const addAllEmployeeForDelete = () => {
  if (deleteEmployeesId.value[0]) {
    deleteEmployeesId.value.length = 0;
  } else {
    responseData.value.data.forEach((value: any) => {
      deleteEmployeesId.value.push(value.id);
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
    responseData.value.data.length = 0;
    responseData.value.data = successResponse.data.data;
    // console.log(successResponse.data);
  }
  data.value.department = "";
};
const fetchEmployees = async (page = 1) => {
  loading.value = true;

  // console.log("fetching employeee");
  const totalEmployeeCached = cache("total_employees");
  console.log("##########",totalEmployeeCached);

  if (typeof totalEmployeeCached !== "undefined") {
    loading.value = false;
    responseData.value.data = totalEmployeeCached;
  }
  console.log("ertyuio",responseData.value.data);
  const response = await request(employeeStore.index(organisationId, 10, page), loading);
  // console.log(loading.value);

  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    cache("total_employees", successResponse.data.data.pageItems);
    responseData.value.data = successResponse.data.data.pageItems;
    currentPage.value = successResponse.data.data.currentPage;
    totalPages.value = successResponse.data.data.numberOfPages;
    totalItems.value = successResponse.data.data.pageSize * totalPages.value; 
    // console.log(successResponse.data);
  }
};

const deleteManyEmployees = async () => {
  if (deleteEmployeesId.value[0]) {
    deleting.value = true;

    const response = await request(
      employeeStore.deleteMany(deleteEmployeesId.value),
      deleting
    );

    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);

    if (successResponse && typeof successResponse !== "undefined") {
      responseData.value.data = responseData.value.data.filter((data: any) => {
        return !deleteEmployeesId.value.includes(data.id) && data.id;
      });
      responseData.value.message = "Employee(s) deleted succesfully";
      deleteEmployeesId.value.length = 0;
      render.value = true;
    }
  }
};

const getDepartments = async (page = 1) => {
  const cachedData = cache("departments");

  if (typeof cachedData !== "undefined" && cachedData.length) {
    departmentValues.value = cachedData;
  }

  const response = await request(groupStore.index(organisationId, 10, page));

// handleError(response, userStore);
  const successResponse = handleSuccess(response);
  // console.log('----gg');

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);

    departmentValues.value = successResponse.data.data.pageItems;

    cache("departments", successResponse.data.data.pageItems);
    // console.log(departmentValues.value);
    // console.log('+++++');
  } else {
    emit('emptyDepartment', false);
    departmentValues.value = "You do not have any departments at the moment";
  }
};

getDepartments();

// const deleteEmployee = async (id: any) => {
//   deleting.value = true;

//   const response = await request(employeeStore.delete(id), deleting);

//   handleError(response, userStore);
//   const successResponse = handleSuccess(response, showSuccess);

//   if (successResponse && typeof successResponse !== "undefined") {
//     responseData.value.data = responseData.value.data.filter((data: any) => {
//       return data.id !== id;
//     });
//   }
//   deleteEmployeeId.value = null;
// };

const confirmRemoveEmployees = () => {
  confirmType.value = "delete";
  confirmMessage.value.message = `Do you really  want to delete multiple employees(${deleteEmployeesId.value.length})?  `;
  showConfirm.value = true;
};

const openEmployee = () => {
  if(departmentValues.value && departmentValues.value.length){
    departmentState.value = true;
    emit('showInviteEmployee')
  }else{
    departmentState.value = false;
  }

}

fetchEmployees(currentPage.value);
const updatePage = (page: number) => {
  fetchEmployees(page);
}

// emit
// const emit = defineEmits<{ (e: "refetchInvite"): void }>();

// watchers
watch(showDepartment, (newValue, oldValue) => {
  if (newValue !== oldValue && data.value.department != "") {
    fetchEmployeeByDepartment();
  }
});
</script>
<template>
  <!-- Table -->
  <div
    class="bg-white rounded-t-lg divide-y divide-grey-200 overflow-auto scrollbar-hide w-full"
  >
    <confirmAlert
      :showConfirm="showConfirm"
      @closeConfirm="showConfirm = false"
      v-if="showConfirm == true"
    >
      <template #title> Delete</template>
      <!-- <template #confirm>
        <span
          @click="
            [
              confirmType === 'delete'
                ? deleteManyEmployees()
                : confirmDownload(),
              (showConfirm = false),
            ]
          "
        >
          CONFIRM</span
        ></template -->
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

    <spinner
      v-if="loading == true"
      class="flex justify-center items-center lg:h-[400px] h-[300px]"
    />
    <div v-else>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center space-x-6 p-6 flex-shrink-0">
          <!-- <div class="flex items-center space-x-2 cursor-pointer">
            <span class="text-sm text-black-200 flex" @click="fetchEmployees"
              >All Employees</span
            >
            <span>
              <ICaretUpDown />
            </span>
          </div> -->
          <!--  -->
          <div class="flex relative items-center space-x-2 cursor-pointer">
            <span
              @click="showDepartment = !showDepartment"
              class="text-sm text-black-200"
              >{{
                departmentName === "" ? "Sort by Department" : departmentName
              }}</span
            >
            <span>
              <ICaretUpDown @click="showDepartment = !showDepartment" />
            </span>

            <div
              class="absolute z-50 max-h-56 right-0 shadow-lg scrollbar-hide overflow-auto top-5 w-full"
              v-if="showDepartment == true"
            >
              <div>
                <component :is="Departments"></component>
              </div>
            </div>
          </div>
          <!--  -->
          <!-- <div class="relative cursor-pointer">
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
          </div> -->
        </div>

        <!-- buttons -->
        <div
          v-if="responseData && responseData.data[0]"
          class="flex items-center space-x-4 pr-6 flex-shrink-0"
        >
          <button
            @click="download"
            class="bg-[#003b3d] py-3 font-medium rounded-full text-white px-4+1 text-sm"
          >
            <spinner v-if="downloading == true"></spinner>
            <span v-else> Download Data</span>
          </button>

          <button
            :disabled="deleteEmployeesId[0] ? false : true"
            class="text-red text-sm font-medium bg-red-light px-4+1 py-3 rounded-full"
            :class="!deleteEmployeesId[0] ? 'disabled:opacity-75' : ' '"
            @click="confirmRemoveEmployees()"
          >
            <spinner v-if="deleting == true" />
            <span v-else> Remove Employee</span>
          </button>
        </div>
      </div>
      <!--  -->

      <div class="py-6">
        <div class="align-middle inline-block min-w-full">
          <fieldset class="overflow-hidden sm:rounded-lg">
            <table class="min-w-full table-fixed">
              <thead
                class="text-black-200 text-sm text-left"
                v-if="responseData && responseData.data[0]"
              >
                <tr>
                  <th
                    scope="col"
                    class="py-4 font-normal text-left flex items-center space-x-3 flex-shrink-0"
                  >
                    <!-- <CheckBox customClasses="indeterminate-check" /> -->

                    <div class="space-x-2 flex items-center">
                      <span>
                        <FCheckBoxComp
                          :value="
                            deleteEmployeesId.length ===
                            responseData.data.length
                              ? true
                              : false
                          "
                          name="employees"
                          @click="addAllEmployeeForDelete()"
                      /></span>

                      <span>Name</span>
                    </div>
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
                class="bg-white divide-y divide-grey-200"
                v-if="responseData && responseData.data[0]"
              >
                <tr
                  v-for="user in responseData.data"
                  :key="user.id"
                  class="text-black-100"
                >
                  <td class="py-4 w-[25%]">
                    <div class="flex items-center space-x-3 flex-shrink-0">
                      <FCheckBoxComp
                        :value="checkState(user.id)"
                        @click="handleEmployee(user.id)"
                      />
                      <div class="flex flex-col">
                        <span class="text-sm font-semimedium"
                          >{{capitalizeName(user.firstName) }} {{ capitalizeName(user.lastName) }}</span
                        >
                        <span class="text-xs text-gray-rgba-3 flex">{{
                          user.email
                        }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="text-left flex flex-col">
                      <span class="text-sm font-semimedium">{{ formatDate(user.createdAt) }}</span>
                      <span class="text-xs text-green">{{ user.isActive ? 'Active' : 'Inactive' }}</span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="font-normal text-left flex flex-col">
                      <span class="text-sm font-semimedium">{{
                        user.phone.number ? user.phone.number : ""
                      }}</span>
                      <span class="text-xs text-gray-rgba-3">Mobile</span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="font-normal text-left flex flex-col">
                      <span class="text-sm font-semimedium">{{
                        user.department && user.department !==null ? user.department.departmentName : "---"
                      }}</span>
                      <span class="text-xs text-gray-rgba-3">{{
                        user.department && user.department !==null ? user.department.supportingName : "---"
                      }}</span>
                    </div>
                  </td>
                  <td class="py-4 text-left whitespace-nowrap">
                    <div class="font-normal flex flex-col">
                      <span class="text-sm font-semimedium">{{
                        user.grades.id && user.grades !== null ? user.grades.code : "---"
                      }}</span>
                      <span class="text-xs text-gray-rgba-3">{{user.employmentType}}</span>
                    </div>
                  </td>
                  <td class="py-4 text-left whitespace-nowrap w-[18%]">
                    <div class="flex items-center justify-between">
                      <button
                        @click="
                          router.push(
                            `/dashboard/employees/view-employee/${user.id}`
                          )
                        "
                        class="text-[#003b3d] bg-red-light text-sm text-bold px-4+1 py-2 rounded-full"
                      >
                        View Employee
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
                      <button v-if="departmentState"
                        @click="openEmployee()"
                        class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
                      >
                        + Invite Employees
                      </button>
                      <button v-else
                        @click="router.push({name: 'dashboard.employees.departments'})"
                        class="bg-[#4a7e6a]/70 text-white px-4+1 py-2.5+1 rounded-full text-sm capitalize"
                      >
                        Your department is empty, please create new department. 
                      </button>
                    </template>
                  </EmptyState>
                </tr>
              </tbody>
            </table>
          </fieldset>
        </div>
        <!-- Pagination -->

        <!-- <div
          v-if="responseData && responseData.data[0]"
          class="px-6 mt-8 hidden items-center justify-between whitespace-nowrap lg:space-x-0 space-x-3"
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
