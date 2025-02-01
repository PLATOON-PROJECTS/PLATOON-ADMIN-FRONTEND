<script setup lang="ts">
import { onMounted, ref, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import spinner from "../components/timer/Spinner.vue";
import { IArrowLeftTail } from "../core/icons";
import ButtonBlue from "../components/buttons/ButtonBlue.vue";
import { useAuthStore, useCompanyStore, useUserStore } from "../store/index";
import { request } from "../composables/request.composable";
import handleError from "../composables/handle_error.composable";
import handleSuccess from "../composables/handle_success.composable";
import confirmAlert from "../components/alerts/ConfirmAlert.vue";
import SuccessAlert from "../components/alerts/SuccessAlert.vue";

const childComponent = ref<any>();
const route = useRoute();
const router = useRouter();
const companyData = ref<any[]>([]); // This will store the fetched company data
const companyStore = useCompanyStore();
const loading = ref(false);
const successMessage = ref("Action successful");
const confirmMessage = ref({ message: "", id: "" });
const showConfirm = ref(false);
const showConfirmSuspend = ref(false);

const authStore = useAuthStore();
const userStore = useUserStore();

// variables
let data = ref<{
  firstname: string | null;
  lastname: string | null;
  telephone: string | null;
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
  photo: string | null;
  organisationName?: string;
  country?: string;
  city?: string;
  state?: string;
  street?: string;
}>({
  firstname: null,
  lastname: null,
  telephone: null,
  email: null,
  password: null,
  confirmPassword: null,
  photo: null,
  organisationName: undefined,
  country: undefined,
  city: undefined,
  state: undefined,
  street: undefined,
});
const showSuccess = ref(false);
const disabled = ref(true);
const valid = ref(false);
const is_open = ref(false);
const responseData = ref<any>({ message: "Action successful" });
const render = inject<any>("render");

const organisationId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

const capitalizeFirstLetter = (name: string | null) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const fetchCompaniesById = async () => {
  loading.value = true;

  try {
    const response = await request(
      companyStore.companyById(Number(organisationId))
    );

    if (response && response.data) {
      companyData.value = [response.data.data]; // Ensure consistent array structure
    } else {
      console.error("No data found in response:", response);
    }
  } catch (error) {
    console.error("Failed to fetch company:", error);
  } finally {
    loading.value = false;
  }
};

// Computed property to determine if the company is suspended
const isSuspended = computed(() => {
  if (companyData.value.length > 0) {
    return !companyData.value[0].isActive; // If isActive is false, it's suspended
  }
  return false;
});

onMounted(() => {
  fetchCompaniesById();
});

const DeleteCompany = async (organisationId: string) => {
  loading.value = true;

  try {
    // Call the API to delete the company
    const response = await request(
      companyStore.delete(organisationId) // Ensure this method exists in your store
    );

    if (response && response.data) {
      // Remove the deleted company from the list
      companyData.value = companyData.value.filter(
        (company) => company.organisationId !== organisationId
      );

      // Show success message
      successMessage.value = "Company deleted successfully";
      showSuccess.value = true;
    } else {
      console.error("Failed to delete company:", response);
    }
  } catch (error) {
    console.error("Error deleting company:", error);
    handleError(error, "Error deleting company");
  } finally {
    loading.value = false;
  }
};

const confirmRemoveUser = (organisationId: string) => {
  console.log("Confirming deletion for id:", organisationId); // Debug log

  confirmMessage.value.message = `Do you really want to delete this company?`;
  confirmMessage.value.id = organisationId;
  showConfirm.value = true; // Ensure this is set to true
};

const Suspension = async (organisationId: string) => {
  loading.value = true;
  try {
    const response = await request(companyStore.suspend(organisationId));
    if (response && response.data) {
      successMessage.value = "Company suspended successfully";
      showSuccess.value = true;
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      console.error("Failed to suspend company:", response);
    }
  } catch (error) {
    console.error("Error suspending company:", error);
    handleError(error, "Error suspending company");
  } finally {
    loading.value = false;
  }
};

const removeSuspension = async (organisationId: string) => {
  loading.value = true;
  try {
    const response = await request(
      companyStore.removeSuspension(organisationId)
    );
    if (response && response.data) {
      successMessage.value = "Suspension removed successfully";
      showSuccess.value = true;
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      console.error("Failed to remove suspension:", response);
    }
  } catch (error) {
    console.error("Error removing suspension:", error);
    handleError(error, "Error removing suspension");
  } finally {
    loading.value = false;
  }
};

const confirmSuspension = (organisationId: string) => {
  console.log("Confirming Suspension for id:", organisationId);
  confirmMessage.value.message = `Do you really want to suspend this company?`;
  confirmMessage.value.id = organisationId;
  showConfirmSuspend.value = true; // Use a separate flag
};

const confirmremoveSuspension = (organisationId: string) => {
  console.log("Confirming Suspension removal for id:", organisationId);
  confirmMessage.value.message = `Do you really want to remove suspension for this company?`;
  confirmMessage.value.id = organisationId;
  showConfirmSuspend.value = true;
};

const activeTab = computed(() => route.path);
</script>

<template>
  <div class="px-6 py-9">
    <!-- Iterate over companyData to display each company's details -->
    <div v-for="company in companyData" :key="company.id">
      <div class="space-y-6">
        <div
          class="bg-white py-6 h-[10rem] px-4 rounded-t-lg items-center text-black-200 cursor-pointer text-sm justify-between flex space-x-8 whitespace-nowrap overflow-auto scrollbar-hide"
        >
          <div class="flex flex-col">
            <div class="flex items-start space-x-5-1">
              <button @click="router.push('/dashboard/companies')">
                <IArrowLeftTail />
              </button>
              <div>
                <h3
                  class="text-black-rgba font-medium lg:text-2xl text-lg whitespace-nowrap"
                >
                  {{ company.name }}
                </h3>
                <span class="text-sm text-gray-rgba-3">Manage Company</span>
              </div>
            </div>
            <div>
              <div class="w-full flex space-x-6 border-b border-grey pt-7">
                <span
                  @click="
                    router.push(
                      `/dashboard/company-settings/${organisationId}/company-information`
                    )
                  "
                  :class="[
                    activeTab.includes('company-information')
                      ? 'border-b-2 border-[#003b3d] pb-7 text-[#003b3d] font-semimedium'
                      : '',
                    'font-normal cursor-pointer',
                  ]"
                >
                  Company Information
                </span>

                <span
                  @click="
                    router.push(
                      `/dashboard/company-settings/${organisationId}/contact-information`
                    )
                  "
                  :class="[
                    activeTab.includes('contact-information')
                      ? 'border-b-2 border-blue pb-7 text-blue font-semimedium'
                      : '',
                    'font-normal cursor-pointer',
                  ]"
                >
                  Contact Information
                </span>

                <span
                  @click="
                    router.push(
                      `/dashboard/company-settings/${organisationId}/payroll-history`
                    )
                  "
                  :class="[
                    activeTab.includes('payroll-history')
                      ? 'border-b-2 border-blue pb-7 text-blue font-semimedium'
                      : '',
                    'font-normal cursor-pointer',
                  ]"
                >
                  Payroll History
                </span>

                <span
                  @click="
                    router.push(
                      `/dashboard/company-settings/${organisationId}/employees-logs`
                    )
                  "
                  :class="[
                    activeTab.includes('employees-logs')
                      ? 'border-b-2 border-blue pb-7 text-blue font-semimedium'
                      : '',
                    'font-normal cursor-pointer',
                  ]"
                >
                  Employees
                </span>
              </div>
            </div>
          </div>
          <div
            class="flex"
            v-if="
              activeTab.includes('company-information') ||
              activeTab.includes('contact-information')
            "
          >
            <div class="flex gap-4">
              <!-- Suspend/Remove Suspension Button -->
              <ButtonBlue
                @click="
                  isSuspended
                    ? confirmremoveSuspension(company.id)
                    : confirmSuspension(company.id)
                "
                :disabled="childComponent?.disabled"
                :style="{
                  backgroundColor: isSuspended ? '#28a745' : '#FFB400',
                  color: '#fff',
                }"
              >
                <template v-slot:placeholder>
                  <spinner v-if="loading" />
                  <span v-else>{{
                    isSuspended ? "Remove Suspension" : "Suspend"
                  }}</span>
                </template>
              </ButtonBlue>

              <!-- Delete Button -->
              <ButtonBlue
                @click="confirmRemoveUser(company.id)"
                :disabled="childComponent?.disabled"
                class="bg-[#FF4C51] text-white hover:bg-red-600 disabled:bg-gray-300"
              >
                <template v-slot:placeholder>
                  <spinner v-if="loading" />
                  <span v-else>Delete</span>
                </template>
              </ButtonBlue>
            </div>
          </div>
        </div>
      </div>

      <router-view
        v-slot="{ Component }"
        class="bg-white py-6 min-h-[80vh] h-auto"
      >
        <component
          ref="childComponent"
          :is="Component"
          @loadingTrue="loading = true"
          @loadingFalse="loading = false"
        />
      </router-view>
    </div>
  </div>

  <!-- Confirm Alerts moved outside other elements -->
  <confirmAlert
    :showConfirm="showConfirmSuspend"
    @closeConfirm="showConfirmSuspend = false"
    v-if="showConfirmSuspend"
  >
    <template #title>{{
      isSuspended ? "Remove Suspension" : "Suspend"
    }}</template>
    <template #message>{{ confirmMessage.message }}</template>
    <template #confirm>
      <span
        @click="
          isSuspended
            ? [
                removeSuspension(confirmMessage.id),
                (showConfirmSuspend = false),
              ]
            : [Suspension(confirmMessage.id), (showConfirmSuspend = false)]
        "
      >
        CONFIRM
      </span>
    </template>
  </confirmAlert>

  <confirmAlert
    :showConfirm="showConfirm"
    @closeConfirm="showConfirm = false"
    v-if="showConfirm"
  >
    <template #title>Delete</template>
    <template #message>{{ confirmMessage.message }}</template>
    <template #confirm>
      <span @click="[DeleteCompany(confirmMessage.id), (showConfirm = false)]">
        CONFIRM
      </span>
    </template>
  </confirmAlert>

  <!-- Success Alert -->
  <successAlert
    :showSuccess="showSuccess"
    @closeSuccess="showSuccess = false"
    v-if="showSuccess"
  >
    <template #otherMessage>CLOSE</template>
    {{ successMessage }}
  </successAlert>

  <!-- Loading Spinner -->
  <spinner
    v-if="loading"
    class="flex justify-center items-center lg:h-[400px] h-[300px]"
  />
</template>
<style>
.confirm-alert {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
