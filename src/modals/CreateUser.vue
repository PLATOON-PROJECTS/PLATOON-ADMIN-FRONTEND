<script setup lang="ts">
import { ref, inject, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { request } from "../composables/request.composable";
import handleSuccess from "../composables/handle_success.composable";
import handleError from "../composables/handle_error.composable";
import { useAuthStore, useUserStore } from "../store/index";
import SuccessAlert from "../components/alerts/SuccessAlert.vue";
import spinner from "../components/timer/Spinner.vue";
import ButtonBlue from "../components/buttons/ButtonBlue.vue";
import { IClose, IArrowDown } from "../core/icons";
import { useEmployeeStore } from "../store/index";
import { getItem } from "../core/utils/storage.helper";
import useVuelidate from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";

// Reactive form data
const data = ref({
  firstname: "",
  lastname: "",
  email: "",
  phoneNumber: "",
  countryCode: "+234", // Default country code
});

// Store initialization
const userStore = useUserStore();

const router = useRouter();

// State variables
const loading = ref(false);
const showSuccess = ref(false);
const responseData = ref({ message: "New user created successful" });
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));

// Emit events
const emit = defineEmits<{ (e: "fetchUsers" | "close"): void }>();

// Injected properties
const openCreateUser = inject<any>("openCreateUser");

// Additional state
const invalidDomain = ref(false);
const users = ref<any[]>([]);
const roles = ref<any[]>([]);
const selectedRole = ref("");
const showRoleDropdown = ref(false);

const parsedUserInfo =
  typeof userInfo.value === "string"
    ? JSON.parse(userInfo.value)
    : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;

// Validation rules
const rules = computed(() => ({
  firstname: {
    required: helpers.withMessage("First Name is required", required),
  },
  lastname: {
    required: helpers.withMessage("Last Name is required", required),
  },
  email: {
    required: helpers.withMessage("Email address is required", required),
    email: helpers.withMessage("Must be a valid email", email),
  },
}));

const v$ = useVuelidate(rules, data);

async function checkDomainExists(email: string | null) {
  if (!email) return false;
  const domain = email.split("@")[1];
  try {
    await fetch(`https://${domain}`, { mode: "no-cors" });
    return true;
  } catch (error) {
    return false;
  }
}

const handleCreate = async () => {
  const isFormValid = await v$.value.$validate();
  invalidDomain.value = false;

  if (!isFormValid) {
    console.error("Form is not valid", v$.value);
    return null;
  }

  const formData = {
    firstname: data.value.firstname,
    lastname: data.value.lastname,
    email: data.value.email,
    countryCode: data.value.countryCode,
    phoneNumber: Number(data.value.phoneNumber),
  };
  loading.value = true;

  try {
    const isDomainValid = await checkDomainExists(data.value.email);
    if (!isDomainValid) {
      loading.value = false;
      invalidDomain.value = true;
      return null;
    }

    const response = await request(userStore.create(formData), loading);
    // Check if response is valid
    if (!response || !response.data) {
      console.error("Unexpected response structure:", response);
      return null;
    }

    // Assuming a successful response structure
    if (!response.data.data) {
      console.error("Unexpected response structure:", response);
      return null;
    }

    handleSuccess(response, showSuccess);
    responseData.value.message = "Submitted successfully.";
    showSuccess.value = true;

    return response; // Return the created user
  } catch (error) {
    console.error("Error in handleCreate:", error);
    return null;
  } finally {
    loading.value = false;
  }
};

const fetchRoles = async () => {
  loading.value = true;
  try {
    const response = await userStore.fetchRoles();
    roles.value = response.filter(
      (role: { name: string }) =>
        role.name !== "OrganisationSuperAdmin" &&
        role.name !== "OrganisationAdmin"
    );
  } catch (error) {
    console.error("Error fetching roles:", error);
  } finally {
    loading.value = false;
  }
};

const selectRole = (role: any) => {
  selectedRole.value = role.name;
  showRoleDropdown.value = false;
};

