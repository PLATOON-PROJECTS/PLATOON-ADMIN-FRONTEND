<script lang="ts" setup>
import { ref, computed,inject, provide } from "vue";
import { useRouter } from "vue-router";
import { IArrowLeftTail } from "../core/icons";
import { isActiveRoute } from "../core/router";
import spinner from "../components/timer/Spinner.vue";

import confirmAlert from "../components/alerts/ConfirmAlert.vue";
import SuccessAlert from "../components/alerts/SuccessAlert.vue";
import { request } from "../composables/request.composable";
import handleError from "../composables/handle_error.composable";
import handleSuccess from "../composables/handle_success.composable";

import { useEmployeeStore, useUserStore } from "../store/index";

import { useRoute } from "vue-router";
import { getItem } from "../core/utils/storage.helper";

// initialize route
const route = useRoute();

// initialize store
const employeeStore = useEmployeeStore();
const userStore = useUserStore();
const deleteEmployeesId = ref<string[]>([]);
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));

const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;

const router = useRouter();

const render = inject<any>("render");

// variables
const isEditForm = ref(false);
// Provide isEditForm to child components
provide('isEditForm', isEditForm);
const employeeName = ref("....");
const childComponent = ref();
const responseData = ref<any>({message: ""});
const showSuccess = ref(false);
const showConfirm = ref(false);
const confirmType = ref("");
const deleting = ref(false);
const confirmMessage = ref({ message: "" });
// computed
const employeeId = computed(() => {
  return route.params.id as string;
});

// methods
const setEmployeeName = (value: string) => {
  employeeName.value = value;
};
const setEditStatus = (value: string) => {
  isEditForm.value = !value;
};

// methods
const saveChanges = () => {
  childComponent.value.saveChanges();
};
// const deleteEmployee = async () => {
//   // deleting.value = true;
//   // const response = await request(
//   //   employeeStore.delete(employeeId.value),
//   //   deleting
//   // );

//   // handleError(response, userStore);
//   // const successResponse = handleSuccess(response, showSuccess);
//   confirmType.value = "delete";
//   confirmMessage.value.message = `Do you really  want to delete multiple employees(${deleteEmployeesId.value.length})?  `;
//   showConfirm.value = true;

//   if (successResponse && typeof successResponse !== "undefined") {
//     router.go(-1);
//   }
// };

const confirmRemoveEmployees = () => {
  confirmType.value = "delete";
  confirmMessage.value.message = `Do you really  want to delete multiple employees(${deleteEmployeesId.value.length})?  `;
  showConfirm.value = true;
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
      // responseData.value.data = responseData.value.data.filter((data: any) => {
      //   return !deleteEmployeesId.value.includes(data.id) && data.id;
      // });
      responseData.value.message = "Employee(s) deleted succesfully";
      deleteEmployeesId.value.length = 0;
      window.location.href = "/dashboard/employees/";
      render.value = true;
    }
  }
};
const deleteEmployee = async () => {
  deleting.value = true;

  const response = await request(
    employeeStore.deleteEmployee(employeeId.value, organisationId),
    deleting
  );

  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (successResponse && typeof successResponse !== "undefined") {
    responseData.value.message = "Employee deleted successfully";
    window.location.href = "/dashboard/employees/";
    render.value = true;
  }
};
const confirmRemoveEmployee = () => {
  confirmType.value = "delete";
  confirmMessage.value.message = `Do you really want to terminate this employee?`;
  showConfirm.value = true;
};

// handleEmployee(route.params.id);
</script>
<template>
  <div>
    <div class="bg-white rounded-t-lg divide-y divide-grey-200">
      <confirmAlert
      :showConfirm="showConfirm"
      @closeConfirm="showConfirm = false"
      v-if="showConfirm == true"
    >
      <template #title> Delete</template>
      <template #confirm>
        <span
          @click="
            [
              deleteEmployee(),
              (showConfirm = false),
            ]
          "
        >
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
      <div class="px-6+1">
        <div
          class="flex items-center justify-between py-8 overflow-auto scrollbar-hide lg:space-x-0 space-x-4"
        >
          <div class="flex items-start space-x-5-1">
            <button @click="router.back()">
              <IArrowLeftTail />
            </button>
            <div>
              <h3
                class="text-black-rgba font-medium lg:text-2xl text-lg whitespace-nowrap"
              >
                {{ employeeName }}
              </h3>
              <span class="text-sm text-gray-rgba-3">Manage employee</span>
            </div>
          </div>

          <div class="flex space-x-4">
            <button
              v-if="!isEditForm"
              @click="
                [(isEditForm = !isEditForm), (childComponent.disabled = false)]
              "
              class="border border-[#003b3d] text-[#003b3d] px-4+1 py-2.5+1 rounded-full text-sm whitespace-nowrap"
            >
              Edit Employee Details
            </button>
            <button
              v-if="!isEditForm"
              @click="confirmRemoveEmployee()"
              class="bg-red-100 text-white px-4+1 py-2.5+1 rounded-full text-sm whitespace-nowrap"
            >
              <spinner v-if="deleting == true" />
              <span v-else>Terminate</span>
            </button>
            <button
              v-if="isEditForm"
              @click="saveChanges()"
              class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
            >
              <spinner v-if="childComponent.loading == true" />
              <span v-else>Update Changes</span>
            </button>
          </div>
        </div>
        <!--  -->
        <!-- nav tabs -->
        <div
          class="flex items-center space-x-8 text-blue-900 w-full overflow-auto scrollbar-hide"
        >
          <div
            @click="router.push({ name: 'dashboard.employees.single.details' })"
            role="button"
            class="pb-6 text-sm cursor-pointer whitespace-nowrap"
            :class="[
              isActiveRoute('dashboard.employees.single.details')
                ? 'border-b-2  border-blue-400 font-medium text-[#003b3d]'
                : '',
            ]"
          >
            <span> Details </span>
          </div>
          <div
            @click="router.push({ name: 'dashboard.employees.single.salary' })"
            role="button"
            class="pb-6 text-sm cursor-pointer whitespace-nowrap"
            :class="[
              isActiveRoute('dashboard.employees.single.salary')
                ? 'border-b-2 border-blue-400 font-medium text-[#003b3d]'
                : '',
            ]"
          >
            <span> Salary Breakdown </span>
          </div>
          <div
            @click="
              router.push({
                name: 'dashboard.employees.single.payroll-history',
              })
            "
            role="button"
            class="pb-6 text-sm cursor-pointer whitespace-nowrap"
            :class="[
              isActiveRoute('dashboard.employees.single.payroll-history')
                ? 'border-b-2 border-blue-400 font-medium text-[#003b3d]'
                : '',
            ]"
          >
            <span> Payroll History </span>
          </div>
          <!--  -->
        </div>
      </div>
      <!--  -->
      <div class="p-6">
        <router-view v-slot="{ Component }">
          <component
            ref="childComponent"
            :is="Component"
            @setSingleEmployeeName="setEmployeeName"
            @doNotEdit="setEditStatus"
            :child-component-ref="childComponent" 
          ></component>
        </router-view>
        <!--  -->
      </div>
    </div>
  </div>
</template>
