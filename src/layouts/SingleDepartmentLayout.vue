<script lang="ts" setup>
import { ref, computed } from "vue";
import spinner from "../components/timer/Spinner.vue";
import { IArrowLeftTail } from "../core/icons";
import { isActiveRoute } from "../core/router";

import { useRouter, useRoute } from "vue-router";
import { request } from "../composables/request.composable";
import handleError from "../composables/handle_error.composable";
import handleSuccess from "../composables/handle_success.composable";
import { useEmployeeStore, useUserStore, useGroupStore } from "../store/index";

// initialize route and  router
const router = useRouter();
const route = useRoute();
// initialize store
const employeeStore = useEmployeeStore();
const groupStore = useGroupStore();
const userStore = useUserStore();

// variables
const childComponent = ref<any>();
const isEditForm = ref(false);
const loading = ref(false);
const responseData = ref<any>({ data: {} });

// computed
const groupId = computed(() => {
  return route.params.id as string;
});
// methods
const save = async () => {
  loading.value = true;
  await childComponent.value.saveChanges();
  loading.value = false;
};

const fetchEmployee = async () => {
  if ((route.params.id as string) !== "") {
    const response = await request(groupStore.show(groupId.value));

    // handleError(response, userStore);
    const successResponse = handleSuccess(response);

    if (successResponse && typeof successResponse !== "undefined") {
      responseData.value.data = successResponse.data;
      // console.log(successResponse.data);
    }
  }
};

// hooks
// fetchEmployee();
</script>
<template>
  <div>
    <div class="bg-white rounded-t-lg divide-y divide-grey-200">
      <div class="px-6+1">
        <div
          class="sm:flex items-center justify-between py-8 overflow-auto scrollbar-hide lg:space-x-0 space-x-4"
        >
          <div class="flex items-start space-x-5-1">
            <button @click="router.back()">
              <IArrowLeftTail />
            </button>
            <div>
              <h3
                class="text-black-rgba font-medium lg:text-2xl text-lg whitespace-nowrap"
              >
                {{
                  responseData.data.data ? responseData.data.data.name : "...."
                }}
              </h3>
              <span class="text-sm text-gray-rgba-3">Manage department</span>
            </div>
          </div>

          <!-- <div class="flex space-x-4">
            <button
              @click="save()"
              :disabled="childComponent?.disabled"
              :class="
                childComponent?.disabled == true ? 'disabled:opacity-75' : ' '
              "
              class="bg-[#003b3d] text-white sm:px-4+1 sm:py-2.5+1 rounded-full sm:text-sm text-[12px] p-2 py-2 px-4 sm:mt-0 mt-3"
            >
              <spinner v-if="loading == true" />
              <span v-else class="">Save Changes</span>
            </button>
          </div> -->
        </div>
        <!--  -->
        <!-- nav tabs -->
        <div
          class="flex items-center space-x-8 text-blue-900 w-full overflow-auto scrollbar-hide"
        >
          <!-- <div
            @click="
              router.push({
                name: 'dashboard.employees.departments.single.payroll-settings',
              })
            "
            role="button"
            class="pb-6 text-sm cursor-pointer whitespace-nowrap"
            :class="[
              isActiveRoute(
                'dashboard.employees.departments.single.payroll-settings'
              )
                ? 'border-b-2  border-blue-400 font-medium text-blue'
                : '',
            ]"
          >
            <span> Payroll Settings </span>
          </div> -->
          <div
            @click="
              router.push({
                name: 'dashboard.employees.departments.single.employees',
              })
            "
            role="button"
            class="pb-6 text-sm cursor-pointer whitespace-nowrap"
            :class="[
              isActiveRoute('dashboard.employees.departments.single.employees')
                ? 'border-b-2 border-blue-400 font-medium text-[#003b3d]'
                : '',
            ]"
          >
            <span> Employees </span>
          </div>

          <div
            @click="
              router.push({
                name: 'dashboard.employees.departments.single.settings',
              })
            "
            role="button"
            class="pb-6 text-sm cursor-pointer whitespace-nowrap"
            :class="[
              isActiveRoute('dashboard.employees.departments.single.settings')
                ? 'border-b-2 border-blue-400 font-medium text-[#003b3d]'
                : '',
            ]"
          >
            <span> Department Settings </span>
          </div>
          <!--  -->
        </div>
      </div>
      <!--  -->
      <div class="p-6">
        <router-view v-slot="{ Component }">
          <component ref="childComponent" :is="Component" />
        </router-view>
        <!--  -->
      </div>
    </div>
  </div>
</template>
