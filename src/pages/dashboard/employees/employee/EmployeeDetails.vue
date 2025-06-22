<script lang="ts" setup>
import { ref, computed, inject, provide, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { IArrowLeftTail } from "../../../../core/icons";
import { isActiveRoute } from "../../../../core/router";
import spinner from "../components/timer/Spinner.vue";

import confirmAlert from "../components/alerts/ConfirmAlert.vue";
import SuccessAlert from "../components/alerts/SuccessAlert.vue";
import { request } from "../../../../composables/request.composable";
import handleError from "../../../../composables/handle_error.composable";
import handleSuccess from "../../../../composables/handle_success.composable";

import { useEmployeeStore, useUserStore } from "../../../../store/index";

import { useRoute } from "vue-router";
import { getItem } from "../../../../core/utils/storage.helper";
// import { data } from "autoprefixer";

// initialize route
const route = useRoute();

// initialize store
const employeeStore = useEmployeeStore();
const userStore = useUserStore();
const deleteEmployeesId = ref<string[]>([]);
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));

const parsedUserInfo =
  typeof userInfo.value === "string"
    ? JSON.parse(userInfo.value)
    : userInfo.value;

// const organisationId = Array.isArray(route.params.id)
//   ? route.params.id[0]
//   : route.params.id;
// console.log("org id", organisationId);

// variables
const router = useRouter();
const render = inject<any>("render");
const isEditForm = ref(false);
// Provide isEditForm to child components
provide("isEditForm", isEditForm);
const employeeName = ref("....");
const childComponent = ref();
const employeeData = ref<any[]>([]); // This will store the fetched company data
const data = ref({
  email: "",
  gender: "",
  telephone: "",
  account_details: {
    bank: "",
    account_number: "",
    gross_salary: "",
    base_salary: "",
  },
  others: {
    department: "",
    employmentType: "",
    tax_id: "",
  },
});

const banks = ["Bank of America", "Chase", "Wells Fargo", "Citibank"];
const departments = ["Department A", "Department B", "Department C"];
const employentTypes = ["Full-Time", "Contract"];
const pageSize = ref(10); // Define pageSize with a default value
const responseData = ref<any>({ message: "" });
const showSuccess = ref(false);
const showConfirm = ref(false);
const confirmType = ref("");
const loading = ref(false);
const deleting = ref(false);
const confirmMessage = ref({ message: "" });

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

// computed
// const employeeId = Array.isArray(route.params.id)
//   ? route.params.id[1]
//   : route.params.id;
// console.log("employee id", employeeId);

const organisationId = route.params.organisationId as string;
const employeeId = route.params.employeeId as string;

// console.log("Organisation ID:", organisationId);
// console.log("Employee ID:", employeeId);

