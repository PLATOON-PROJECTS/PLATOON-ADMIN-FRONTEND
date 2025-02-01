<script setup lang="ts">
import { reactive, inject, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { request } from "../composables/request.composable";
import handleSuccess from "../composables/handle_success.composable";
import handleError from "../composables/handle_error.composable";
import { useAuthStore, useUserStore } from "../store/index";
import spinner from "../components/timer/Spinner.vue";
import ButtonBlue from "../components/buttons/ButtonBlue.vue";
import { IClose } from "../core/icons";
import { IArrowDown } from "../core/icons";
import { useEmployeeStore } from "../store/index";
import { getItem } from "../core/utils/storage.helper";

// initialize store
const authStore = useAuthStore();
const userStore = useUserStore();
const employeeStore = useEmployeeStore();

// variables
const loading = ref(false);
const showSuccess = ref(false);
const responseData = ref<any>({ message: "Signup successful" });
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));

// emit
const emit = defineEmits<{ (e: "fetchUsers"): void }>();

// inject
const openCreateUser = inject<any>("openCreateUser");

// methods
const employeeData = ref<any>([]);
const employees = ref<any[]>([]);
const roles = ref<any[]>([]);
const selectedEmployee = ref("");
const showEmployeeDropdown = ref(false);
const selectedRole = ref("");
const showRoleDropdown = ref(false);
const parsedUserInfo =
  typeof userInfo.value === "string"
    ? JSON.parse(userInfo.value)
    : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;

const fetchEmployees = async () => {
  loading.value = true;
  try {
    const response = await employeeStore.index(organisationId, 10, 1);
    if (response.data && response.data.succeeded) {
      employees.value = response.data.data.pageItems;
    }
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};

const selectEmployee = (employee: any) => {
  selectedEmployee.value = `${employee.firstName} ${employee.lastName}`;
  showEmployeeDropdown.value = false;
};
const fetchRoles = async () => {
  loading.value = true;
  try {
    const response = await userStore.fetchRoles();
    // if (response.data && response.data.succeeded) {
    roles.value = response;
    // }

    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};
const selectRole = (role: any) => {
  selectedRole.value = `${role.name}`;
  showRoleDropdown.value = false;
};

const assignRole = async () => {
  loading.value = true;
  const selectedEmployeeData = employees.value.find(
    (emp) => `${emp.firstName} ${emp.lastName}` === selectedEmployee.value
  );
  const selectedRoleData = roles.value.find(
    (role) => role.name === selectedRole.value
  );

  if (selectedEmployeeData && selectedRoleData) {
    const requestBody = {
      userId: selectedEmployeeData.userId,
      roleId: selectedRoleData.id,
    };

    try {
      const response = await userStore.assignRole(
        requestBody.userId,
        requestBody.roleId
      );
      if (response) {
        showSuccess.value = true;
        responseData.value.message = "Role assigned successfully!";
      }
    } catch (error) {
      console.error(error);
      responseData.value.message = "Failed to assign role.";
    }
  } else {
    responseData.value.message = "Please select both employee and role.";
  }
  loading.value = false;
};

fetchEmployees();
fetchRoles();
</script>

<template>
  <Transition
    name="edit-pension-modal"
    enter-active-class="animate__animated animate__fadeInRight"
    leave-active-class="animate__animated animate__fadeOutRight"
    :duration="400"
  >
    <form>
      <successAlert
        v-if="showSuccess == true"
        @closeSuccess="showSuccess = false"
        :showSuccess="showSuccess"
      >
        <template #otherMessage>CLOSE</template>
        {{ responseData.message }}
      </successAlert>
      <div class="w-screen z-50 bg-[#000000A3] min-h-screen h-full fixed">
        <div class="flex justify-center">
          <div
            class="lg:p-9 p-5 lg:w-1/3 rounded-lg inline-block align-middle bg-white mt-2 space-y-7"
          >
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-black-rgba font-medium text-2xl">
                  Create User
                </h3>
                <span class="text-sm font-semimedium text-black-rgba-100"
                  >Enter details</span
                >
              </div>
              <button
                @click="openCreateUser = false"
                class="bg-blue-lighter rounded-full top-12 right-12 p-3"
              >
                <IClose />
              </button>
            </div>
            <!--  -->
            <div class="space-y-6">
              <div
                class="font-normal relative w-auto text-left rounded-xl px-4 h-[48px] text-gray-rgba-3 border text-black"
              >
                <div class="flex justify-between items-center h-full">
                  <input
                    @click="
                      showEmployeeDropdown = !showEmployeeDropdown;
                      if (!employees.length) fetchEmployees();
                    "
                    type="text"
                    v-model="selectedEmployee"
                    class="text-sm text-black w-full border-none outline-none focus:outline-none"
                    placeholder="Select Employee"
                  />
                  <span>
                    <IArrowDown
                      @click="showEmployeeDropdown = !showEmployeeDropdown"
                    />
                  </span>
                </div>
                <div
                  class="absolute z-50 h-56 right-0 shadow-lg scrollbar-hide overflow-auto top-15 w-full"
                  v-if="showEmployeeDropdown == true"
                >
                  <!-- <ul class="bg-white border border-gray-300 max-h-48 overflow-y-auto">
                    <li v-for="employee in employees" :key="employee.id" @click="selectEmployee(employee)" class="cursor-pointer p-2 hover:bg-gray-200">
                      {{ employee.firstName }} {{ employee.lastName }}
                    </li>
                  </ul> -->
                  <div
                    class="space-y-5 p-6 text-[#626669A3] bg-white text-sm rounded-lg w-auto min-h-max"
                  >
                    <div v-if="employees[0]">
                      <div v-for="employee in employees" :key="employee.id">
                        <p
                          @click="selectEmployee(employee)"
                          class="cursor-pointer mb-4 hover-black"
                        >
                          {{ employee.firstName }} {{ employee.lastName }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <!--  -->
                </div>
              </div>

              <div
                class="font-normal relative w-auto text-left rounded-xl px-4 h-[48px] text-gray-rgba-3 border text-black"
              >
                <div class="flex justify-between items-center h-full">
                  <input
                    @click="
                      showRoleDropdown = !showRoleDropdown;
                      if (!roles.length) fetchRoles();
                    "
                    type="text"
                    v-model="selectedRole"
                    class="text-sm text-black w-full border-none outline-none focus:outline-none"
                    placeholder="Select access role"
                  />
                  <span>
                    <IArrowDown @click="showRoleDropdown = !showRoleDropdown" />
                  </span>
                </div>
                <div
                  class="absolute z-50 h-56 right-0 shadow-lg scrollbar-hide overflow-auto top-15 w-full"
                  v-if="showRoleDropdown == true"
                >
                  <div
                    class="space-y-5 p-6 text-[#626669A3] bg-white text-sm rounded-lg w-auto max-h-min"
                  >
                    <div v-if="roles.length > 0">
                      <div v-for="role in roles" :key="role.id">
                        <p
                          @click="selectRole(role)"
                          class="cursor-pointer mb-4 hover-black"
                        >
                          {{ role.name }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <!--  -->
                </div>
              </div>
              <!--  -->
              <div></div>
            </div>
            <div class="flex pb-5">
              <ButtonBlue @click="assignRole" :disabled="loading">
                <template v-slot:placeholder>
                  <spinner v-if="loading == true" />
                  <span v-else>Create User</span>
                </template>
              </ButtonBlue>
            </div>
          </div>
        </div>
      </div>
    </form>
  </Transition>
</template>

<style scoped>
.telinput {
  border-radius: 14px;
}
</style>
