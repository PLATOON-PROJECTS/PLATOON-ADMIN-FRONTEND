<script lang="ts" setup>
import spinner from "../../../../components/timer/Spinner.vue";
import { ref, onMounted } from "vue";
import { FCheckBoxComp } from "../../../../core/form";
import EmptyState from "../../../../components/EmptyState.vue";
import { IUserThree } from "../../../../core/icons";
import { useRouter, useRoute } from "vue-router";
import { request } from "../../../../composables/request.composable";
import handleError from "../../../../composables/handle_error.composable";
import handleSuccess from "../../../../composables/handle_success.composable";
import { useEmployeeStore, useUserStore } from "../../../../store/index";

// initialize route and  router
const router = useRouter();
const route = useRoute();
// initialize store
const employeeStore = useEmployeeStore();
const userStore = useUserStore();

// variables
const employeesId = ref<string[]>([]);
const loading = ref(false);
const disabled = ref(true);
const responseData = ref<any>({ data: [], message: "" });

const checkState = (id: any) => {
  return employeesId.value.includes(id) ? true : false;
};
const handleEmployee = (id: any) => {
  if (employeesId.value.includes(id)) {
    employeesId.value = employeesId.value.filter((value: any) => {
      return value !== id;
    });
  } else {
    employeesId.value.push(id);
  }
};

const addAllEmployeesId = () => {
  if (employeesId.value[0]) {
    employeesId.value.length = 0;
  } else {
    responseData.value.data.forEach((value: any) => {
      employeesId.value.push(value.id);
    });
  }
};

const fetchEmployeeByDepartment = async () => {
  if ((route.params.id as string) !== "") {
    loading.value = true;
    const response = await request(
      employeeStore.employeesInDepartment(route.params.id as string),
      loading
    );

    // handleError(response, userStore);
    const successResponse = handleSuccess(response);

    if (successResponse && typeof successResponse !== "undefined") {
      disabled.value = false;
      responseData.value.data = successResponse.data.data;
      // console.log(successResponse.data);
    }
  }
};

// hooks
fetchEmployeeByDepartment();
</script>
<template>
  <div class="space-y-4">
    <spinner
      v-if="loading == true"
      class="flex justify-center items-center lg:h-[400px] h-[300px]"
    />
    <div v-else>
      <div
        class="flex items-center space-x-3 pl-6"
        v-if="responseData && responseData.data[0]"
      >
        <FCheckBoxComp
          :value="
            employeesId.length === responseData.data.length ? true : false
          "
          name="employees"
          @click="addAllEmployeesId()"
        />
        <span class="text-black-200 font-normal text-sm">Select All</span>
      </div>
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
                  <div class="w-[22px]"></div>
                  <span> Name </span>
                </th>
                <th scope=" col" class="py-4 font-normal text-left">
                  Date added
                </th>
                <th scope="col" class="py-4 font-normal text-left">Grade</th>
                <th scope="col" class="py-4 font-normal text-left">Type</th>
                <th scope="col" class="py-4 font-normal text-left">
                  Current Department
                </th>
              </tr>
            </thead>
            <tbody v-if="responseData && responseData.data[0]" class="bg-white">
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
                        >{{ user.firstname }} {{ user.lastname }}</span
                      >
                    </div>
                  </div>
                </td>
                <td class="py-4 whitespace-nowrap w-[20%]">
                  <div class="text-left flex flex-col">
                    <span class="text-sm font-semimedium">{{
                      user.created_at.split("T")[0]
                    }}</span>
                  </div>
                </td>
                <td class="py-4 text-left whitespace-nowrap w-[20%]">
                  <div class="font-normal flex flex-col">
                    <span class="text-sm font-semimedium">{{
                      user.grade_id ? user.grade.name : ""
                    }}</span>
                  </div>
                </td>
                <td class="py-4 whitespace-nowrap w-[20%]">
                  <div class="font-normal text-left flex flex-col">
                    <span class="text-sm font-semimedium">Full Time</span>
                  </div>
                </td>
                <td class="py-4 whitespace-nowrap w-[15%]">
                  <div class="font-normal text-left flex flex-col">
                    <span class="text-sm font-semimedium">{{
                      user.department ? user.group.name : ""
                    }}</span>
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
                  <template #heading> Department Employees </template>
                  <template #desc>
                    All employees belonging to the selected department will be
                    displayed<br />
                    here.
                  </template>
                </EmptyState>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