const fetchEmployeeById = async () => {
  loading.value = true;

  try {
    const response = await request(
      employeeStore.getEmployeeById(Number(organisationId), Number(employeeId))
    );

    if (response && response.data) {
      employeeData.value = [response.data.data]; // Ensure consistent array structure
    } else {
      console.error("No data found in response:", response);
    }
  } catch (error) {
    console.error("Failed to fetch company:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEmployeeById();
});
</script>

<template>
  <div
    class="space-y-9 min-h-screen border border-[#62666929] rounded-lg py-8 px-16"
  >
    <div>
      <h3 class="text-black-rgba font-medium text-lg">Update Profile</h3>
      <span class="text-sm text-gray-rgba-3"
        >Edit your profile information</span
      >
    </div>
    <form
      @submit.prevent="saveChanges"
      class="space-y-8"
      v-for="employee in employeeData"
      :key="employee.id"
    >
      <div class="space-y-6">
        <!-- Contact Section -->
        <h4 class="text-lg text-black-200 font-medium">Contact</h4>
        <div class="grid lg:grid-cols-3 gap-6">
          <!-- First Name -->
          <div class="relative">
            <input
              type="text"
              id="name"
              maxlength="100"
              placeholder="Name of Employee"
              class="input-float peer pr-10.5"
              :value="`${employee.employee.user.firstname} ${employee.employee.user.lastname}`"
              readonly
              disabled
            />
          </div>

          <!-- Email -->
          <div class="relative">
            <input
              type="text"
              id="name"
              maxlength="100"
              placeholder="Email Address"
              class="input-float peer pr-10.5"
              :value="employee.employee.user.email"
              readonly
              disabled
            />
          </div>
          <!-- Gender -->
          <div class="relative">
            <input
              type="text"
              id="name"
              maxlength="100"
              placeholder="Gender"
              class="input-float peer pr-10.5"
              :value="employee.employee.user.gender"
              readonly
              disabled
            />
          </div>
          <!-- Phone Number -->
          <div class="relative">
            <input
              type="text"
              id="name"
              maxlength="100"
              placeholder="Phone number"
              class="input-float peer pr-10.5"
              :value="employee.employee.user.phone.number"
              readonly
              disabled
            />
          </div>
        </div>
      </div>
      <!-- Bank Details Section -->
      <div class="space-y-6">
        <h4 class="text-lg text-black-200 font-medium">Bank Details</h4>
        <div class="grid lg:grid-cols-3 gap-6">
          <!-- Bank Name -->
          <div class="relative">
            <select
              id="bank"
              v-model="data.account_details.bank"
              class="input-float peer pr-10.5"
            >
              <option disabled value="">Bank</option>
              <option v-for="bank in banks" :key="bank" :value="bank">
                {{ bank }}
              </option>
            </select>
          </div>
          <!-- Account Number -->
          <div class="relative">
            <input
              type="text"
              id="account-number"
              v-model="data.account_details.account_number"
              maxlength="15"
              class="input-float peer pr-10.5"
              placeholder="Account Number"
            />
          </div>
          <!-- Gross Salary -->
          <div class="relative">
            <input
              type="text"
              id="name"
              maxlength="100"
              placeholder="Gross Salary"
              class="input-float peer pr-10.5"
              :value="employee.employee.grade.grossPay"
              readonly
              disabled
            />
          </div>
          <!-- Base Salary -->
          <div class="relative">
            <input
              type="text"
              id="base-salary"
              v-model="data.account_details.base_salary"
              maxlength="55"
              class="input-float peer pr-10.5"
              placeholder="Base Salary"
            />
          </div>
        </div>
      </div>

      <!-- Others Section -->
      <div class="space-y-6">
        <h4 class="text-lg text-black-200 font-medium">Others</h4>
        <div class="grid lg:grid-cols-3 gap-6">
          <!-- Department -->
          <div class="relative">
            <input
              type="text"
              id="name"
              maxlength="100"
              placeholder="Department"
              class="input-float peer pr-10.5"
              :value="employee.employee.department.departmentName"
              readonly
              disabled
            />
          </div>
          <!-- Employment Type -->
          <div class="relative">
            <input
              type="text"
              id="name"
              maxlength="100"
              placeholder="Employment Type"
              class="input-float peer pr-10.5"
              :value="employee.employee.type"
              readonly
              disabled
            />
          </div>
          <!-- Tax ID -->
          <div class="relative">
            <input
              type="text"
              id="name"
              maxlength="100"
              placeholder="Tax Id"
              class="input-float peer pr-10.5"
              :value="employee.employee.department.taxId"
              readonly
              disabled
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.input-float {
  border: 1px solid #ccc;
  padding: 12px 16px;
  font-size: 16px;
  width: 100%;
  border-radius: 8px; /* rounded-lg */
}
.input-float-label {
  position: absolute;
  top: -10px;
  left: 12px;
  font-size: 12px;
  background: white;
  padding: 0 4px;
}
.input-float:focus {
  outline: none;
  border-color: #000000; /* Border color on focus */
}

select,
input::placeholder {
  color: #626669;
}
</style>