const assignRole = async () => {
  // Validate form fields
  const isFormValid = await v$.value.$validate();
  invalidDomain.value = false;

  if (!isFormValid) {
    responseData.value.message = "Please fill in all required fields.";
    console.error("Form validation failed", v$.value);
    return;
  }

  if (!selectedRole.value) {
    responseData.value.message = "Please select a role before proceeding.";
    console.error("Role not selected.");
    return;
  }

  loading.value = true;

  const createdUser = await handleCreate();
  if (!createdUser || !createdUser.data || !createdUser.data.data) {
    responseData.value.message = "User creation failed.";
    console.error("User creation failed. Response:", createdUser);
    loading.value = false;
    return;
  }

  const selectedRoleData = roles.value.find(
    (role) => role.name === selectedRole.value
  );

  if (!selectedRoleData) {
    responseData.value.message = "Selected role is invalid.";
    console.error("Role not found. Available roles:", roles.value);
    loading.value = false;
    return;
  }

  const requestBody = {
    userId: createdUser.data.data,
    roleId: selectedRoleData.id,
  };

  try {
    const response = await userStore.assignRole(
      requestBody.userId,
      requestBody.roleId
    );

    if (response && response.succeeded) {
      showSuccess.value = true;
      responseData.value.message =
        "User created and role assigned successfully!";
      resetForm();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      console.error("Role assignment failed. Response:", response);
      responseData.value.message = response.message || "Failed to assign role.";
    }
  } catch (error) {
    console.error("Error assigning role:", error);
    responseData.value.message = "Failed to assign role.";
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  data.value = {
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    countryCode: "+234", // Reset to default country code
  };
  selectedRole.value = "";
  showRoleDropdown.value = false;
};

onMounted(fetchRoles);
</script>

<template>
  <div
    class="w-screen z-50 bg-[#000000A3] min-h-screen fixed flex items-center justify-center"
  >
    <div class="lg:p-9 p-5 lg:w-1/3 rounded-lg bg-white space-y-7">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-black-rgba font-medium text-2xl">Create New User</h3>
          <span class="text-sm font-medium text-black-rgba-100"
            >Enter details</span
          >
        </div>
        <button
          @click="openCreateUser = false"
          class="bg-blue-lighter rounded-full p-3"
        >
          <IClose />
        </button>
      </div>

      <!-- Form Fields -->
      <form @submit.prevent="assignRole" class="space-y-4">
        <successAlert
          v-if="showSuccess == true"
          @closeSuccess="showSuccess = false"
          :showSuccess="showSuccess"
        >
          <template #otherMessage>CLOSE</template>
          {{ responseData.message }}
        </successAlert>

        <!-- First Name -->
        <div class="flex flex-col">
          <label for="firstname" class="text-sm text-[#626669A3]"
            >First Name</label
          >
          <input
            id="firstname"
            type="text"
            v-model="data.firstname"
            class="input-field"
            placeholder="Enter First Name"
          />
          <span v-if="v$.firstname.$error" class="text-red-500 text-sm">
            {{ v$.firstname.$errors[0].$message }}
          </span>
        </div>

        <!-- Last Name -->
        <div class="flex flex-col">
          <label for="lastname" class="text-sm text-[#626669A3]"
            >Last Name</label
          >
          <input
            id="lastname"
            type="text"
            v-model="data.lastname"
            class="input-field"
            placeholder="Enter Last Name"
          />
          <span v-if="v$.lastname.$error" class="text-red-500 text-sm">
            {{ v$.lastname.$errors[0].$message }}
          </span>
        </div>

        <!-- Email -->
        <div class="flex flex-col">
          <label for="email" class="text-sm text-[#626669A3]">Email</label>
          <input
            id="email"
            type="email"
            v-model="data.email"
            class="input-field"
            placeholder="Enter Email"
          />
          <span v-if="v$.email.$error" class="text-red-500 text-sm">
            {{ v$.email.$errors[0].$message }}
          </span>
        </div>

        <!-- Phone Number -->
        <div class="flex flex-col">
          <label for="phoneNumber" class="text-sm text-[#626669A3]"
            >Phone Number</label
          >
          <div class="flex gap-8 items-center w-full">
            <div class="w-[20%]">
              <input
                id="countryCode"
                type="text"
                v-model="data.countryCode"
                class="input-field w-1/4 mr-2"
                readonly
              />
            </div>
            <div class="w-[80%]">
              <input
                id="phoneNumber"
                type="text"
                v-model="data.phoneNumber"
                class="input-field w-full"
                placeholder="Enter Phone Number"
              />
            </div>
          </div>
        </div>

        <!-- Role Dropdown -->
        <div
          class="font-normal relative w-auto text-left rounded-xl px-4 h-[48px] text-gray-rgba-3 border border-[#d1d5db] text-black"
        >
          <!-- Dropdown Input -->
          <div class="flex justify-between items-center h-full">
            <input
              @click="
                showRoleDropdown = !showRoleDropdown;
                if (!roles.length) fetchRoles();
              "
              type="text"
              v-model="selectedRole"
              class="text-sm text-black w-full border-none outline-none focus:outline-none cursor-pointer"
              placeholder="Select access role"
              readonly
            />
            <span @click="showRoleDropdown = !showRoleDropdown">
              <IArrowDown class="cursor-pointer" />
            </span>
          </div>

          <!-- Dropdown Menu -->
          <div
            v-if="showRoleDropdown"
            class="absolute z-50 h-56 right-0 shadow-lg scrollbar-hide overflow-auto top-15 w-full bg-white rounded-lg"
          >
            <div class="space-y-5 p-6 text-[#626669A3] text-sm">
              <!-- Display roles -->
              <div v-if="roles.length > 0">
                <div
                  v-for="role in roles"
                  :key="role.name"
                  @click="selectRole(role)"
                  class="cursor-pointer mb-4 hover:text-black transition-colors"
                  :class="{
                    'text-black font-medium': selectedRole === role.name,
                  }"
                >
                  {{ role.name }}
                </div>
              </div>

              <!-- No roles available -->
              <div v-else class="text-gray-500">No roles available.</div>
            </div>
          </div>

          <!-- Role Selection Error Message -->
          <span v-if="!selectedRole && v$.$dirty" class="text-red-500 text-sm">
            Please select a role.
          </span>
        </div>

        <!-- Create User Button -->
        <div class="flex pt-4 w-[30%]">
          <ButtonBlue type="submit" :disabled="loading">
            <template v-slot:placeholder>Create User</template>
          </ButtonBlue>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.input-field {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem;
  color: #000;
  outline: none;
  transition: box-shadow 0.2s;
}
.input-field:focus {
  box-shadow: 0 0 0 2px #3b82f6;
}
.dropdown {
  position: absolute;
  z-index: 50;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
}
.dropdown-item {
  padding: 0.5rem;
  cursor: pointer;
}
.dropdown-item:hover {
  background-color: #e5e7eb;
}
</style>
